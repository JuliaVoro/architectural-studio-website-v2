"use client";

import { useEffect, useState } from "react";
import type { HeroConfig } from "@/app/api/hero-config/route";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function HeroConfigAdminPage() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/hero-config", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load hero configuration");
        }
        const data = (await res.json()) as { config: HeroConfig };
        setConfig(data.config);
      } catch (err) {
        console.error(err);
        setError("Could not load hero configuration.");
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  function updateConfig(patch: Partial<HeroConfig>) {
    if (!config) return;
    setConfig({ ...config, ...patch });
  }

  async function saveConfig() {
    if (!config) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/hero-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save configuration");
      }
      const data = (await res.json()) as { config: HeroConfig };
      setConfig(data.config);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to save configuration. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const isSlider = config?.template === "slider";
  const isSingle = config?.template === "single";

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
          Homepage Hero Configuration
        </h1>
        <p className="max-w-xl text-sm text-neutral-600">
          Choose between slider and single hero templates. Configure content for the single hero option.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading configuration…</p>
      ) : config ? (
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-neutral-900">Template Selection</h2>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  Hero Template
                </Label>
                <Select
                  value={config.template}
                  onValueChange={(value: "slider" | "single") =>
                    updateConfig({ template: value })
                  }
                >
                  <SelectTrigger className="h-9 border-neutral-300 bg-neutral-50 text-xs uppercase tracking-[0.18em]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slider">Slider Hero (Current)</SelectItem>
                    <SelectItem value="single">Single Hero (New)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-neutral-500">
                  {isSlider 
                    ? "The current slideshow hero with multiple slides will be displayed."
                    : "A single, static hero section will be displayed with the content below."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Single Hero Configuration */}
          {isSingle && (
            <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-900">Single Hero Content</h2>
                <p className="text-[11px] text-neutral-500">
                  Configure the content for your single hero section. Only used when "Single Hero" template is selected.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Label */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Label (Optional)
                    </Label>
                    <Input
                      value={config.label || ""}
                      onChange={(e) =>
                        updateConfig({ label: e.target.value || null })
                      }
                      className="border-neutral-300 bg-neutral-50 text-sm"
                      placeholder="Featured Project"
                    />
                    <p className="text-[11px] text-neutral-500">
                      Small category label displayed above the title
                    </p>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Title
                    </Label>
                    <Input
                      value={config.title || ""}
                      onChange={(e) =>
                        updateConfig({ title: e.target.value || null })
                      }
                      className="border-neutral-300 bg-neutral-50 text-sm"
                      placeholder="Architectural Excellence"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Subtitle
                    </Label>
                    <Input
                      value={config.subtitle || ""}
                      onChange={(e) =>
                        updateConfig({ subtitle: e.target.value || null })
                      }
                      className="border-neutral-300 bg-neutral-50 text-sm"
                      placeholder="Innovative Design Solutions"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Description
                    </Label>
                    <Textarea
                      value={config.description || ""}
                      onChange={(e) =>
                        updateConfig({ description: e.target.value || null })
                      }
                      className="border-neutral-300 bg-neutral-50 text-sm min-h-[80px]"
                      placeholder="Brief description of your architectural approach..."
                    />
                    <p className="text-[11px] text-neutral-500">
                      Short description displayed below the title
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* CTA Text */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      CTA Button Text
                    </Label>
                    <Input
                      value={config.ctaText || ""}
                      onChange={(e) =>
                        updateConfig({ ctaText: e.target.value || null })
                      }
                      className="border-neutral-300 bg-neutral-50 text-sm"
                      placeholder="View Projects"
                    />
                  </div>

                  {/* CTA Link */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      CTA Link
                    </Label>
                    <Input
                      value={config.ctaLink || ""}
                      onChange={(e) =>
                        updateConfig({ ctaLink: e.target.value || null })
                      }
                      className="border-neutral-300 bg-neutral-50 text-sm"
                      placeholder="#projects"
                    />
                    <p className="text-[11px] text-neutral-500">
                      Anchor or URL for the CTA button
                    </p>
                  </div>

                  {/* Background Type */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Background Type
                    </Label>
                    <Select
                      value={config.backgroundType || "image"}
                      onValueChange={(value: "image" | "video") =>
                        updateConfig({ backgroundType: value })
                      }
                    >
                      <SelectTrigger className="h-9 border-neutral-300 bg-neutral-50 text-xs uppercase tracking-[0.18em]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Background Source */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Background URL
                    </Label>
                    <Input
                      value={config.backgroundSrc || ""}
                      onChange={(e) =>
                        updateConfig({ backgroundSrc: e.target.value || null })
                      }
                      className="border-neutral-300 bg-neutral-50 text-sm"
                      placeholder="/images/hero-bg.jpg or /videos/hero.mp4"
                    />
                  </div>

                  {/* Background Poster (for videos) */}
                  {config.backgroundType === "video" && (
                    <div className="space-y-2">
                      <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Video Poster Image
                      </Label>
                      <Input
                        value={config.backgroundPoster || ""}
                        onChange={(e) =>
                          updateConfig({ backgroundPoster: e.target.value || null })
                        }
                        className="border-neutral-300 bg-neutral-50 text-sm"
                        placeholder="/images/hero-poster.jpg"
                      />
                      <p className="text-[11px] text-neutral-500">
                        Fallback image shown while video loads
                      </p>
                    </div>
                  )}

                  {/* Overlay Opacity */}
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      Overlay Opacity: {config.overlayOpacity}%
                    </Label>
                    <Slider
                      value={[config.overlayOpacity || 40]}
                      onValueChange={([value]) => updateConfig({ overlayOpacity: value })}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-[11px] text-neutral-500">
                      Dark overlay for text readability (0-100%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-neutral-500">
              Last updated: {new Date(config.updatedAt).toLocaleString()}
            </div>
            <div className="flex items-center gap-4">
              {saving && (
                <span className="text-xs text-neutral-500">Saving…</span>
              )}
              <Button
                type="button"
                onClick={saveConfig}
                disabled={saving}
                className="text-xs uppercase tracking-[0.18em]"
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
