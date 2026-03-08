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

async function collectProjectFiles(project: Project): Promise<string[]> {
  const files: string[] = [];
  
  // Add hero image if exists
  if (project.heroImagePath) {
    files.push(project.heroImagePath);
  }
  
  // Collect files from sections
  if (project.sections) {
    for (const section of project.sections) {
      switch (section.type) {
        case "full_image":
          if (section.imagePath) files.push(section.imagePath);
          break;
        case "gallery_grid":
          if (section.imagePaths) files.push(...section.imagePaths);
          break;
        case "technical_drawings":
          if (section.drawingPaths) files.push(...section.drawingPaths);
          break;
        case "video":
          if (section.videoPath) files.push(section.videoPath);
          break;
      }
    }
  }
  
  return files;
}

async function deleteFilesFromStorage(filePaths: string[]) {
  if (!filePaths.length) return;
  
  // Extract filenames from paths
  const fileNames = filePaths.map(path => path.split('/').pop()).filter((name): name is string => Boolean(name));
  
  if (fileNames.length > 0) {
    const { error } = await supabaseServerClient!
      .storage
      .from('project-media')
      .remove(fileNames);
    
    if (error) {
      console.error("Error deleting files from storage:", error);
      // Don't fail the deletion if file cleanup fails
    }
  }
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

export async function POST(
  request: NextRequest,
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

  // Get the request body
  const body = await request.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json(
      { error: "Status is required" },
      { status: 400 },
    );
  }

  // Update the project status
  const { error } = await supabaseServerClient
    .from("projects")
    .update({ status })
    .eq("slug", normalizedSlug);

  if (error) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { error: "Failed to update project status" },
      { status: 500 },
    );
  }

  // Get the updated project
  const { data, error: fetchError } = await supabaseServerClient
    .from("projects")
    .select("*")
    .eq("slug", normalizedSlug)
    .single();

  if (fetchError) {
    return NextResponse.json(
      { error: "Failed to fetch updated project" },
      { status: 500 },
    );
  }

  const project = mapRowToProject(data);
  return NextResponse.json({ project });
}

export async function DELETE(
  request: NextRequest,
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

  // First, get the project to collect its files
  const { data: projectData, error: fetchError } = await supabaseServerClient
    .from("projects")
    .select("*")
    .eq("slug", normalizedSlug)
    .single();

  if (fetchError || !projectData) {
    console.error("Error fetching project for deletion:", fetchError);
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 },
    );
  }

  // Collect and delete files from storage
  const project = mapRowToProject(projectData);
  const files = await collectProjectFiles(project);
  await deleteFilesFromStorage(files);

  // Delete the project from database
  const { error } = await supabaseServerClient
    .from("projects")
    .delete()
    .eq("slug", normalizedSlug);

  if (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }

  console.log(`Deleted project "${normalizedSlug}" and ${files.length} associated files`);
  return NextResponse.json({ 
    success: true, 
    message: `Project and ${files.length} files deleted successfully` 
  });
}

