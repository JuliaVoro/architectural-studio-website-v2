import Link from "next/link";
import { supabaseServerClient } from "@/lib/supabase-client";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import Image from "next/image";

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
    sections: row.sections ?? undefined,
    aiRawResponse: row.ai_raw_response ?? undefined,
  }));
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            Systems
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Overview of AI-generated architectural systems. Click through to preview the
            public systems page.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          New System
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-neutral-200 rounded-lg">
            <p className="text-sm text-neutral-500">
              No systems yet. Start by creating a new one.
            </p>
          </div>
        ) : (
          projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/systems/${project.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand rounded-lg border border-neutral-200">
                <Image
                  src={project.heroImagePath ? getProjectMediaUrl(project.heroImagePath) : "/placeholder.jpg"}
                  alt={project.keyFacts.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-medium text-neutral-900">
                    {project.keyFacts.title}
                  </h3>
                  <span className="rounded-full border border-neutral-300 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">
                  {project.keyFacts.location ?? "—"} • {project.keyFacts.year ?? "—"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

