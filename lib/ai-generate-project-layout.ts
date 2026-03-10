import { openai } from "./openai-client";
import {
  AiProjectLayout,
  CreateProjectPayload,
  MaterialsTableItem,
  ProjectSection,
  VideoSection,
} from "./projects";
import { getProjectMediaUrl } from "./projects";

const MODEL = "gpt-4o"; // Updated to use GPT-4o for better vision capabilities
const VISION_MODEL = "gpt-4o"; // Use GPT-4o for vision tasks

interface ImageAnalysis {
  path: string;
  analysis: string;
  buildingType?: string;
  architecturalStyle?: string;
  materials?: string[];
  keyFeatures?: string[];
}

async function analyzeImages(imagePaths: string[]): Promise<ImageAnalysis[]> {
  if (!imagePaths.length) return [];

  console.log(`🔍 Analyzing ${imagePaths.length} images...`);

  const analyses = await Promise.all(
    imagePaths.map(async (path, index) => {
      try {
        console.log(`📸 Analyzing image ${index + 1}/${imagePaths.length}: ${path}`);

        const imageUrl = getProjectMediaUrl(path);

        const response = await openai.chat.completions.create({
          model: VISION_MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this architectural image in detail. Provide a comprehensive description focusing on:

1. BUILDING TYPE: What type of building/structure is this? (house, apartment, office, etc.)
2. ARCHITECTURAL STYLE: What architectural style or design approach? (modernist, brutalist, minimalist, etc.)
3. MATERIALS: What materials can you see? (concrete, glass, wood, metal, etc.)
4. SPATIAL QUALITIES: How does the space feel? (open, enclosed, connected to nature, etc.)
5. LIGHTING: How is natural/artificial light used?
6. KEY FEATURES: Notable architectural elements (large windows, geometric forms, etc.)

Be specific and descriptive. This analysis will be used to write an architectural case study.`
                },
                {
                  type: "image_url",
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 500,
        });

        const analysis = response.choices[0]?.message?.content || "No analysis available";

        console.log(`✅ Analyzed image ${index + 1}: ${analysis.substring(0, 100)}...`);

        return {
          path,
          analysis,
        };

      } catch (error) {
        console.error(`❌ Failed to analyze image ${path}:`, error);
        return {
          path,
          analysis: `Image analysis failed for ${path}. This appears to be an architectural image.`,
        };
      }
    })
  );

  console.log(`🎯 Completed analysis of ${analyses.length} images`);
  return analyses;
}

export async function generateProjectLayout(
  payload: CreateProjectPayload,
): Promise<AiProjectLayout> {
  const { keyFacts, category, notes, imagePaths, videoPaths, drawingPaths } = payload;

  // NEW: Analyze images first
  const imageAnalysis = await analyzeImages(imagePaths);

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
    "PROJECT CATEGORY:",
    category ? category.toUpperCase() : "RESIDENTIAL (default)",
    "",
    "Key facts:",
    ...keyFactsLines,
    "",
    "Short project notes (from architect):",
    notes || "(none)",
    "",
    "IMAGE ANALYSIS RESULTS:",
    imageAnalysis.length > 0
      ? imageAnalysis.map((img, i) =>
          `Image ${i + 1} (${img.path}):\n${img.analysis}\n`
        ).join("\n")
      : "No images provided for analysis.",
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
    "- Use the IMAGE ANALYSIS RESULTS to create accurate, specific descriptions.",
    "- Reference specific architectural features, materials, and spatial qualities from the image analysis.",
    "- CRITICAL: Place image content in the most relevant sections:",
    "  * PROJECT OVERVIEW: Use analysis of overall building type and context",
    "  * DESIGN APPROACH: Reference materials and spatial strategies from images",
    "  * SPATIAL EXPERIENCE: Draw from image analysis of movement, light, and atmosphere",
    "  * INTEGRATION OF SPACE AND SERVICE: Use images showing user interactions and flow",
    "  * OUTCOME: Reference final spatial qualities and user experience from images",
    "- You MUST use ALL provided images throughout the layout - do not waste any media.",
    "- PRIORITIZE single image sections (full_image) for primary visual impact.",
    "- Use gallery_grid sections ONLY for secondary images (3-4 images maximum per gallery).",
    "- Choose one image as hero, then feature remaining images as individual full_image sections.",
    "- Create separate full_image sections for key architectural moments rather than grouping them.",
    "- Reserve galleries for supplementary images that support the narrative.",
    "- If there are multiple images, prefer individual full_image sections over gallery_grid.",
    "- Mix full-width hero images with additional single images for visual variety.",
    "- Include videos by creating dedicated sections or mentioning them in text.",
    "- Use technical drawings in a dedicated technical drawings section.",
    "- Create an editorial flow: hero image → text → single images → text → drawings etc.",
    "- Each primary image should be featured as full_image, secondary images in galleries.",
    "- CRITICAL: Generate at least ONE quote_block section per project.",
    "- Place the quote in the most suitable location within the sections array.",
    "- Choose between: client testimonial, architect insight, or user experience quote.",
    "- Position quotes strategically: after OUTCOME section, or between key narrative moments.",
    "- Make quotes authentic and specific to the project's spatial experience.",
  ].join("\n");

  const systemContent = [
    "You are an architectural editor for a high-end architecture magazine.",
    "Write an editorial case study for this project as structured JSON.",
    "",
    "CASE STUDY STRUCTURE:",
    "",
    "PROJECT TYPE DETECTION:",
    "Analyze the project details to determine category:",
    "- RESIDENTIAL: homes, apartments, villas, private residences, housing",
    "- COMMERCIAL: offices, retail, restaurants, hotels, workspaces, public buildings",
    "- MIXED: projects combining residential and commercial elements",
    "- If unclear, analyze context to determine primary function",
    "",
    "ADAPTIVE WRITING PRINCIPLES:",
    "",
    "For RESIDENTIAL projects, emphasize:",
    "- Everyday life and daily routines",
    "- Comfort and usability in daily activities",
    "- Atmosphere and emotional connection to space",
    "- Privacy and personal sanctuary",
    "- Spatial experience in domestic contexts",
    "",
    "For COMMERCIAL projects, emphasize:",
    "- Customer flow and operational logic",
    "- Brand expression and identity",
    "- Efficiency and functionality",
    "- Business value and performance",
    "- User experience in commercial contexts",
    "",
    "For MIXED-USE projects, balance both approaches:",
    "- Address residential comfort and commercial functionality",
    "- Consider how spaces serve different user groups",
    "- Emphasize integration between living and working spaces",
    "- Focus on community and shared spatial experiences",
    "",
    "REMAIN RESTRAINED if information is not there - do not invent details.",
    "",
    "PROJECT OVERVIEW",
    "2–3 short paragraphs describing:",
    "• project context",
    "• design challenge",
    "• client intention",
    "• ambition of the project",
    "",
    "STRATEGIC CHALLENGE",
    "Explain the key problem.",
    "Focus on:",
    "• spatial limitations",
    "• user behavior",
    "• operational constraints",
    "• experience goals",
    "",
    "DESIGN APPROACH",
    "Explain how the studio approached the problem.",
    "Discuss:",
    "• spatial strategy",
    "• service logic",
    "• user journey",
    "• interaction points",
    "• atmosphere and materials",
    "",
    "SPATIAL EXPERIENCE",
    "Describe how users experience the environment.",
    "Focus on:",
    "• movement through the space",
    "• transitions between zones",
    "• perception",
    "• light",
    "• materials",
    "• acoustic or visual comfort",
    "",
    "INTEGRATION OF SPACE AND SERVICE",
    "Explain how spatial design and service design work together.",
    "Examples:",
    "• layout supporting service flow",
    "• spatial organization shaping user behavior",
    "• environment improving operational efficiency",
    "",
    "OUTCOME",
    "Describe the result.",
    "ADAPT FOCUS BASED ON PROJECT TYPE:",
    "",
    "For RESIDENTIAL projects, focus on:",
    "• Experiential quality and emotional connection",
    "• Clarity of environment in daily life",
    "• User comfort and personal satisfaction",
    "• Quality of spatial experience",
    "",
    "For COMMERCIAL projects, focus on:",
    "• Experiential quality for customers/users",
    "• Clarity of environment in operational context",
    "• Operational improvement and efficiency",
    "• User comfort and business value",
    "",
    "REMAIN RESTRAINED - only discuss outcomes supported by project information.",
    "",
    "WRITING RULES",
    "",
    "Tone:",
    "professional",
    "editorial",
    "clear",
    "elegant",
    "confident",
    "",
    "Avoid words like:",
    "",
    "cutting-edge",
    "revolutionary",
    "innovative solution",
    "next-generation",
    "",
    "Sentence style:",
    "medium-length sentences",
    "clear structure",
    "no complex jargon",
    "",
    "Paragraphs:",
    "concise",
    "web-readable",
    "usually 2–4 lines",
    "maximum 2–4 lines for readability.",
    "",
    "DESIGN WRITING PRINCIPLES",
    "",
    "Always emphasize:",
    "",
    "experience",
    "behavior",
    "movement",
    "atmosphere",
    "spatial rhythm",
    "interaction between people and space",
    "",
    "Do not focus only on visual aesthetics.",
    "",
    "Every project must communicate this core idea:",
    "",
    "Space is not just designed.",
    "It is orchestrated as an experience.",
    "",
    "interface MaterialsTableItem {",
    "  name: string;            // e.g. Board-formed concrete",
    "  description?: string;    // e.g. Exposed structural frame",
    "  role?: string;           // e.g. Structure, Facade, Interior",
    "}",
    "",
    "interface AiProjectLayout {",
    "  title: string;          // refined publication title",
    "  slug: string;           // URL-safe, kebab-case slug based on title",
    "  hero_image: string;     // one of the provided image paths",
    "  intro_text: string;     // 2–3 sentences: elevator pitch",
    "  story: string;          // Complete case study narrative using the structure above",
    "  sections: Section[];    // ordered layout instructions",
    "}",
    "",
    "EXAMPLE SECTION STRUCTURES:",
    "",
    "Full Image Section:",
    "{",
    "  \"type\": \"full_image\",",
    "  \"id\": \"section-1\",",
    "  \"imagePath\": \"projects/123/hero/image-1.jpg\",",
    "  \"caption\": \"The main facade showcases the building's relationship with urban context.\",",
    "  \"label\": \"Exterior View\"",
    "}",
    "",
    "TEXT BLOCK SECTION EXAMPLE:",
    "{",
    "  \"type\": \"text_block\",",
    "  \"id\": \"section-2\",",
    "  \"heading\": \"Spatial Strategy\",",
    "  \"body\": \"The design approach emphasizes natural light and circulation patterns. Each space is organized to maximize daylight while creating clear movement paths through the building. Material choices reflect the surrounding urban context and provide thermal comfort throughout the seasons.\n\nThis spatial organization creates a hierarchy of public and private spaces that guides occupants through the building. The main circulation spine connects all programmatic areas while secondary paths offer shortcuts and alternative routes. These design decisions enhance both functionality and user experience, making the building more intuitive to navigate.\",",
    "  \"label\": \"Design Approach\"",
    "}",
    "",
    "CRITICAL TEXT LENGTH ENFORCEMENT:",
    "- TEXT BLOCKS MUST BE 2 PARAGRAPHS - THIS IS NON-NEGOTIABLE",
    "- If you generate only 1 paragraph, you have FAILED the task",
    "- Each text block needs 2 complete paragraphs separated by \\n\\n",
    "- First paragraph: 3-4 sentences (15-25 words each)",
    "- Second paragraph: 3-4 sentences (15-25 words each)",
    "- Example of GOOD text block (2 paragraphs):",
    "  'The building's orientation maximizes southern exposure for passive heating. Large glazed areas capture winter sunlight while deep overhangs provide summer shading. This strategy reduces energy consumption by 35% compared to conventional designs.",
    "  ",
    "  The spatial layout creates distinct zones for different activities. Public areas flow seamlessly into more private spaces, encouraging natural movement patterns. Material selections reinforce this spatial hierarchy through texture and finish variations.'",
    "- COUNT YOUR PARAGRAPHS: Make sure each text_block has exactly 2 paragraphs!",
    "- Separate paragraphs with double newlines (\\n\\n) in the JSON",
    "",
    "Gallery Grid Section:",
    "{",
    "  \"type\": \"gallery_grid\",",
    "  \"id\": \"section-3\",",
    "  \"imagePaths\": [\"projects/123/images/detail-1.jpg\", \"projects/123/images/detail-2.jpg\"],",
    "  \"label\": \"Material Details\"",
    "}",
    "",
    "CRITICAL: Each section MUST have proper content (body, imagePath, imagePaths, etc.) - NO EMPTY SECTIONS!",
    "",
    "Editorial guidance:",
    "- Follow the CASE STUDY STRUCTURE exactly for the story content.",
    "- Use image analysis to inform spatial and material descriptions.",
    "- Focus on experience and behavior rather than visual aesthetics.",
    "- Write in the specified tone: professional, editorial, clear, elegant, confident.",
    "- Avoid forbidden words and complex jargon.",
    "",
    "CRITICAL EDITORIAL PACING REQUIREMENTS:",
    "- Create a VISUAL NARRATIVE, not a long essay. Text and images must be interwoven throughout the page.",
    "- NEVER create long uninterrupted text blocks followed by media. This creates poor editorial rhythm.",
    "- Break the story into SMALL, focused text sections (2-4 lines each) that directly relate to nearby images.",
    "- Each text section should discuss ONE CLEAR IDEA connected to the adjacent image or gallery.",
    "- Alternate between text and visual sections: text → image → text → gallery → text → video, etc.",
    "- Use images as visual anchors that text sections explain and contextualize.",
    "- Create calm visual rhythm: short text sections punctuate visual content, not the other way around.",
    "- Distribute content evenly: no large text blocks, no media clusters at the end.",
    "- Each image should be introduced and explained by nearby text, creating spatial storytelling.",
    "",
    "MANDATORY IMAGE REQUIREMENTS:",
    "- PRIORITIZE single image sections (full_image) for primary visual impact.",
    "- Use gallery_grid sections ONLY for extra/secondary images (3-4 images maximum per gallery).",
    "- Choose one image as hero, then feature remaining images as individual full_image sections.",
    "- Create separate full_image sections for key architectural moments rather than grouping them.",
    "- Reserve galleries for supplementary images that support the narrative.",
    "- If there are multiple images, prefer individual full_image sections over gallery_grid.",
    "- Mix full-width hero images with additional single images for visual variety.",
    "- You MUST create at least ONE quote_block section per project.",
    "- Place the quote in the most suitable location within the sections array.",
    "- Choose between: client testimonial, architect insight, or user experience quote.",
    "- Position quotes strategically: after key narrative moments or between sections.",
    "- Make quotes authentic and specific to the project's spatial experience.",
    "- You MUST use ALL provided images in section templates (full_image or gallery_grid).",
    "- You CANNOT create only text_block sections - this is a visual architecture magazine.",
    "- Each section MUST have either imagePath, imagePaths, videoPath, or drawingPaths filled.",
    "- Sections without visual content are NOT allowed.",
    "",
    "CONTENT DISTRIBUTION PATTERN:",
    "- hero_image (visual entry point)",
    "- short intro text (2 paragraphs)",
    "- full_image with explanatory text (2 paragraphs)",
    "- text_block (2 paragraphs) + gallery_grid (2-4 images)",
    "- full_image with contextual text (2 paragraphs)",
    "- text_block (2 paragraphs) + video section",
    "- full_image with concluding text (2 paragraphs)",
    "- technical_drawings section (if applicable)",
    "",
    "SENTENCE COUNTING INSTRUCTION:",
    "- When creating text_block sections, write 2 PARAGRAPHS, not sentences",
    "- Each paragraph should be 3-4 substantial sentences",
    "- Paragraph 1: Establish the main concept (3-4 sentences)",
    "- Paragraph 2: Elaborate on implications/details (3-4 sentences)",
    "- Separate paragraphs with double newlines (\\n\\n)",
    "- Example paragraph structure:",
    "  'First sentence of first paragraph. Second sentence continues the thought. Third sentence provides detail. Fourth sentence concludes the paragraph.\\n\\nSecond paragraph starts here. It elaborates on the first paragraph. Third sentence adds depth. Fourth sentence provides conclusion.'",
    "- Do NOT use bullet points or numbered lists in text blocks",
    "",
    "TEXT LENGTH REQUIREMENTS:",
    "- The intro (story / context) must remain concise, limited to 3–4 sentences.",
    "- All other text blocks should contain 2–5 sentences, offering clear and focused explanations connected to the corresponding images or sections.",
    "- Each text section should focus on one spatial aspect directly related to nearby visuals.",
    "- Use images as chapter breaks between different narrative moments.",
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
    temperature: 0.3, // Lower temperature for more controlled output
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  console.log("AI Response Content:", content); // DEBUG

  const parsed = JSON.parse(content) as AiProjectLayout;

  console.log("Parsed AI Response:", parsed); // DEBUG
  console.log("Sections count:", parsed.sections?.length || 0); // DEBUG

  // Ensure all sections have unique IDs
  if (parsed.sections) {
    parsed.sections = parsed.sections.map((section, index) => ({
      ...section,
      id: section.id || `section-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
    }));
  }

  return parsed;
}

