import { NextRequest, NextResponse } from "next/server";

// In-memory storage for typography settings (replace with database in production)
let typographySettings = {
  display: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: "400",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  },
  h1: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: "400",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  },
  h2: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: "400",
    lineHeight: "1.2",
    letterSpacing: "-0.01em",
  },
  h3: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
    fontWeight: "400",
    lineHeight: "1.3",
    letterSpacing: "0",
  },
  h4: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
    fontWeight: "400",
    lineHeight: "1.4",
    letterSpacing: "0",
  },
  bodyLarge: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
    fontWeight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  body: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(1rem, 2vw, 1.125rem)",
    fontWeight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  small: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
    fontWeight: "400",
    lineHeight: "1.5",
    letterSpacing: "0",
  },
  caption: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.75rem, 1.25vw, 0.875rem)",
    fontWeight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  label: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.6875rem, 1.125vw, 0.75rem)",
    fontWeight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  button: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.6875rem, 1.125vw, 0.75rem)",
    fontWeight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
};

export async function GET() {
  return NextResponse.json(typographySettings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate typography settings
    const validFontFamilies = [
      "var(--font-inter)",
      "var(--font-satoshi)", 
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
    ];

    // Basic validation
    if (body.display && !validFontFamilies.includes(body.display.fontFamily)) {
      return NextResponse.json(
        { error: "Invalid font family for display" },
        { status: 400 }
      );
    }

    typographySettings = {
      ...typographySettings,
      ...body
    };

    return NextResponse.json(typographySettings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save typography settings" },
      { status: 500 }
    );
  }
}
