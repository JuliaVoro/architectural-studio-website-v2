"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabase-client";
import type { Project } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";

interface ProjectEditFormProps {
  project: Project;
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{ [key: string]: string }>({});
  const [showAiSuggestions, setShowAiSuggestions] = useState<{ [key: string]: boolean }>({});
  
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
  });

  const handleInputChange = (field: string, value: string | number) => {
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
      setAiSuggestions(prev => ({
        ...prev,
        [field]: data.content
      }));
      setShowAiSuggestions(prev => ({
        ...prev,
        [field]: true
      }));
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
