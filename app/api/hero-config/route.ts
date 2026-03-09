import { supabaseServerClient } from "@/lib/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabaseServerClient
      .from("hero_template_config")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching hero config:", error);
      return NextResponse.json(
        { error: "Failed to fetch configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/hero-config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    // Get the current active config
    const { data: currentConfig, error: fetchError } = await supabaseServerClient
      .from("hero_template_config")
      .select("*")
      .eq("is_active", true)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    // Update the active config
    const updateData = {
      template_type: body.template_type,
      split_title: body.split_title,
      split_subtitle: body.split_subtitle,
      split_description: body.split_description,
      split_media_url: body.split_media_url,
      split_media_type: body.split_media_type,
      split_layout: body.split_layout,
      updated_at: new Date().toISOString(),
    };

    if (currentConfig?.id) {
      const { data, error } = await supabaseServerClient
        .from("hero_template_config")
        .update(updateData)
        .eq("id", currentConfig.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const { data, error } = await supabaseServerClient
        .from("hero_template_config")
        .insert({
          ...updateData,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error in PUT /api/hero-config:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
