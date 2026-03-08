import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase-client";
import {
  CreateProjectPayload,
  Project,
  ProjectSection,
} from "@/lib/projects";
import { generateProjectLayout } from "@/lib/ai-generate-project-layout";

function mapRowToProject(row: any): Project {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    featured: row.featured,
    private: row.private || false,
    order: row.order || 0,
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

export async function GET() {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  const { data, error } = await supabaseServerClient
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }

  const projects = (data ?? []).map(mapRowToProject);

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  let payload: CreateProjectPayload;

  try {
    payload = (await request.json()) as CreateProjectPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (!payload.keyFacts?.title) {
    return NextResponse.json(
      { error: "keyFacts.title is required" },
      { status: 400 },
    );
  }

  try {
    const layout = await generateProjectLayout({
      keyFacts: payload.keyFacts,
      notes: payload.notes,
      imagePaths: payload.imagePaths ?? [],
      videoPaths: payload.videoPaths ?? [],
      drawingPaths: payload.drawingPaths ?? [],
    });

    const { data, error } = await supabaseServerClient
      .from("projects")
      .insert({
        status: "published",
        featured: false,
        private: false,
        order: 0, // Will be updated after getting the count
        slug: layout.slug,
        title: layout.title,
        location: payload.keyFacts.location ?? null,
        year: payload.keyFacts.year ?? null,
        size: payload.keyFacts.size ?? null,
        materials: payload.keyFacts.materials ?? null,
        client: payload.keyFacts.client ?? null,
        notes: payload.notes ?? null,
        hero_image_path: layout.hero_image,
        intro_text: layout.intro_text,
        story: layout.story,
        sections: layout.sections,
        key_facts: payload.keyFacts,
        ai_raw_response: layout,
      })
      .select("*")
      .single();

    if (error || !data) {
      console.error("Error inserting project:", error);
      return NextResponse.json(
        { error: "Failed to save project" },
        { status: 500 },
      );
    }

    const projectId = data.id as string;

    const assetsToInsert: any[] = [];

    for (const path of payload.imagePaths ?? []) {
      const originalFilename = path.split("/").pop() || path;
      assetsToInsert.push({
        project_id: projectId,
        type: "image",
        storage_path: path,
        original_filename: originalFilename,
      });
    }

    for (const path of payload.videoPaths ?? []) {
      const originalFilename = path.split("/").pop() || path;
      assetsToInsert.push({
        project_id: projectId,
        type: "video",
        storage_path: path,
        original_filename: originalFilename,
      });
    }

    for (const path of payload.drawingPaths ?? []) {
      const originalFilename = path.split("/").pop() || path;
      assetsToInsert.push({
        project_id: projectId,
        type: "drawing",
        storage_path: path,
        original_filename: originalFilename,
      });
    }

    if (assetsToInsert.length > 0) {
      const { error: assetError } = await supabaseServerClient
        .from("project_assets")
        .insert(assetsToInsert);

      if (assetError) {
        console.error("Error inserting project assets:", assetError);
      }
    }

    const project = mapRowToProject(data);

    return NextResponse.json({ project, layout });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

