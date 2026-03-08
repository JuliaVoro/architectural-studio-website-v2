import type { Metadata } from "next";
import Link from "next/link";
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
  QuoteBlockSection,
  DownloadFileSection,
} from "@/lib/projects";
import { HeroImage } from "@/components/projects/HeroImage";
import { HeroVideo } from "@/components/projects/HeroVideo";
import { StoryText } from "@/components/projects/StoryText";
import { FullWidthImage } from "@/components/projects/FullWidthImage";
import { GalleryGrid } from "@/components/projects/GalleryGrid";
import { TechnicalDrawings } from "@/components/projects/TechnicalDrawings";
import { KeyFactsTable } from "@/components/projects/KeyFactsTable";
import { getProjectMediaUrl } from "@/lib/projects";
import { Upload } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!supabaseServerClient) {
    return null;
  }

  const { data, error } = await supabaseServerClient
    .from("projects")
    .select("*");

  if (error || !data) {
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

export async function generateStaticParams() {
  const { data: projects } = await supabaseServerClient
    .from("projects")
    .select("slug")
    .eq("status", "published");

  if (!projects) {
    return [];
  }

  return projects.map((row: any) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

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

export default async function SystemDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const sections = project.sections ?? [];
  
  // Filter out the hero image from sections to avoid duplication
  const filteredSections = sections.filter(section => 
    section.type !== "full_image" || 
    (section.type === "full_image" && section.imagePath !== project.heroImagePath)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link
            href="/systems"
            className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-900"
          >
            ← Back to Stories
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      {project.heroImagePath && (
        <section className="relative w-full">
          <img
            src={getProjectMediaUrl(project.heroImagePath)}
            alt={project.keyFacts.title}
            className="w-full h-auto max-h-[80vh] object-cover"
          />
          {/* Dark overlay mask - matching main page */}
          <div className="absolute inset-0 bg-[#0a0f14]/40" />
          <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#0a0f14]/80 via-[#0a0f14]/40 to-transparent" />
          
          {/* Content overlay - matching main page layout */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="mx-auto w-full max-w-[1400px] px-6 pb-12 lg:px-12 lg:pb-16">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:justify-between">
                {/* Left: empty for alignment */}
                <div className="lg:col-span-1"></div>
                
                {/* Right: project title */}
                <div className="lg:col-span-7">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                    {project.keyFacts.materials?.split(',')[0].trim() || "Architecture"}
                  </p>
                  <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                    {project.keyFacts.title}
                  </h1>
                  <p className="mt-3 text-sm text-white/50">
                    {project.keyFacts.location || "Project"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* Key Facts */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
            {project.keyFacts.location && (
              <div>
                <span className="text-neutral-500">Location</span>
                <p className="text-neutral-900 mt-1">{project.keyFacts.location}</p>
              </div>
            )}
            {project.keyFacts.year && (
              <div>
                <span className="text-neutral-500">Year</span>
                <p className="text-neutral-900 mt-1">{project.keyFacts.year}</p>
              </div>
            )}
            {project.keyFacts.size && (
              <div>
                <span className="text-neutral-500">Size</span>
                <p className="text-neutral-900 mt-1">{project.keyFacts.size}</p>
              </div>
            )}
            {project.keyFacts.materials && (
              <div>
                <span className="text-neutral-500">Materials</span>
                <p className="text-neutral-900 mt-1">{project.keyFacts.materials}</p>
              </div>
            )}
            {project.keyFacts.client && (
              <div>
                <span className="text-neutral-500">Client</span>
                <p className="text-neutral-900 mt-1">{project.keyFacts.client}</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Story */}
        {project.story && (
          <div className="mb-24">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Context
                </p>
              </div>
              <div className="md:col-span-9">
                <div className="prose prose-lg max-w-none">
                  {project.story.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-neutral-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-24">
          {filteredSections.map((section) => {
            
            switch (section.type) {
              case "full_image": {
                const s = section as FullImageSection;
                return (
                  <div key={s.id} className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Image
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="max-w-4xl">
                        <img
                          src={getProjectMediaUrl(s.imagePath)}
                          alt={s.caption || "Project image"}
                          className="w-full h-auto"
                        />
                        {s.caption && s.caption !== "A view of the project showcasing the architectural design and spatial arrangement." && (
                          <p className="text-sm text-neutral-600 mt-4">
                            {s.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              case "text_block": {
                const s = section as TextBlockSection;
                return (
                  <div key={s.id} className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {s.label ? s.label : "NO LABEL"}
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="max-w-3xl">
                        {s.heading && (
                          <h2 className="font-serif text-3xl text-neutral-900 mb-6">
                            {s.heading}
                          </h2>
                        )}
                        <div className="prose prose-lg max-w-none">
                          {s.body.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-neutral-700 leading-relaxed mb-4">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              case "video": {
                const s = section as VideoSection;
                const hasUniqueCaption = s.caption && !s.caption.toLowerCase().includes("video walkthrough");
                
                return (
                  <div key={s.id} className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {s.label || "Video"}
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="max-w-4xl">
                        <div className="aspect-video overflow-hidden rounded-lg bg-black relative">
                          {s.thumbnailPath ? (
                            <img
                              src={getProjectMediaUrl(s.thumbnailPath)}
                              alt="Video thumbnail"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : null}
                          <video
                            src={getProjectMediaUrl(s.videoPath)}
                            controls
                            className="w-full h-full relative z-10"
                            poster={s.thumbnailPath ? getProjectMediaUrl(s.thumbnailPath) : "/placeholder.jpg"}
                          />
                        </div>
                        {hasUniqueCaption && (
                          <p className="text-sm text-neutral-600 mt-4">
                            {s.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              case "gallery_grid": {
                const s = section as GalleryGridSection;
                return (
                  <div key={s.id} className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {s.label || "Gallery"}
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="max-w-5xl">
                        <GalleryGrid imagePaths={s.imagePaths ?? []} />
                      </div>
                    </div>
                  </div>
                );
              }
              case "technical_drawings": {
                const s = section as TechnicalDrawingsSection;
                return (
                  <div key={s.id} className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Drawings
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="max-w-5xl">
                        <TechnicalDrawings
                          drawingPaths={s.drawingPaths ?? []}
                          notes={s.notes}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              case "quote_block": {
                const s = section as QuoteBlockSection;
                return (
                  <div key={s.id} className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {s.label || "Quote"}
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="max-w-4xl">
                        <blockquote className="font-serif text-2xl md:text-3xl text-neutral-900 leading-relaxed">
                          "{s.quote}"
                        </blockquote>
                      </div>
                    </div>
                  </div>
                );
              }
              case "download_file": {
                const s = section as DownloadFileSection;
                return (
                  <div key={s.id} className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Download
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="max-w-3xl">
                        <div className="p-6 border rounded-lg bg-neutral-50">
                          <a
                            href={s.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                          >
                            <Upload className="w-5 h-5" />
                            <span className="font-medium text-lg">{s.fileName || "Download File"}</span>
                          </a>
                          {s.description && (
                            <p className="text-sm text-muted-foreground mt-3">{s.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              default:
                return null;
            }
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 mt-24">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link
              href="/contact"
              className="text-sm font-medium text-neutral-900 transition-colors duration-300 hover:text-neutral-700"
            >
              Start a Conversation →
            </Link>
            <Link
              href="/systems"
              className="text-sm text-neutral-600 transition-colors duration-300 hover:text-neutral-900"
            >
              ← Back to Stories
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
