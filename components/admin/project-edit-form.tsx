"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabase-client";
import type { Project, ProjectSection } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, RefreshCw, Plus, Trash2, Edit3, Image as ImageIcon, Video, FileText, Move, Upload, GripVertical } from "lucide-react";
import Image from "next/image";

interface ProjectEditFormProps {
  project: Project;
}

interface SectionEditProps {
  section: ProjectSection;
  index: number;
  onUpdate: (index: number, section: ProjectSection) => void;
  onDelete: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function SectionEditor({ section, index, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: SectionEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(section);
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null);

  const handleSave = () => {
    onUpdate(index, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(section);
    setIsEditing(false);
  };

  const handleMediaUpload = async (file: File, mediaType: 'image' | 'video' | 'drawing' | 'thumbnail') => {
    setUploadingMedia(mediaType);
    
    try {
      if (!supabaseBrowserClient) {
        throw new Error("Supabase client not available");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `projects/${editData.id || section.id}/${mediaType}/${fileName}`;

      const { error: uploadError } = await supabaseBrowserClient.storage
        .from('project-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Update section with new media path - use type assertion for dynamic properties
      if (section.type === "full_image" && mediaType === 'image') {
        setEditData({ ...editData, imagePath: filePath } as any);
      } else if (section.type === "video" && mediaType === 'video') {
        setEditData({ ...editData, videoPath: filePath } as any);
      } else if (section.type === "video" && mediaType === 'thumbnail') {
        setEditData({ ...editData, thumbnailPath: filePath } as any);
      } else if (section.type === "gallery_grid" && mediaType === 'image') {
        const currentPaths = (editData as any).imagePaths || [];
        setEditData({ ...editData, imagePaths: [...currentPaths, filePath] } as any);
      } else if (section.type === "technical_drawings" && mediaType === 'drawing') {
        const currentPaths = (editData as any).drawingPaths || [];
        setEditData({ ...editData, drawingPaths: [...currentPaths, filePath] } as any);
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media. Please try again.");
    } finally {
      setUploadingMedia(null);
    }
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case "full_image":
        return (
          <div className="space-y-4">
            <div className="relative aspect-[16/10] w-full bg-sand rounded-lg overflow-hidden">
              <Image
                src={getProjectMediaUrl((editData as any).imagePath || (section as any).imagePath)}
                alt={(section as any).caption || "Project image"}
                fill
                className="object-cover"
              />
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <Label>Caption</Label>
                <Textarea
                  value={(editData as any).caption || ""}
                  onChange={(e) => setEditData({ ...editData, caption: e.target.value } as any)}
                  placeholder="Image caption"
                  rows={2}
                />
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Section label"
                />
                <Label>Replace Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMediaUpload(file, 'image');
                    }}
                    className="flex-1"
                  />
                  {uploadingMedia === 'image' && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>
            ) : (
              <>
                {(section as any).label && (
                  <p className="text-sm text-muted-foreground">{(section as any).label}</p>
                )}
                {(section as any).caption && (
                  <p className="text-sm text-neutral-600">{(section as any).caption}</p>
                )}
              </>
            )}
          </div>
        );

      case "text_block":
        return (
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <Label>Heading</Label>
                <Input
                  value={(editData as any).heading || ""}
                  onChange={(e) => setEditData({ ...editData, heading: e.target.value } as any)}
                  placeholder="Section heading"
                />
                <Label>Body</Label>
                <Textarea
                  value={(editData as any).body || ""}
                  onChange={(e) => setEditData({ ...editData, body: e.target.value } as any)}
                  placeholder="Section content"
                  rows={6}
                />
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Section label"
                />
              </div>
            ) : (
              <div>
                {(section as any).heading && (
                  <h3 className="font-serif text-2xl text-neutral-900 mb-4">{(section as any).heading}</h3>
                )}
                {(section as any).label && (
                  <p className="text-sm text-muted-foreground mb-2">{(section as any).label}</p>
                )}
                <p className="text-neutral-700 leading-relaxed">{(section as any).body}</p>
              </div>
            )}
          </div>
        );

      case "gallery_grid":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {((editData as any).imagePaths || (section as any).imagePaths || []).map((imgPath: string, idx: number) => (
                <div key={idx} className="relative aspect-square bg-sand rounded-lg overflow-hidden group">
                  <Image
                    src={getProjectMediaUrl(imgPath)}
                    alt={`Gallery image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newPaths = ((editData as any).imagePaths || (section as any).imagePaths || []).filter((_: any, i: number) => i !== idx);
                          setEditData({ ...editData, imagePaths: newPaths } as any);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="space-y-3">
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Gallery label"
                />
                <Label>Add Images</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => handleMediaUpload(file, 'image'));
                    }}
                    className="flex-1"
                  />
                  {uploadingMedia === 'image' && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>
            )}
            {!isEditing && (section as any).label && (
              <p className="text-sm text-muted-foreground">{(section as any).label}</p>
            )}
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {(editData as any).thumbnailPath || (section as any).thumbnailPath ? (
                <img
                  src={getProjectMediaUrl((editData as any).thumbnailPath || (section as any).thumbnailPath)}
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}
              <video
                src={getProjectMediaUrl((editData as any).videoPath || (section as any).videoPath)}
                controls
                className="w-full h-full relative z-10"
                poster={
                  (editData as any).thumbnailPath || (section as any).thumbnailPath
                    ? getProjectMediaUrl((editData as any).thumbnailPath || (section as any).thumbnailPath)
                    : "/placeholder.jpg"
                }
              />
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <Label>Caption</Label>
                <Textarea
                  value={(editData as any).caption || ""}
                  onChange={(e) => setEditData({ ...editData, caption: e.target.value } as any)}
                  placeholder="Video caption"
                  rows={2}
                />
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Video label"
                />
                <Label>Thumbnail Image</Label>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Upload a custom thumbnail image or leave empty to use video frame
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMediaUpload(file, 'thumbnail');
                      }}
                      className="flex-1"
                    />
                    {uploadingMedia === 'thumbnail' && <Loader2 className="w-4 h-4 animate-spin" />}
                  </div>
                  {(editData as any).thumbnailPath && (
                    <div className="flex items-center gap-2">
                      <div className="relative w-16 h-9 overflow-hidden rounded bg-black">
                        <img
                          src={getProjectMediaUrl((editData as any).thumbnailPath)}
                          alt="Thumbnail preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditData({ ...editData, thumbnailPath: "" } as any)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                <Label>Replace Video</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMediaUpload(file, 'video');
                    }}
                    className="flex-1"
                  />
                  {uploadingMedia === 'video' && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>
            ) : (
              <>
                {(section as any).label && (
                  <p className="text-sm text-muted-foreground">{(section as any).label}</p>
                )}
                {(section as any).caption && (
                  <p className="text-sm text-neutral-600">{(section as any).caption}</p>
                )}
              </>
            )}
          </div>
        );

      case "technical_drawings":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {((editData as any).drawingPaths || (section as any).drawingPaths || []).map((drawingPath: string, idx: number) => (
                <div key={idx} className="relative aspect-[4/3] bg-sand rounded-lg overflow-hidden group">
                  <Image
                    src={getProjectMediaUrl(drawingPath)}
                    alt={`Technical drawing ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newPaths = ((editData as any).drawingPaths || (section as any).drawingPaths || []).filter((_: any, i: number) => i !== idx);
                          setEditData({ ...editData, drawingPaths: newPaths } as any);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="space-y-3">
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Drawings label"
                />
                <Label>Notes</Label>
                <Textarea
                  value={(editData as any).notes || ""}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value } as any)}
                  placeholder="Technical notes"
                  rows={2}
                />
                <Label>Add Drawings</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => handleMediaUpload(file, 'drawing'));
                    }}
                    className="flex-1"
                  />
                  {uploadingMedia === 'drawing' && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>
            )}
            {!isEditing && (
              <>
                {(section as any).label && (
                  <p className="text-sm text-muted-foreground">{(section as any).label}</p>
                )}
                {(section as any).notes && (
                  <p className="text-sm text-neutral-600">{(section as any).notes}</p>
                )}
              </>
            )}
          </div>
        );

      case "materials_table":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {((section as any).items || []).map((item: any, idx: number) => (
                <div key={idx} className="border-b border-neutral-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-neutral-900">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-neutral-600 mt-1">{item.description}</div>
                      )}
                    </div>
                    {item.role && (
                      <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                        {item.role}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="space-y-3">
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Materials label"
                />
              </div>
            )}
            {!isEditing && (section as any).label && (
              <p className="text-sm text-muted-foreground">{(section as any).label}</p>
            )}
          </div>
        );

      case "quote_block":
        return (
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <Label>Quote</Label>
                <Textarea
                  value={(editData as any).quote || ""}
                  onChange={(e) => setEditData({ ...editData, quote: e.target.value } as any)}
                  placeholder="Enter quote text"
                  rows={3}
                />
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Section label"
                />
              </div>
            ) : (
              <div>
                {(section as any).label && (
                  <p className="text-sm text-muted-foreground mb-2">{(section as any).label}</p>
                )}
                <blockquote className="font-serif text-xl text-neutral-900 leading-relaxed border-l-4 border-neutral-300 pl-4">
                  "{(section as any).quote}"
                </blockquote>
              </div>
            )}
          </div>
        );

      case "download_file":
        return (
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <Label>File Name</Label>
                <Input
                  value={(editData as any).fileName || ""}
                  onChange={(e) => setEditData({ ...editData, fileName: e.target.value } as any)}
                  placeholder="Enter file name"
                />
                <Label>File URL</Label>
                <Input
                  value={(editData as any).fileUrl || ""}
                  onChange={(e) => setEditData({ ...editData, fileUrl: e.target.value } as any)}
                  placeholder="https://example.com/file.pdf"
                />
                <Label>Description</Label>
                <Textarea
                  value={(editData as any).description || ""}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value } as any)}
                  placeholder="Describe this file"
                  rows={2}
                />
                <Label>Label</Label>
                <Input
                  value={(editData as any).label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value } as any)}
                  placeholder="Section label"
                />
              </div>
            ) : (
              <div>
                {(section as any).label && (
                  <p className="text-sm text-muted-foreground mb-2">{(section as any).label}</p>
                )}
                {(section as any).fileUrl && (
                  <div className="p-4 border rounded-lg bg-neutral-50">
                    <a
                      href={(section as any).fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="font-medium">{(section as any).fileName || "Download File"}</span>
                    </a>
                    {(section as any).description && (
                      <p className="text-sm text-muted-foreground mt-2">{(section as any).description}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return <p className="text-muted-foreground">Unknown section type</p>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
            {section.type === "full_image" && <ImageIcon className="w-4 h-4" />}
            {section.type === "text_block" && <FileText className="w-4 h-4" />}
            {section.type === "gallery_grid" && <ImageIcon className="w-4 h-4" />}
            {section.type === "video" && <Video className="w-4 h-4" />}
            {section.type === "technical_drawings" && <FileText className="w-4 h-4" />}
            {section.type === "materials_table" && <FileText className="w-4 h-4" />}
            {section.type === "quote_block" && <span className="text-lg">"</span>}
            {section.type === "download_file" && <Upload className="w-4 h-4" />}
            <span className="text-sm font-medium capitalize">
              {section.type.replace("_", " ")}
            </span>
          </div>
          <div className="flex gap-2">
            {!isFirst && onMoveUp && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMoveUp(index)}
                className="flex items-center gap-1"
              >
                <Move className="w-3 h-3" />
                Up
              </Button>
            )}
            {!isLast && onMoveDown && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMoveDown(index)}
                className="flex items-center gap-1"
              >
                <Move className="w-3 h-3" />
                Down
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1"
            >
              {isEditing ? (
                "Cancel"
              ) : (
                <>
                  <Edit3 className="w-3 h-3" />
                  Edit
                </>
              )}
            </Button>
            {isEditing && (
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(index)}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </div>

        {renderSectionContent()}
      </CardContent>
    </Card>
  );
}

function NewSectionForm({ onAdd }: { onAdd: (section: ProjectSection) => void }) {
  const [sectionType, setSectionType] = useState<string>("full_image");
  const [isExpanded, setIsExpanded] = useState(false);

  const createNewSection = () => {
    const newSection: any = {
      id: `section-${Date.now()}`,
      type: sectionType,
    };

    // Add default content based on type to match AI-generated structure
    switch (sectionType) {
      case "full_image":
        Object.assign(newSection, {
          imagePath: "",
          caption: "A view of architectural project showcasing design excellence and spatial quality.",
          label: "Project Detail"
        });
        break;
      case "text_block":
        Object.assign(newSection, {
          heading: "Architectural Detail",
          body: "This section highlights key aspects of project's design philosophy and execution. The architectural approach emphasizes both functionality and aesthetic appeal, creating spaces that serve their purpose while inspiring those who inhabit them.",
          label: "Detail"
        });
        break;
      case "gallery_grid":
        Object.assign(newSection, {
          imagePaths: [],
          label: "Gallery"
        });
        break;
      case "video":
        Object.assign(newSection, {
          videoPath: "",
          caption: "Experience the project through this immersive visual walkthrough.",
          label: "Video"
        });
        break;
      case "technical_drawings":
        Object.assign(newSection, {
          drawingPaths: [],
          notes: "Technical drawings illustrate the project's structural and spatial organization, providing insight into architectural planning and execution.",
          label: "Drawings"
        });
        break;
      case "quote_block":
        Object.assign(newSection, {
          quote: "Architecture is not an object. It is infrastructure. Experience is not a layer. It is a system. We design both — as one.",
          label: "Quote"
        });
        break;
      case "download_file":
        Object.assign(newSection, {
          fileName: "",
          fileUrl: "",
          description: "Download this file for more information",
          label: "Download"
        });
        break;
      case "materials_table":
        Object.assign(newSection, {
          items: [
            {
              name: "Material Name",
              description: "Description of material properties and application",
              role: "Primary"
            }
          ],
          label: "Materials"
        });
        break;
    }

    onAdd(newSection);
    setIsExpanded(false);
    setSectionType("full_image");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add New Section</span>
          </div>
          
          {isExpanded ? (
            <div className="space-y-4">
              <div>
                <Label>Section Type</Label>
                <select
                  value={sectionType}
                  onChange={(e) => setSectionType(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="full_image">Full Width Image</option>
                  <option value="text_block">Text Block</option>
                  <option value="gallery_grid">Gallery Grid</option>
                  <option value="video">Video</option>
                  <option value="technical_drawings">Technical Drawings</option>
                  <option value="quote_block">Quote Block</option>
                  <option value="download_file">Download File</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={createNewSection} size="sm">
                  Create Section
                </Button>
                <Button variant="outline" onClick={() => setIsExpanded(false)} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{ [key: string]: string }>({});
  const [showAiSuggestions, setShowAiSuggestions] = useState<{ [key: string]: boolean }>({});
  const [sections, setSections] = useState<ProjectSection[]>(project.sections || []);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: project.keyFacts.title,
    location: project.keyFacts.location || "",
    year: project.keyFacts.year || "",
    size: project.keyFacts.size || "",
    materials: project.keyFacts.materials || "",
    client: project.keyFacts.client || "",
    notes: project.notes || "",
    introText: project.introText || "",
    story: project.story || "",
    heroImagePath: project.heroImagePath || "",
    private: project.private || false,
    order: project.order || 0,
  });

  const handleHeroImageUpload = async (file: File) => {
    setUploadingHeroImage(true);
    
    try {
      if (!supabaseBrowserClient) {
        throw new Error("Supabase client not available");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `projects/${project.id}/hero/${fileName}`;

      const { error: uploadError } = await supabaseBrowserClient.storage
        .from('project-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Update form with new hero image path
      setFormData(prev => ({
        ...prev,
        heroImagePath: filePath
      }));
    } catch (error) {
      console.error("Error uploading hero image:", error);
      alert("Failed to upload hero image. Please try again.");
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAIGeneration = async (field: string, customPrompt?: string) => {
    setAiLoading(field);
    
    try {
      const response = await fetch("/api/projects/ai-regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          field,
          currentContent: formData[field as keyof typeof formData],
          customPrompt,
          projectContext: {
            title: formData.title,
            location: formData.location,
            materials: formData.materials,
            year: formData.year,
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      
      if (field === "fullProject") {
        // Apply full project structure
        if (data.sections) {
          setSections(data.sections);
        }
        if (data.introText) {
          handleInputChange("introText", data.introText);
        }
        if (data.story) {
          handleInputChange("story", data.story);
        }
      } else {
        setAiSuggestions(prev => ({
          ...prev,
          [field]: data.content
        }));
        setShowAiSuggestions(prev => ({
          ...prev,
          [field]: true
        }));
      }
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate AI content. Please try again.");
    } finally {
      setAiLoading(null);
    }
  };

  const applyAiSuggestion = (field: string) => {
    const suggestion = aiSuggestions[field];
    if (suggestion) {
      handleInputChange(field, suggestion);
      setShowAiSuggestions(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const handleSectionUpdate = (index: number, updatedSection: ProjectSection) => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[index] = updatedSection;
      return newSections;
    });
  };

  const handleSectionDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSectionAdd = (newSection: ProjectSection) => {
    setSections(prev => [...prev, newSection]);
  };

  const handleSectionMoveUp = (index: number) => {
    if (index > 0) {
      setSections(prev => {
        const newSections = [...prev];
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        return newSections;
      });
    }
  };

  const handleSectionMoveDown = (index: number) => {
    if (index < sections.length - 1) {
      setSections(prev => {
        const newSections = [...prev];
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        return newSections;
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      if (!supabaseBrowserClient) {
        throw new Error("Supabase client not available");
      }

      const { error } = await supabaseBrowserClient
        .from("projects")
        .update({
          title: formData.title,
          location: formData.location || null,
          year: formData.year ? parseInt(String(formData.year)) : null,
          size: formData.size || null,
          materials: formData.materials || null,
          client: formData.client || null,
          notes: formData.notes || null,
          intro_text: formData.introText || null,
          story: formData.story || null,
          hero_image_path: formData.heroImagePath || null,
          sections: sections,
          private: formData.private,
          order: formData.order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);

      if (error) {
        throw error;
      }

      // Redirect back to admin projects
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Project title"
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="2024"
              />
            </div>
            
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                placeholder="500 sqm"
              />
            </div>
            
            <div>
              <Label htmlFor="materials">Materials</Label>
              <Input
                id="materials"
                value={formData.materials}
                onChange={(e) => handleInputChange("materials", e.target.value)}
                placeholder="Concrete, Glass, Steel"
              />
            </div>
            
            <div>
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
                placeholder="Client name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative aspect-[16/9] w-full bg-sand rounded-lg overflow-hidden">
              {formData.heroImagePath ? (
                <Image
                  src={getProjectMediaUrl(formData.heroImagePath)}
                  alt="Hero image"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Current hero image: {formData.heroImagePath || "No hero image set"}
            </div>
            <div className="space-y-3">
              <Label>Replace Hero Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleHeroImageUpload(file);
                  }}
                  className="flex-1"
                />
                {uploadingHeroImage && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content with AI Assistance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Content
              <Sparkles className="w-4 h-4 text-blue-500" />
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIGeneration("fullProject")}
              disabled={aiLoading === "fullProject"}
              className="flex items-center gap-2"
            >
              {aiLoading === "fullProject" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              Generate Full Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="introText">Introduction Text</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAIGeneration("introText")}
                disabled={aiLoading === "introText"}
                className="flex items-center gap-2"
              >
                {aiLoading === "introText" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                AI Generate
              </Button>
            </div>
            <Textarea
              id="introText"
              value={formData.introText}
              onChange={(e) => handleInputChange("introText", e.target.value)}
              placeholder="Brief introduction to the project..."
              rows={3}
            />
            {showAiSuggestions.introText && aiSuggestions.introText && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-700">AI Suggestion:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => applyAiSuggestion("introText")}
                      className="text-xs"
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAiSuggestions(prev => ({ ...prev, introText: false }))}
                      className="text-xs"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-blue-600">{aiSuggestions.introText}</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="story">Story</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAIGeneration("story")}
                disabled={aiLoading === "story"}
                className="flex items-center gap-2"
              >
                {aiLoading === "story" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                AI Generate
              </Button>
            </div>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => handleInputChange("story", e.target.value)}
              placeholder="Detailed project story..."
              rows={8}
            />
            {showAiSuggestions.story && aiSuggestions.story && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-700">AI Suggestion:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => applyAiSuggestion("story")}
                      className="text-xs"
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAiSuggestions(prev => ({ ...prev, story: false }))}
                      className="text-xs"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-blue-600 whitespace-pre-wrap">{aiSuggestions.story}</p>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes or technical details..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Project Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>No sections yet. Add your first section below.</p>
              </div>
            ) : (
              sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={index}
                  onUpdate={handleSectionUpdate}
                  onDelete={handleSectionDelete}
                  onMoveUp={handleSectionMoveUp}
                  onMoveDown={handleSectionMoveDown}
                  isFirst={index === 0}
                  isLast={index === sections.length - 1}
                />
              ))
            )}
            
            <NewSectionForm onAdd={handleSectionAdd} />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="private"
              checked={formData.private}
              onCheckedChange={(checked) => handleInputChange("private", checked)}
            />
            <Label htmlFor="private" className="text-sm">
              Make this story private (NDA Protected)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Private stories will show a preview only and cannot be viewed in detail by the public.
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <div className="text-sm text-muted-foreground">
            {sections.length} section{sections.length !== 1 ? 's' : ''} • {sections.filter(s => (s as any).imagePaths?.length > 0 || (s as any).drawingPaths?.length > 0 || (s as any).videoPath).length} media files
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            disabled={saving}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-w-32"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
