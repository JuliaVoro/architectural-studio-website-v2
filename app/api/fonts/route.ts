import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("typography_settings")
      .select("*")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching typography settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch typography settings" },
        { status: 500 }
      );
    }

    // Return default settings if no data exists
    if (!data) {
      return NextResponse.json({
        primary: "var(--font-playfair)",
        secondary: "var(--font-inter)",
        accent: "var(--font-playfair)",
      });
    }

    // Map database fields to API response
    return NextResponse.json({
      primary: data.heading_font,
      secondary: data.body_font,
      accent: data.accent_font,
      // Include full typography data for future use
      fullSettings: data
    });
  } catch (error) {
    console.error("Failed to fetch typography settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch typography settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("PUT request received");
    const body = await request.json();
    console.log("Request body:", body);
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    console.log("Supabase client created");
    
    // Validate font settings
    const validFontFamilies = [
      "var(--font-inter)",
      "var(--font-playfair)",
      "var(--font-roboto)",
      "var(--font-open-sans)",
      "var(--font-montserrat)",
      "var(--font-lato)",
      "var(--font-nunito)",
      "var(--font-merriweather)",
      "var(--font-crimson-text)",
      "var(--font-oswald)",
      "var(--font-anton)",
      "var(--font-lobster)",
      "var(--font-raleway)",
      "var(--font-poppins)",
      "var(--font-muli)",
      "var(--font-fira-sans)",
      "var(--font-source-sans-pro)",
      "var(--font-dm-sans)",
      "var(--font-ibm-plex-sans)",
      "var(--font-space-grotesk)",
      "var(--font-syne)",
      "var(--font-bodoni-moda)",
      "var(--font-crimson-pro)",
      "var(--font-eb-garamond)",
      "var(--font-lora)",
      "var(--font-pt-serif)",
      "var(--font-urbanist)",
      "var(--font-karla)",
      "var(--font-work-sans)",
      "var(--font-jost)",
      "var(--font-dm-serif)",
      "var(--font-cabin)",
      "var(--font-vollkorn)",
      "var(--font-archivo)",
      "var(--font-titillium-web)",
      "var(--font-bebas-neue)",
      "var(--font-righteous)",
      "var(--font-bitter)",
      "var(--font-courier-prime)",
      "var(--font-josefin-sans)",
      "var(--font-libre-baskerville)",
      "var(--font-mukta)",
      "var(--font-arimo)",
      "var(--font-tahoma)",
      "var(--font-georgia)",
      "var(--font-arial)",
      "var(--font-helvetica)",
      "var(--font-times-new-roman)",
    ];

    // Basic validation
    if (body.primary && !validFontFamilies.includes(body.primary)) {
      console.log("Invalid primary font:", body.primary);
      return NextResponse.json(
        { error: "Invalid primary font family" },
        { status: 400 }
      );
    }

    if (body.secondary && !validFontFamilies.includes(body.secondary)) {
      console.log("Invalid secondary font:", body.secondary);
      return NextResponse.json(
        { error: "Invalid secondary font family" },
        { status: 400 }
      );
    }

    if (body.accent && !validFontFamilies.includes(body.accent)) {
      console.log("Invalid accent font:", body.accent);
      return NextResponse.json(
        { error: "Invalid accent font family" },
        { status: 400 }
      );
    }

    console.log("Validation passed, attempting upsert");

    // Update or insert typography settings
    const { data, error } = await supabase
      .from("typography_settings")
      .upsert({
        id: "00000000-0000-0000-0000-000000000001", // Fixed ID for single row
        heading_font: body.primary,
        body_font: body.secondary,
        accent_font: body.accent,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    console.log("Upsert result:", { data, error });

    if (error) {
      console.error("Error saving typography settings:", error);
      return NextResponse.json(
        { error: `Failed to save typography settings: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Save successful, returning response");
    return NextResponse.json({
      primary: data.heading_font,
      secondary: data.body_font,
      accent: data.accent_font,
      success: true
    });
  } catch (error) {
    console.error("Failed to save typography settings:", error);
    return NextResponse.json(
      { error: `Failed to save typography settings: ${error.message}` },
      { status: 500 }
    );
  }
}
