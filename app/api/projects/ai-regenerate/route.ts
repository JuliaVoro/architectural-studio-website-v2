import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase-client";
import { openai } from "@/lib/openai-client";

const MODEL = "gpt-4o-mini";

interface AiRegenerateRequest {
  projectId: string;
  field: string;
  currentContent: string;
  customPrompt?: string;
  projectContext: {
    title: string;
    location: string;
    materials: string;
    year: string;
  };
}

function getPromptForField(field: string, context: AiRegenerateRequest["projectContext"], currentContent: string): string {
  const baseContext = `
Project: ${context.title}
Location: ${context.location || "Not specified"}
Materials: ${context.materials || "Not specified"}
Year: ${context.year || "Not specified"}
`;

  switch (field) {
    case "introText":
      return `${baseContext}

Generate a compelling introduction text for this architectural project. The introduction should be 2-3 sentences that capture the essence of the project and entice readers to learn more.

Requirements:
- 2-3 sentences maximum
- Focus on unique architectural approach
- Mention key materials or design concepts
- Professional, engaging tone
- Avoid marketing clichés

Current introduction: "${currentContent || "No current content"}"

Please write a new, improved introduction:`;

    case "story":
      return `${baseContext}

Generate a detailed architectural story for this project. The story should be 4-6 paragraphs that explore design concept, spatial experience, materiality, and architectural thinking.

Requirements:
- 4-6 paragraphs
- Each paragraph should be substantial (3-5 sentences)
- Focus on spatial experience and architectural thinking
- Discuss materials and their role in design
- Mention urban context or site considerations
- Professional, thoughtful tone like an architecture magazine
- Avoid generic marketing language

Current story: "${currentContent || "No current story"}"

Please write a new, improved architectural story:`;

    case "fullProject":
      return `${baseContext}

Generate a complete architectural project structure with multiple sections. Create a comprehensive project presentation that includes:

1. Introduction Text (2-3 sentences)
2. Context/Story (4-6 paragraphs)
3. Multiple content sections using these types:
   - Full Width Image (with descriptive label)
   - Text Block (with label and content)
   - Gallery Grid (with label)
   - Video (with label)
   - Technical Drawings (with label)
   - Quote Block (with quote and attribution)
   - Download File (with label and description)

Requirements:
- Create 4-6 sections beyond intro and story
- Use appropriate labels for each section (e.g., "Site Analysis", "Design Concept", "Material Details", "Construction Process", "Final Results")
- Generate realistic, professional content for each section
- Include specific architectural details and insights
- Make it feel like a real architectural project presentation
- Use proper architectural terminology
- Focus on spatial experience, materiality, and design thinking

Current project structure: "${currentContent || "No current structure"}"

Please generate a complete project structure with sections array and content:`;

    default:
      return `${baseContext}

Generate professional architectural content for ${field} field.

Current content: "${currentContent || "No current content"}"

Please write improved content:`;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServerClient) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
        { status: 500 }
      );
    }

    const body: AiRegenerateRequest = await request.json();
    const { projectId, field, currentContent, customPrompt, projectContext } = body;

    // Get project details for context
    const { data: projectData, error: projectError } = await supabaseServerClient
      .from("projects")
      .select("title, location, materials, year")
      .eq("id", projectId)
      .single();

    if (projectError || !projectData) {
      return NextResponse.json(
        { error: "Failed to fetch project details" },
        { status: 500 }
      );
    }

    // Generate AI content
    const prompt = customPrompt || getPromptForField(field, {
      title: projectData.title,
      location: projectData.location || "",
      materials: projectData.materials || "",
      year: projectData.year?.toString() || "",
    }, currentContent);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: field === "fullProject" 
            ? "You are an architectural project designer. Generate complete project structures with multiple content sections. Create realistic, professional architectural presentations using proper terminology. Return JSON format with introText, story, and sections array."
            : "You are an architectural writer and editor. Generate professional, thoughtful content about architectural projects. Focus on spatial experience, materiality, and design thinking. Avoid marketing clichés and generic descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: field === "introText" ? 100 : field === "fullProject" ? 2000 : 800,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate AI content" },
        { status: 500 }
      );
    }

    // Parse full project response
    if (field === "fullProject") {
      try {
        // Try to parse as JSON, fallback to text if needed
        const projectStructure = JSON.parse(content);
        return NextResponse.json({
          ...projectStructure,
          field,
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        // If JSON parsing fails, return as content
        return NextResponse.json({
          content: content.trim(),
          field,
          timestamp: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({
      content: content.trim(),
      field,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error in AI regeneration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
