import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase-client";
import type { HeroSlide } from "@/lib/hero-slides";

function mapRowToSlide(row: any): HeroSlide {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    orderIndex: row.order_index ?? 0,
    hidden: row.hidden ?? false,
    type: row.type,
    src: row.src,
    poster: row.poster ?? null,
    label: row.label,
    title: row.title,
    subtitle: row.subtitle,
  };
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  const { id } = await context.params;

  let body: Partial<HeroSlide>;

  try {
    body = (await request.json()) as Partial<HeroSlide>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const update: Record<string, unknown> = {};

  if (body.type) update.type = body.type;
  if (body.src) update.src = body.src;
  if (body.poster !== undefined) update.poster = body.poster;
  if (body.label) update.label = body.label;
  if (body.title) update.title = body.title;
  if (body.subtitle) update.subtitle = body.subtitle;
  if (body.hidden !== undefined) update.hidden = body.hidden;
  if (body.orderIndex !== undefined) update.order_index = body.orderIndex;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabaseServerClient
    .from("hero_slides")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to update hero slide" },
      { status: 500 },
    );
  }

  const slide = mapRowToSlide(data);

  return NextResponse.json({ slide });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  const { id } = await context.params;

  const { error } = await supabaseServerClient
    .from("hero_slides")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json(
      { error: "Failed to delete hero slide" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

