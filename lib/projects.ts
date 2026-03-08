export type ProjectStatus = "draft" | "processing" | "published" | "failed";

export type ProjectMediaType = "image" | "video" | "drawing" | "other";

export interface ProjectKeyFacts {
  title: string;
  location?: string;
  year?: number;
  size?: string;
  materials?: string;
  client?: string;
}

export interface ProjectAsset {
  id: string;
  projectId: string;
  type: ProjectMediaType;
  storagePath: string;
  originalFilename: string;
  mimeType?: string;
  width?: number;
  height?: number;
  orderIndex?: number;
}

export interface BaseSection {
  id: string;
  label?: string;
}

export interface FullImageSection extends BaseSection {
  type: "full_image";
  imagePath: string;
  caption?: string;
}

export interface TextBlockSection extends BaseSection {
  type: "text_block";
  heading?: string;
  body: string;
}

export interface GalleryGridSection extends BaseSection {
  type: "gallery_grid";
  imagePaths: string[];
}

export interface TechnicalDrawingsSection extends BaseSection {
  type: "technical_drawings";
  drawingPaths: string[];
  notes?: string;
}

export interface MaterialsTableItem {
  name: string;
  description?: string;
  role?: string;
}

export interface MaterialsTableSection extends BaseSection {
  type: "materials_table";
  items: MaterialsTableItem[];
}

export interface VideoSection extends BaseSection {
  type: "video";
  videoPath: string;
  caption?: string;
}

export interface QuoteBlockSection extends BaseSection {
  type: "quote_block";
  quote: string;
}

export type ProjectSection =
  | FullImageSection
  | TextBlockSection
  | GalleryGridSection
  | TechnicalDrawingsSection
  | MaterialsTableSection
  | VideoSection
  | QuoteBlockSection;

export interface AiProjectLayout {
  title: string;
  slug: string;
  hero_image: string;
  intro_text: string;
  story: string;
  sections: ProjectSection[];
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  featured: boolean;
  slug: string;
  keyFacts: ProjectKeyFacts;
  notes?: string;
  heroImagePath?: string;
  introText?: string;
  story?: string;
  sections?: ProjectSection[];
  aiRawResponse?: unknown;
}

export interface CreateProjectPayload {
  keyFacts: ProjectKeyFacts;
  notes?: string;
  imagePaths: string[];
  videoPaths: string[];
  drawingPaths: string[];
}

export function getProjectMediaUrl(storagePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    return storagePath;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = storagePath.replace(/^\/+/, "");

  return `${normalizedBase}/storage/v1/object/public/project-media/${normalizedPath}`;
}


