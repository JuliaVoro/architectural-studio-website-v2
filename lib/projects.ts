export type ProjectStatus = "draft" | "processing" | "published" | "failed";

export type ProjectMediaType = "image" | "video" | "drawing" | "other";

export type ProjectCategory = "residential" | "commercial" | "mixed";

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
  thumbnailPath?: string;
  caption?: string;
}

export interface QuoteBlockSection extends BaseSection {
  type: "quote_block";
  quote: string;
}

export interface DownloadFileSection extends BaseSection {
  type: "download_file";
  fileName: string;
  fileUrl: string;
  description?: string;
}

export type ProjectSection =
  | FullImageSection
  | TextBlockSection
  | GalleryGridSection
  | TechnicalDrawingsSection
  | MaterialsTableSection
  | VideoSection
  | QuoteBlockSection
  | DownloadFileSection;

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
  private: boolean;
  order?: number;
  slug: string;
  category?: ProjectCategory;
  keyFacts: ProjectKeyFacts;
  notes?: string;
  heroImagePath?: string;
  introText?: string;
  story?: string;
  storyLabel?: string;
  sections?: ProjectSection[];
  aiRawResponse?: unknown;
}

export interface CreateProjectPayload {
  keyFacts: ProjectKeyFacts;
  category?: ProjectCategory;
  notes?: string;
  imagePaths: string[];
  videoPaths: string[];
  drawingPaths: string[];
}

export function getProjectMediaUrl(storagePath: string): string {
  if (!storagePath) {
    console.warn("getProjectMediaUrl called with empty storagePath");
    return "/placeholder.jpg"; // Return placeholder instead of empty string
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  console.log("getProjectMediaUrl - baseUrl:", baseUrl, "storagePath:", storagePath);

  if (!baseUrl) {
    console.warn("No NEXT_PUBLIC_SUPABASE_URL found");
    return storagePath;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = storagePath.replace(/^\/+/, "");
  const finalUrl = `${normalizedBase}/storage/v1/object/public/project-media/${normalizedPath}`;
  
  console.log("getProjectMediaUrl - final URL:", finalUrl);
  return finalUrl;
}

export function getValidProjectMediaUrl(storagePath: string | undefined): string | null {
  if (!storagePath) return null;
  
  // Check if this looks like an AI-generated path (common patterns)
  const aiGeneratedPatterns = [
    /projects\/\d+\/hero\/.*\.jpg$/i,
    /projects\/\d+\/hero\/.*\.png$/i,
    /projects\/\d+\/images\/.*\.jpg$/i,
    /projects\/\d+\/images\/.*\.png$/i,
    /projects\/\d+\/gallery\/.*\.jpg$/i,
    /projects\/\d+\/gallery\/.*\.png$/i,
  ];
  
  // If it matches AI-generated patterns, return null to use fallback
  if (aiGeneratedPatterns.some(pattern => pattern.test(storagePath))) {
    return null;
  }
  
  return getProjectMediaUrl(storagePath);
}


