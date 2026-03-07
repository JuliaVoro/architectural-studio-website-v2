import Link from "next/link";
import { supabaseServerClient } from "@/lib/supabase-client";
import type { Project, ProjectSection } from "@/lib/projects";

async function getProjects(): Promise<Project[]> {
  if (!supabaseServerClient) {
    return [];
  }

  const { data, error } = await supabaseServerClient
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error loading projects:", error);
    return [];
  }

  return data.map((row: any) => ({
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
  }));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <header className="mb-10 space-y-4">
          <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            Portfolio
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">
            Architecture case studies
          </h1>
          <p className="max-w-xl text-sm text-neutral-600">
            A growing collection of projects, each documented through imagery,
            drawings, and an AI-edited narrative.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No projects have been published yet.
            </p>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
              >
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-[0.22em] text-neutral-400">
                    {project.keyFacts.location || "Project"}
                  </div>
                  <div className="font-serif text-lg text-neutral-900">
                    {project.keyFacts.title}
                  </div>
                  {project.introText && (
                    <p className="line-clamp-3 text-xs text-neutral-600">
                      {project.introText}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    {project.keyFacts.year
                      ? project.keyFacts.year
                      : "In progress"}
                  </span>
                  <span className="uppercase tracking-[0.2em]">
                    View project →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

