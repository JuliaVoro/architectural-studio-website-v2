import { openai } from "./openai-client";
import {
  AiProjectLayout,
  CreateProjectPayload,
  MaterialsTableItem,
  ProjectSection,
  VideoSection,
} from "./projects";

const MODEL = "gpt-4.1-mini";

export async function generateProjectLayout(
  payload: CreateProjectPayload,
): Promise<AiProjectLayout> {
  const { keyFacts, notes, imagePaths, videoPaths, drawingPaths } = payload;

  const keyFactsLines: string[] = [
    `Title: ${keyFacts.title}`,
    keyFacts.location ? `Location: ${keyFacts.location}` : "",
    keyFacts.year ? `Year: ${keyFacts.year}` : "",
    keyFacts.size ? `Size: ${keyFacts.size}` : "",
    keyFacts.materials ? `Materials: ${keyFacts.materials}` : "",
    keyFacts.client ? `Client: ${keyFacts.client}` : "",
  ].filter(Boolean);

  const userContent = [
    "You are an architectural editor for a high-end architecture magazine.",
    "Write an editorial case study for this project as structured JSON.",
    "",
    "Key facts:",
    ...keyFactsLines,
    "",
    "Short project notes (from architect):",
    notes || "(none)",
    "",
    "Available images (storage paths):",
    imagePaths.length ? imagePaths.join("\n") : "(none)",
    "",
    "Available videos (storage paths):",
    videoPaths.length ? videoPaths.join("\n") : "(none)",
    "",
    "Available technical drawings (storage paths):",
    drawingPaths.length ? drawingPaths.join("\n") : "(none)",
    "",
    "IMPORTANT EDITORIAL INSTRUCTIONS:",
    "- You MUST use ALL provided images throughout the layout - do not waste any media.",
    "- Choose one image as hero, put the rest in gallery grids or full-width sections.",
    "- If there are multiple images, create gallery sections to showcase them.",
    "- Mix full-width hero images with gallery grids for visual variety.",
    "- Include videos by creating dedicated sections or mentioning them in text.",
    "- Use technical drawings in a dedicated technical drawings section.",
    "- Create an editorial flow: hero image → text → gallery → text → drawings etc.",
    "- Each image should be featured either as full-width or in a gallery.",
  ].join("\n");

  const systemContent = [
    "You return only strict JSON. No markdown, no explanations.",
    "Respond with a single JSON object matching this TypeScript interface:",
    "",
    "interface MaterialsTableItem {",
    "  name: string;            // e.g. Board-formed concrete",
    "  description?: string;    // e.g. Exposed structural frame",
    "  role?: string;           // e.g. Structure, Facade, Interior",
    "}",
    "",
    "type Section =",
    '  | { id: string; type: "full_image"; label?: string; imagePath: string; caption?: string }',
    '  | { id: string; type: "text_block"; label?: string; heading?: string; body: string }',
    '  | { id: string; type: "gallery_grid"; label?: string; imagePaths: string[] }',
    '  | { id: string; type: "technical_drawings"; label?: string; drawingPaths: string[]; notes?: string }',
    '  | { id: string; type: "materials_table"; label?: string; items: MaterialsTableItem[] }',
    '  | { id: string; type: "video"; label?: string; videoPath: string; caption?: string };',
    "",
    "interface AiProjectLayout {",
    "  title: string;          // refined publication title",
    "  slug: string;           // URL-safe, kebab-case slug based on title",
    "  hero_image: string;     // one of the provided image paths",
    "  intro_text: string;     // 2–3 sentences: elevator pitch",
    "  story: string;          // 4–8 paragraphs narrative, separated by \\n\\n",
    "  sections: Section[];    // ordered layout instructions",
    "}",
    "",
    "Editorial guidance:",
    "- Tone: calm, precise, architectural, like a high-end magazine.",
    "- Focus on spatial experience, light, materiality, and urban context.",
    "- Avoid marketing clichés; prioritize architectural thinking.",
    "",
    "Hard requirements:",
    "- All imagePath and drawingPath fields MUST reference items from the provided lists.",
    "- hero_image MUST be one of the imagePaths.",
    "- sections array should mix text and visual sections for an editorial rhythm.",
    "- Materials table (if any) should be concise and specific.",
    "- CRITICAL: Use ALL provided images - either as full_image or in gallery_grid sections.",
    "- If multiple images exist, create gallery_grid sections for groups of 2-4 images.",
    "- Each provided image path must appear exactly once in the sections.",
    "- For each video, create a dedicated video section with the video path.",
    "- Technical drawings should all be included in the technical_drawings section.",
  ].join("\n");

  const completion = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userContent },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  const parsed = JSON.parse(content) as AiProjectLayout;

  return parsed;
}

