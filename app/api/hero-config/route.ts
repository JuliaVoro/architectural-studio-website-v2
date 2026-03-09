import { supabaseServerClient } from "@/lib/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  if (!supabaseServerClient) {
    console.error("[v0] Supabase not configured");
    return NextResponse.json({ template_type: "slider" });
  }

  try {
    const { data, error } = await supabaseServerClient
      .from("hero_template_config")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("[v0] Error fetching hero config:", error.message);
      // Table might not exist yet - return default
      return NextResponse.json({ template_type: "slider" });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Exception in GET /api/hero-config:", error);
    return NextResponse.json({ template_type: "slider" });
  }
}

export async function PUT(request: NextRequest) {
  if (!supabaseServerClient) {
    console.error("[v0] Supabase not configured");
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log("[v0] Updating hero config:", body);

    // Get the current active config
    const { data: currentConfig, error: fetchError } = await supabaseServerClient
      .from("hero_template_config")
      .select("*")
      .eq("is_active", true)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("[v0] Error fetching current config:", fetchError.message);
      return NextResponse.json(
        { error: "Failed to fetch current configuration" },
        { status: 500 }
      );
    }

    const updateData = {
      template_type: body.template_type,
      split_title: body.split_title || null,
      split_subtitle: body.split_subtitle || null,
      split_description: body.split_description || null,
      split_media_url: body.split_media_url || null,
      split_media_type: body.split_media_type || "image",
      split_layout: body.split_layout || "media-right",
      updated_at: new Date().toISOString(),
    };

    if (currentConfig?.id) {
      console.log("[v0] Updating existing config ID:", currentConfig.id);
      const { data, error } = await supabaseServerClient
        .from("hero_template_config")
        .update(updateData)
        .eq("id", currentConfig.id)
        .select()
        .single();

      if (error) {
        console.error("[v0] Error updating config:", error.message);
        return NextResponse.json(
          { error: "Failed to update configuration", details: error.message },
          { status: 500 }
        );
      }
      console.log("[v0] Config updated successfully");
      return NextResponse.json(data);
    } else {
      console.log("[v0] Creating new hero config");
      const { data, error } = await supabaseServerClient
        .from("hero_template_config")
        .insert({
          ...updateData,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("[v0] Error creating config:", error.message);
        return NextResponse.json(
          { error: "Failed to create configuration", details: error.message },
          { status: 500 }
        );
      }
      console.log("[v0] Config created successfully");
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("[v0] Exception in PUT /api/hero-config:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
