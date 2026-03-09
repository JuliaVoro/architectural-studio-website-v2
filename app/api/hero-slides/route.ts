import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase-client";
import type { HeroSlide } from "@/lib/hero-slides";
import { defaultHeroSlides } from "@/lib/hero-slides";

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

export async function GET() {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  const { data, error } = await supabaseServerClient
    .from("hero_slides")
    .select("*")
    .order("hidden", { ascending: true })
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 },
    );
  }

  // If no slides exist yet, seed with defaults
  if (!data || data.length === 0) {
    const seedRows = defaultHeroSlides.map((slide, index) => ({
      type: slide.type,
      src: slide.src,
      poster: slide.poster ?? null,
      label: slide.label,
      title: slide.title,
      subtitle: slide.subtitle,
      hidden: false,
      order_index: index,
    }));

    const { data: seeded, error: seedError } = await supabaseServerClient
      .from("hero_slides")
      .insert(seedRows)
      .select("*")
      .order("order_index", { ascending: true });

    if (seedError) {
      console.error("Error seeding hero slides:", seedError);
      return NextResponse.json(
        { error: "Failed to fetch hero slides" },
        { status: 500 },
      );
    }

    const slides = (seeded ?? []).map(mapRowToSlide);
    return NextResponse.json({ slides });
  }

  const slides = data.map(mapRowToSlide);

  return NextResponse.json({ slides });
}

export async function POST(request: NextRequest) {
  if (!supabaseServerClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: Partial<HeroSlide>;

  try {
    body = (await request.json()) as Partial<HeroSlide>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (!body.title || !body.label || !body.subtitle || !body.src || !body.type) {
    return NextResponse.json(
      { error: "label, title, subtitle, src and type are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseServerClient
    .from("hero_slides")
    .insert({
      type: body.type,
      src: body.src,
      poster: body.poster ?? null,
      label: body.label,
      title: body.title,
      subtitle: body.subtitle,
      hidden: body.hidden ?? false,
      order_index: body.orderIndex ?? 0,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json(
      { error: "Failed to create hero slide" },
      { status: 500 },
    );
  }

  const slide = mapRowToSlide(data);

  return NextResponse.json({ slide });
}

