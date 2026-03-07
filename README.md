## AI-powered architecture portfolio platform

This project is a Next.js App Router site that powers an AI-assisted architecture portfolio. An admin can upload photography, video, and technical drawings; the system sends structured context to OpenAI, receives a magazine-style case study layout, and publishes it as a dynamic project page.

### Stack

- **Framework**: Next.js App Router (TypeScript)
- **Styling**: Tailwind CSS, editorial layout
- **Database & Storage**: Supabase (Postgres + storage bucket)
- **AI**: OpenAI API (used via the official `openai` SDK)
- **Deployment**: Vercel

---

## Project structure (key files)

- `app/admin/*` – password-protected admin dashboard
  - `app/admin/login/page.tsx` – simple password login (guarded by middleware)
  - `app/admin/projects/new/page.tsx` – create project, upload media, trigger AI
  - `app/admin/projects/page.tsx` – list of AI-generated projects
- `app/projects/page.tsx` – public grid of all projects
- `app/projects/[slug]/page.tsx` – dynamic case study page driven by AI JSON
- `app/api/projects/route.ts` – create + list projects (calls OpenAI)
- `app/api/projects/[slug]/route.ts` – fetch a single project by slug
- `app/api/admin/login|logout/route.ts` – simple admin authentication
- `components/projects/*` – presentational components such as `HeroImage`, `GalleryGrid`, `StoryText`, `TechnicalDrawings`, `KeyFactsTable`
- `lib/projects.ts` – shared types, helpers, and section schema
- `lib/ai-generate-project-layout.ts` – OpenAI call + prompt
- `lib/supabase-client.ts` – Supabase browser + server clients
- `lib/openai-client.ts` – OpenAI SDK client
- `scripts/supabase-schema.sql` – SQL to set up tables in Supabase

---

## Supabase setup

1. **Create project + bucket**
   - Create a Supabase project.
   - Create a public storage bucket named `project-media`.
   - Run `scripts/supabase-schema.sql` in the SQL editor to create:
     - `projects` table (AI-enriched project metadata + layout JSON)
     - `project_assets` table (media file metadata)

2. **Environment variables**

Configure the following variables locally (`.env.local`) and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

OPENAI_API_KEY="sk-..." # project-level key with access to gpt-4.1-mini (or better)

ADMIN_PASSWORD="choose-a-strong-admin-password"

# Optional, used in some server-side fetches:
NEXT_PUBLIC_SITE_URL="https://your-deployed-domain.com"
```

The service role key is used **only on the server** in API routes. Never expose it in the browser.

---

## Admin dashboard flow

1. Visit `/admin` – you will be redirected to `/admin/login` if not authenticated.
2. Enter the password configured in `ADMIN_PASSWORD`.
3. In `/admin/projects/new`:
   - Fill in the **key facts**:
     - project title
     - location
     - year
     - size
     - materials
     - client
     - short notes to the editor
   - Upload:
     - multiple **images**
     - optional **videos**
     - optional **technical drawings** (PDF or images)
4. On submit:
   - Media files are uploaded to the `project-media` bucket under a project-specific folder.
   - A JSON payload containing:

     ```ts
     {
       keyFacts: {
         title: string;
         location?: string;
         year?: number;
         size?: string;
         materials?: string;
         client?: string;
       };
       notes?: string;
       imagePaths: string[];   // Supabase storage paths
       videoPaths: string[];
       drawingPaths: string[];
     }
     ```

     is sent to `POST /api/projects`.

   - The API calls OpenAI to generate an editorial layout and writes a full record into the `projects` table, along with rows in `project_assets`.
   - You are redirected to the public page at `/projects/[slug]`.

---

## AI generation function and prompt

The core AI call lives in `lib/ai-generate-project-layout.ts`. It uses `gpt-4.1-mini` with `response_format: { type: "json_object" }` to strictly return JSON matching this structure:

```ts
type Section =
  | { id: string; type: "full_image"; label?: string; imagePath: string; caption?: string }
  | { id: string; type: "text_block"; label?: string; heading?: string; body: string }
  | { id: string; type: "gallery_grid"; label?: string; imagePaths: string[] }
  | { id: string; type: "technical_drawings"; label?: string; drawingPaths: string[]; notes?: string }
  | { id: string; type: "materials_table"; label?: string; items: { name: string; description?: string; role?: string }[] };

interface AiProjectLayout {
  title: string;
  slug: string;        // URL-safe, kebab-case
  hero_image: string;  // one of the provided image paths
  intro_text: string;  // 2–3 sentence intro
  story: string;       // multi-paragraph narrative, `\\n\\n` separated
  sections: Section[]; // ordered layout instructions
}
```

### Example OpenAI prompt (simplified)

System message (excerpt):

> You are an architectural editor for a high-end architecture magazine.  
> You return only strict JSON. No markdown, no explanations.  
> Respond with a single JSON object matching the AiProjectLayout interface.  
> Tone: calm, precise, architectural. Focus on spatial experience, light, materiality, and context.  
> All imagePath and drawingPath fields must be chosen from the lists provided by the user.

User message (shape):

```text
Key facts:
Title: Cliffside House
Location: Big Sur, California
Year: 2024
Size: 380 m²
Materials: Board-formed concrete, charred timber, weathering steel
Client: Private client

Short project notes (from architect):
The house balances exposure to the Pacific with deep, sheltered courtyards. The client wanted a place that feels carved from the cliff rather than placed on it.

Available images (storage paths):
projects/1712150000000/images/cliff-01.jpg
projects/1712150000000/images/cliff-02.jpg
projects/1712150000000/images/cliff-03.jpg

Available videos (storage paths):
projects/1712150000000/videos/walkthrough.mp4

Available technical drawings (storage paths):
projects/1712150000000/drawings/plan-level-1.pdf
projects/1712150000000/drawings/section-aa.pdf
```

---

## Example AI project JSON

An example of what the AI might return (shortened for readability):

```json
{
  "title": "Cliffside House",
  "slug": "cliffside-house-big-sur",
  "hero_image": "projects/1712150000000/images/cliff-01.jpg",
  "intro_text": "A house carved into the Big Sur cliffs, balancing radical exposure to the Pacific with deeply sheltered courtyards.",
  "story": "Perched on a narrow rock ledge, Cliffside House treats the cliff not as a backdrop, but as the primary material of the project.\n\nA thick concrete spine anchors the plan...",
  "sections": [
    {
      "id": "s1",
      "type": "full_image",
      "label": "Approach",
      "imagePath": "projects/1712150000000/images/cliff-02.jpg",
      "caption": "The house is approached along a narrow concrete walkway cut into the cliff face."
    },
    {
      "id": "s2",
      "type": "text_block",
      "heading": "Carved rather than placed",
      "body": "The project reads as a series of excavations rather than an object on the landscape..."
    },
    {
      "id": "s3",
      "type": "gallery_grid",
      "label": "Spaces and views",
      "imagePaths": [
        "projects/1712150000000/images/cliff-01.jpg",
        "projects/1712150000000/images/cliff-03.jpg"
      ]
    },
    {
      "id": "s4",
      "type": "technical_drawings",
      "drawingPaths": [
        "projects/1712150000000/drawings/plan-level-1.pdf",
        "projects/1712150000000/drawings/section-aa.pdf"
      ],
      "notes": "Plans and sections show how the house steps with the natural topography."
    },
    {
      "id": "s5",
      "type": "materials_table",
      "items": [
        {
          "name": "Board-formed concrete",
          "description": "Primary structural and retaining walls",
          "role": "Structure"
        },
        {
          "name": "Charred timber",
          "description": "Exterior cladding to the upper volume",
          "role": "Envelope"
        }
      ]
    }
  ]
}
```

The project detail page at `/projects/[slug]` reads this JSON and renders:

- `HeroImage` (with key facts + hero image)
- `StoryText` (from `story`)
- Dynamic sections using:
  - `FullWidthImage`
  - `GalleryGrid`
  - `TechnicalDrawings`
  - `KeyFactsTable`

---

## Running locally

1. Install dependencies:

```bash
pnpm install
```

2. Configure `.env.local` with the variables described above.
3. Run the dev server:

```bash
pnpm dev
```

4. Visit:
   - `http://localhost:3000` – main studio site with featured/latest projects
   - `http://localhost:3000/projects` – all projects
   - `http://localhost:3000/admin` – admin dashboard (requires `ADMIN_PASSWORD`)

