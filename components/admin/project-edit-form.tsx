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
import { Loader2, Sparkles, RefreshCw, Plus, Trash2, Edit3, Image as ImageIcon, Video, FileText, Move } from "lucide-react";
import Image from "next/image";

interface ProjectEditFormProps {
  project: Project;
}

interface SectionEditProps {
  section: ProjectSection;
  index: number;
  onUpdate: (index: number, section: ProjectSection) => void;
  onDelete: (index: number) => void;
}

function SectionEditor({ section, index, onUpdate, onDelete }: SectionEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(section);

  const handleSave = () => {
    onUpdate(index, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(section);
    setIsEditing(false);
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case "full_image":
        return (
          <div className="space-y-4">
            <div className="relative aspect-[16/10] w-full bg-sand rounded-lg overflow-hidden">
              <Image
                src={getProjectMediaUrl(section.imagePath)}
                alt={section.caption || "Project image"}
                fill
                className="object-cover"
              />
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <Label>Caption</Label>
                <Textarea
                  value={editData.caption || ""}
                  onChange={(e) => setEditData({ ...editData, caption: e.target.value })}
                  placeholder="Image caption"
                  rows={2}
                />
                <Label>Label</Label>
                <Input
                  value={editData.label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="Section label"
                />
              </div>
            ) : (
              <>
                {section.label && (
                  <p className="text-sm text-muted-foreground">{section.label}</p>
                )}
                {section.caption && (
                  <p className="text-sm text-neutral-600">{section.caption}</p>
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
                  value={editData.heading || ""}
                  onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                  placeholder="Section heading"
                />
                <Label>Body</Label>
                <Textarea
                  value={editData.body || ""}
                  onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                  placeholder="Section content"
                  rows={6}
                />
                <Label>Label</Label>
                <Input
                  value={editData.label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="Section label"
                />
              </div>
            ) : (
              <div>
                {section.heading && (
                  <h3 className="font-serif text-2xl text-neutral-900 mb-4">{section.heading}</h3>
                )}
                {section.label && (
                  <p className="text-sm text-muted-foreground mb-2">{section.label}</p>
                )}
                <p className="text-neutral-700 leading-relaxed">{section.body}</p>
              </div>
            )}
          </div>
        );

      case "gallery_grid":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {section.imagePaths?.map((imgPath, idx) => (
                <div key={idx} className="relative aspect-square bg-sand rounded-lg overflow-hidden">
                  <Image
                    src={getProjectMediaUrl(imgPath)}
                    alt={`Gallery image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="space-y-3">
                <Label>Label</Label>
                <Input
                  value={editData.label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="Gallery label"
                />
              </div>
            )}
            {!isEditing && section.label && (
              <p className="text-sm text-muted-foreground">{section.label}</p>
            )}
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={getProjectMediaUrl(section.videoPath)}
                controls
                className="w-full h-full"
                poster="/placeholder.jpg"
              />
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <Label>Caption</Label>
                <Textarea
                  value={editData.caption || ""}
                  onChange={(e) => setEditData({ ...editData, caption: e.target.value })}
                  placeholder="Video caption"
                  rows={2}
                />
                <Label>Label</Label>
                <Input
                  value={editData.label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="Video label"
                />
              </div>
            ) : (
              <>
                {section.label && (
                  <p className="text-sm text-muted-foreground">{section.label}</p>
                )}
                {section.caption && (
                  <p className="text-sm text-neutral-600">{section.caption}</p>
                )}
              </>
            )}
          </div>
        );

      case "technical_drawings":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {section.drawingPaths?.map((drawingPath, idx) => (
                <div key={idx} className="relative aspect-[4/3] bg-sand rounded-lg overflow-hidden">
                  <Image
                    src={getProjectMediaUrl(drawingPath)}
                    alt={`Technical drawing ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="space-y-3">
                <Label>Label</Label>
                <Input
                  value={editData.label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="Drawings label"
                />
                <Label>Notes</Label>
                <Textarea
                  value={editData.notes || ""}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  placeholder="Technical notes"
                  rows={2}
                />
              </div>
            )}
            {!isEditing && (
              <>
                {section.label && (
                  <p className="text-sm text-muted-foreground">{section.label}</p>
                )}
                {section.notes && (
                  <p className="text-sm text-neutral-600">{section.notes}</p>
                )}
              </>
            )}
          </div>
        );

      case "materials_table":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items?.map((item, idx) => (
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
                  value={editData.label || ""}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="Materials label"
                />
              </div>
            )}
            {!isEditing && section.label && (
              <p className="text-sm text-muted-foreground">{section.label}</p>
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
            {section.type === "full_image" && <ImageIcon className="w-4 h-4" />}
            {section.type === "text_block" && <FileText className="w-4 h-4" />}
            {section.type === "gallery_grid" && <ImageIcon className="w-4 h-4" />}
            {section.type === "video" && <Video className="w-4 h-4" />}
            {section.type === "technical_drawings" && <FileText className="w-4 h-4" />}
            {section.type === "materials_table" && <FileText className="w-4 h-4" />}
            <span className="text-sm font-medium capitalize">
              {section.type.replace("_", " ")}
            </span>
          </div>
          <div className="flex gap-2">
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

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{ [key: string]: string }>({});
  const [showAiSuggestions, setShowAiSuggestions] = useState<{ [key: string]: boolean }>({});
  const [sections, setSections] = useState<ProjectSection[]>(project.sections || []);
  
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
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
          year: formData.year ? parseInt(formData.year) : null,
          size: formData.size || null,
          materials: formData.materials || null,
          client: formData.client || null,
          notes: formData.notes || null,
          intro_text: formData.introText || null,
          story: formData.story || null,
          hero_image_path: formData.heroImagePath || null,
          sections: sections,
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
          </div>
        </CardContent>
      </Card>

      {/* Content with AI Assistance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Content
            <Sparkles className="w-4 h-4 text-blue-500" />
          </CardTitle>
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
                <p>No sections yet. Sections are generated by AI when creating projects.</p>
              </div>
            ) : (
              sections.map((section, index) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={index}
                  onUpdate={handleSectionUpdate}
                  onDelete={handleSectionDelete}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/projects")}
          disabled={saving}
        >
          Cancel
        </Button>
        
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
