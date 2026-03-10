import { notFound } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase-client";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import ProjectEditForm from "@/components/admin/project-edit-form";

async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!supabaseServerClient) {
    return null;
  }

  const { data, error } = await supabaseServerClient
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching project:", error);
    return null;
  }

  return {
    id: data.id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    status: data.status,
    featured: data.featured,
    private: data.private || false,
    order: data.order || 0,
    slug: data.slug,
    category: data.category || undefined,
    keyFacts: {
      title: data.title,
      location: data.location ?? undefined,
      year: data.year ?? undefined,
      size: data.size ?? undefined,
      materials: data.materials ?? undefined,
      client: data.client ?? undefined,
    },
    notes: data.notes ?? undefined,
    heroImagePath: data.hero_image_path ?? undefined,
    introText: data.intro_text ?? undefined,
    story: data.story ?? undefined,
    sections: data.sections ?? undefined,
    aiRawResponse: data.ai_raw_response ?? undefined,
  };
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-foreground mb-2">
            Edit System: {project.keyFacts.title}
          </h1>
          <p className="text-muted-foreground">
            Modify project details, content, and media.
          </p>
        </div>

        <ProjectEditForm project={project} />
      </div>
    </div>
  );
}
