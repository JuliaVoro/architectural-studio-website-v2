import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase-client";
import type {
  Project,
  ProjectSection,
  FullImageSection,
  TextBlockSection,
  GalleryGridSection,
  TechnicalDrawingsSection,
  MaterialsTableSection,
  VideoSection,
} from "@/lib/projects";
import { HeroImage } from "@/components/projects/HeroImage";
import { HeroVideo } from "@/components/projects/HeroVideo";
import { StoryText } from "@/components/projects/StoryText";
import { FullWidthImage } from "@/components/projects/FullWidthImage";
import { GalleryGrid } from "@/components/projects/GalleryGrid";
import { TechnicalDrawings } from "@/components/projects/TechnicalDrawings";
import { KeyFactsTable } from "@/components/projects/KeyFactsTable";
import { getProjectMediaUrl } from "@/lib/projects";

async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!supabaseServerClient) {
    return null;
  }

  const { data, error } = await supabaseServerClient
    .from("projects")
    .select("*");

  if (error) {
    console.error("Error loading project:", error);
    return null;
  }

  const row = (data ?? []).find((item) => {
    const value = (item.slug ?? "").trim();
    return value === slug.trim();
  });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    featured: row.featured,
    slug: row.slug,
    keyFacts: {
      title: row.title,
      location: row.location ?? undefined,
      year: row.year ?? undefined,
      size: row.size ?? undefined,
      materials: row.materials ?? undefined,
      client: row.client ?? undefined,
    },
    notes: row.notes ?? undefined,
    heroImagePath: row.hero_image_path ?? undefined,
    introText: row.intro_text ?? undefined,
    story: row.story ?? undefined,
    sections: (row.sections as ProjectSection[] | null) ?? undefined,
    aiRawResponse: row.ai_raw_response ?? undefined,
  };
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  const title = `${project.keyFacts.title} – Architecture Case Study`;

  const descriptionPieces = [
    project.keyFacts.location,
    project.keyFacts.year ? String(project.keyFacts.year) : undefined,
    project.keyFacts.size,
  ].filter(Boolean) as string[];

  const description =
    project.introText ??
    (descriptionPieces.length > 0
      ? descriptionPieces.join(" · ")
      : "Architecture case study.");

  const ogImageUrl = project.heroImagePath
    ? getProjectMediaUrl(project.heroImagePath)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const sections = project.sections ?? [];
  
  // Filter out the hero image from sections to avoid duplication
  const filteredSections = sections.filter(section => 
    section.type !== "full_image" || 
    (section.type === "full_image" && section.imagePath !== project.heroImagePath)
  );

  return (
    <div className="bg-neutral-50">
      <HeroImage project={project} />
      {project.story && <StoryText story={project.story} />}
      <KeyFactsTable project={project} />

      {filteredSections.map((section) => {
        switch (section.type) {
          case "full_image": {
            const s = section as FullImageSection;
            return (
              <FullWidthImage
                key={s.id}
                imagePath={s.imagePath}
                caption={s.caption}
              />
            );
          }
          case "text_block": {
            const s = section as TextBlockSection;
            return (
              <section
                key={s.id}
                className="border-b border-neutral-200 bg-white"
              >
                <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
                  {s.heading && (
                    <h2 className="mb-4 font-serif text-xl text-neutral-900">
                      {s.heading}
                    </h2>
                  )}
                  <p className="text-sm leading-relaxed text-neutral-800 md:text-[15px] md:leading-loose">
                    {s.body}
                  </p>
                </div>
              </section>
            );
          }
          case "video": {
            const s = section as VideoSection;
            return (
              <section key={s.id} className="border-b border-neutral-200 bg-white">
                <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
                  {s.label && (
                    <div className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
                      {s.label}
                    </div>
                  )}
                  <div className="aspect-video overflow-hidden rounded-lg border border-neutral-200">
                    <video
                      src={getProjectMediaUrl(s.videoPath)}
                      controls
                      className="h-full w-full object-cover"
                      poster="/placeholder.jpg"
                    />
                  </div>
                  {s.caption && (
                    <p className="mt-4 text-sm text-neutral-600">
                      {s.caption}
                    </p>
                  )}
                </div>
              </section>
            );
          }
          case "gallery_grid": {
            const s = section as GalleryGridSection;
            return (
              <GalleryGrid key={s.id} imagePaths={s.imagePaths ?? []} />
            );
          }
          case "technical_drawings": {
            const s = section as TechnicalDrawingsSection;
            return (
              <TechnicalDrawings
                key={s.id}
                drawingPaths={s.drawingPaths ?? []}
                notes={s.notes}
              />
            );
          }
          case "materials_table": {
            const s = section as MaterialsTableSection;
            return (
              <section
                key={s.id}
                className="border-b border-neutral-200 bg-white"
              >
                <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
                  <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
                    Materials
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-neutral-800">
                    {s.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-baseline justify-between gap-4 border-b border-dotted border-neutral-200 pb-2 last:border-0"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-neutral-600">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.role && (
                          <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                            {item.role}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}

