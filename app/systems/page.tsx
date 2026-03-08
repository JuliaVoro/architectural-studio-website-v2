import type { Metadata } from "next";
import { supabaseServerClient } from "@/lib/supabase-client";
import type { Project } from "@/lib/projects";
import { StoriesGrid } from "@/components/systems/systems-grid";

async function getProjects(): Promise<Project[]> {
  if (!supabaseServerClient) {
    return [];
  }

  const { data, error } = await supabaseServerClient
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
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
    private: row.private || false,
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

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Selected spatial-service systems. Case studies categorized by strategic system type.",
};

export default async function StoriesPage() {
  const projects = await getProjects();

  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Stories
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Selected Stories
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-8">
            <p className="pt-2 text-base leading-relaxed text-muted-foreground lg:pt-16">
              Each case is categorized by strategic system type, not sector.
              We believe the logic of spatial-service integration transcends
              industry boundaries.
            </p>
          </div>
        </div>

        {/* Grid */}
        <StoriesGrid projects={projects} />
      </div>
    </section>
  );
}
