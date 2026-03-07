import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase-client";
import { Project, ProjectSection } from "@/lib/projects";

function mapRowToProject(row: any): Project {
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

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  const { slug } = await context.params;
  const normalizedSlug = slug.trim();

  const { data, error } = await supabaseServerClient
    .from("projects")
    .select("*");

  if (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }

  const row = (data ?? []).find((item) => {
    const value = (item.slug ?? "").trim();
    return value === normalizedSlug;
  });

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const project = mapRowToProject(row);

  return NextResponse.json({ project });
}

