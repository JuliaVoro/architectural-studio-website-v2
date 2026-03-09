import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase-client";

export interface HeroConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  template: "slider" | "single";
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  backgroundType?: "image" | "video" | null;
  backgroundSrc?: string | null;
  backgroundPoster?: string | null;
  overlayOpacity?: number | null;
  label?: string | null;
}

function mapRowToConfig(row: any): HeroConfig {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    template: row.template,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    ctaText: row.cta_text,
    ctaLink: row.cta_link,
    backgroundType: row.background_type,
    backgroundSrc: row.background_src,
    backgroundPoster: row.background_poster,
    overlayOpacity: row.overlay_opacity,
    label: row.label,
  };
}

export async function GET() {
  if (!supabaseServerClient) {
    // Return default config if Supabase is not configured
    const defaultConfig: HeroConfig = {
      id: "default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template: "slider",
      ctaText: "View Projects",
      ctaLink: "#projects",
      overlayOpacity: 40,
    };
    return NextResponse.json({ config: defaultConfig });
  }

  const { data, error } = await supabaseServerClient
    .from("hero_config")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Error fetching hero config:", error);
    // If table doesn't exist or other error, return default config
    const defaultConfig: HeroConfig = {
      id: "default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template: "slider",
      ctaText: "View Projects",
      ctaLink: "#projects",
      overlayOpacity: 40,
    };
    return NextResponse.json({ config: defaultConfig });
  }

  // If no config exists, return default
  if (!data || data.length === 0) {
    const defaultConfig: HeroConfig = {
      id: "default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template: "slider",
      ctaText: "View Projects",
      ctaLink: "#projects",
      overlayOpacity: 40,
    };
    return NextResponse.json({ config: defaultConfig });
  }

  const config = mapRowToConfig(data[0]);
  return NextResponse.json({ config });
}

export async function PATCH(request: NextRequest) {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: Partial<HeroConfig>;

  try {
    body = (await request.json()) as Partial<HeroConfig>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  // Validate template if provided
  if (body.template && !["slider", "single"].includes(body.template)) {
    return NextResponse.json(
      { error: "template must be either 'slider' or 'single'" },
      { status: 400 },
    );
  }

  // Validate overlay opacity if provided
  if (body.overlayOpacity !== undefined && body.overlayOpacity !== null && (body.overlayOpacity < 0 || body.overlayOpacity > 100)) {
    return NextResponse.json(
      { error: "overlayOpacity must be between 0 and 100" },
      { status: 400 },
    );
  }

  // Try to get existing config first
  let existing: any[] | null = null;
  try {
    const { data: existingData, error: fetchError } = await supabaseServerClient
      .from("hero_config")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1);

    if (!fetchError) {
      existing = existingData;
    }
  } catch (error) {
    console.log("Could not fetch existing config:", error);
  }

  // If table doesn't exist or no existing config, return success but don't try to save
  if (!existing || existing.length === 0) {
    const defaultConfig: HeroConfig = {
      id: "default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template: body.template || "slider",
      title: body.title || null,
      subtitle: body.subtitle || null,
      description: body.description || null,
      ctaText: body.ctaText || "View Projects",
      ctaLink: body.ctaLink || "#projects",
      backgroundType: body.backgroundType || null,
      backgroundSrc: body.backgroundSrc || null,
      backgroundPoster: body.backgroundPoster || null,
      overlayOpacity: body.overlayOpacity || 40,
      label: body.label || null,
    };
    return NextResponse.json({ config: defaultConfig });
  }

  // Update existing config
  const updateData: any = {};
  if (body.template !== undefined) updateData.template = body.template;
  if (body.title !== undefined) updateData.title = body.title;
  if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.ctaText !== undefined) updateData.cta_text = body.ctaText;
  if (body.ctaLink !== undefined) updateData.cta_link = body.ctaLink;
  if (body.backgroundType !== undefined) updateData.background_type = body.backgroundType;
  if (body.backgroundSrc !== undefined) updateData.background_src = body.backgroundSrc;
  if (body.backgroundPoster !== undefined) updateData.background_poster = body.backgroundPoster;
  if (body.overlayOpacity !== undefined) updateData.overlay_opacity = body.overlayOpacity;
  if (body.label !== undefined) updateData.label = body.label;

  const { data, error } = await supabaseServerClient
    .from("hero_config")
    .update(updateData)
    .eq("id", existing[0]!.id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating hero config:", error);
    return NextResponse.json(
      { error: "Failed to update hero config" },
      { status: 500 },
    );
  }

  const config = mapRowToConfig(data);
  return NextResponse.json({ config });
}
