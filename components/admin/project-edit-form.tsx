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

interface ProjectEditFormProps {
  project: Project;
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="introText">Introduction Text</Label>
            <Textarea
              id="introText"
              value={formData.introText}
              onChange={(e) => handleInputChange("introText", e.target.value)}
              placeholder="Brief introduction to the project..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="story">Story</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => handleInputChange("story", e.target.value)}
              placeholder="Detailed project story..."
              rows={8}
            />
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
