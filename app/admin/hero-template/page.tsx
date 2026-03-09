"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeroSplit } from "@/components/home/hero-split";
import { HeroSlideshow } from "@/components/home/hero-slideshow";

interface HeroConfig {
  id: string;
  template_type: "slider" | "split";
  split_title?: string;
  split_subtitle?: string;
  split_description?: string;
  split_media_url?: string;
  split_media_type?: "image" | "video";
  split_layout?: "media-right" | "media-left";
}

export default function HeroTemplatePage() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state for split template
  const [formData, setFormData] = useState({
    template_type: "slider" as "slider" | "split",
    split_title: "",
    split_subtitle: "",
    split_description: "",
    split_media_url: "",
    split_media_type: "image" as "image" | "video",
    split_layout: "media-right" as "media-right" | "media-left",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/hero-config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setFormData({
          template_type: data.template_type || "slider",
          split_title: data.split_title || "",
          split_subtitle: data.split_subtitle || "",
          split_description: data.split_description || "",
          split_media_url: data.split_media_url || "",
          split_media_type: data.split_media_type || "image",
          split_layout: data.split_layout || "media-right",
        });
      }
    } catch (err) {
      setError("Failed to load hero configuration");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/hero-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      const data = await response.json();
      setConfig(data);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Hero Template Manager
        </h1>
        <p className="text-muted-foreground mb-8">
          Choose and customize your homepage hero section
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg p-6 space-y-6">
              {/* Template Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Template Type
                </label>
                <Select
                  value={formData.template_type}
                  onValueChange={(value: string) =>
                    setFormData({
                      ...formData,
                      template_type: value as "slider" | "split",
                    })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slider">
                      Slider (Default - Multiple Slides)
                    </SelectItem>
                    <SelectItem value="split">
                      Split (Title + Media)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Split Template Settings */}
              {formData.template_type === "split" && (
                <div className="space-y-4 pt-4 border-t border-foreground/10">
                  <h3 className="font-medium text-foreground">Split Template Settings</h3>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Subtitle
                    </label>
                    <Input
                      placeholder="e.g., Our Studio"
                      value={formData.split_subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          split_subtitle: e.target.value,
                        })
                      }
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Title
                    </label>
                    <Input
                      placeholder="e.g., Welcome to Our Studio"
                      value={formData.split_title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          split_title: e.target.value,
                        })
                      }
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Description
                    </label>
                    <Textarea
                      placeholder="e.g., Crafting spaces that inspire and transform everyday experiences."
                      value={formData.split_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          split_description: e.target.value,
                        })
                      }
                      className="bg-background min-h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Media Type
                    </label>
                    <Select
                      value={formData.split_media_type}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          split_media_type: value as "image" | "video",
                        })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Media URL
                    </label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.split_media_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          split_media_url: e.target.value,
                        })
                      }
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.split_media_type === "image"
                        ? "Enter image URL (JPG, PNG, WebP)"
                        : "Enter video URL (MP4, WebM)"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Layout
                    </label>
                    <Select
                      value={formData.split_layout}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          split_layout: value as "media-right" | "media-left",
                        })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="media-right">
                          Title Left, Media Right
                        </SelectItem>
                        <SelectItem value="media-left">
                          Media Left, Title Right
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-600">
                  Changes saved successfully!
                </div>
              )}

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-muted rounded-lg overflow-hidden h-full min-h-96">
              <div className="p-6 h-full">
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  Live Preview
                </p>
                <div className="h-full">
                  {formData.template_type === "slider" ? (
                    <div className="flex items-center justify-center h-full bg-background/50 rounded border border-foreground/10">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">
                          Slider Template
                        </p>
                        <p className="text-sm text-muted-foreground/60">
                          Shows multiple slides with auto-advance
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-y-auto max-h-96">
                      <HeroSplit
                        title={formData.split_title}
                        subtitle={formData.split_subtitle}
                        description={formData.split_description}
                        mediaUrl={formData.split_media_url}
                        mediaType={formData.split_media_type}
                        layout={formData.split_layout}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
