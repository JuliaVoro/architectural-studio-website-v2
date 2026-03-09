"use client";

import { useEffect, useState } from "react";
import type { HeroSlide, HeroSlideType } from "@/lib/hero-slides";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type EditableSlide = Omit<HeroSlide, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export default function HeroSlidesAdminPage() {
  const [slides, setSlides] = useState<EditableSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState<string | null>(null);

  useEffect(() => {
    async function loadSlides() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/hero-slides", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load slides");
        }
        const data = (await res.json()) as { slides: HeroSlide[] };
        const mapped: EditableSlide[] = data.slides.map((slide) => ({
          ...slide,
          createdAt: slide.createdAt,
          updatedAt: slide.updatedAt,
        }));
        setSlides(mapped);
      } catch (err) {
        console.error(err);
        setError("Could not load hero slides.");
      } finally {
        setLoading(false);
      }
    }

    loadSlides();
  }, []);

  function updateSlide(id: string, patch: Partial<EditableSlide>) {
    setSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)),
    );
  }

  function addSlide() {
    const tempId = `temp-${Date.now()}`;
    setSlides((prev) => [
      ...prev,
      {
        id: tempId,
        orderIndex: prev.length,
        hidden: false,
        type: "video",
        src: "",
        poster: "",
        label: "Comercial",
        title: "New Slide",
        subtitle: "Subtitle",
      },
    ]);
  }

  async function saveSlide(slide: EditableSlide) {
    setSaving(true);
    setError(null);

    const payload = {
      type: slide.type as HeroSlideType,
      src: slide.src,
      poster: slide.poster ?? "",
      label: slide.label,
      title: slide.title,
      subtitle: slide.subtitle,
      hidden: slide.hidden,
      orderIndex: slide.orderIndex,
    };

    try {
      if (slide.id.startsWith("temp-")) {
        const res = await fetch("/api/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to create slide");
        }
        const data = (await res.json()) as { slide: HeroSlide };
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, ...data.slide } : s)),
        );
      } else {
        const res = await fetch(`/api/hero-slides/${slide.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to update slide");
        }
        const data = (await res.json()) as { slide: HeroSlide };
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, ...data.slide } : s)),
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to save slide. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlide(id: string) {
    if (id.startsWith("temp-")) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
      return;
    }

    const confirmed = window.confirm(
      "Remove this slide from the header slider?",
    );
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete slide");
      }
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to delete slide. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleVideoUpload(
    slideId: string,
    file: File,
  ) {
    setUploadingVideo(slideId);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to upload video");
      }

      const data = await res.json() as { url: string };
      updateSlide(slideId, { src: data.url });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to upload video. Try again.",
      );
    } finally {
      setUploadingVideo(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
          Header Slider
        </h1>
        <p className="max-w-xl text-sm text-neutral-600">
          Manage the homepage hero slideshow. Edit labels, titles, subtitles,
          and media URLs. Use the visibility toggle to hide slides without
          deleting them.
        </p>
      </header>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={addSlide}
          className="text-xs uppercase tracking-[0.2em]"
        >
          Add Slide
        </Button>
        {saving && (
          <span className="text-xs text-neutral-500">Saving…</span>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading slides…</p>
      ) : slides.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No slides yet. Add your first slide to populate the homepage header.
        </p>
      ) : (
        <div className="space-y-4">
          {slides
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((slide) => (
              <div
                key={slide.id}
                className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                      {slide.title || "Untitled"}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      #{slide.orderIndex}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Hidden
                      </span>
                      <Switch
                        checked={slide.hidden}
                        onCheckedChange={(checked) =>
                          updateSlide(slide.id, { hidden: checked })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[11px] uppercase tracking-[0.18em] text-red-500 hover:text-red-600"
                      onClick={() => deleteSlide(slide.id)}
                    >
                      Remove
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-[11px] uppercase tracking-[0.18em]"
                      onClick={() => saveSlide(slide)}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.4fr,1.4fr,0.8fr]">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Label
                      </Label>
                      <Input
                        value={slide.label}
                        onChange={(e) =>
                          updateSlide(slide.id, { label: e.target.value })
                        }
                        className="border-neutral-300 bg-neutral-50 text-sm"
                        placeholder="Comercial / Residential"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Title
                      </Label>
                      <Input
                        value={slide.title}
                        onChange={(e) =>
                          updateSlide(slide.id, { title: e.target.value })
                        }
                        className="border-neutral-300 bg-neutral-50 text-sm"
                        placeholder="Showroom"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Subtitle
                      </Label>
                      <Input
                        value={slide.subtitle}
                        onChange={(e) =>
                          updateSlide(slide.id, { subtitle: e.target.value })
                        }
                        className="border-neutral-300 bg-neutral-50 text-sm"
                        placeholder="Retail as immersive experience"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Media type
                      </Label>
                      <Select
                        value={slide.type}
                        onValueChange={(value: HeroSlideType) =>
                          updateSlide(slide.id, { type: value })
                        }
                      >
                        <SelectTrigger className="h-9 border-neutral-300 bg-neutral-50 text-xs uppercase tracking-[0.18em]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Media URL
                      </Label>
                      <Input
                        value={slide.src}
                        onChange={(e) =>
                          updateSlide(slide.id, { src: e.target.value })
                        }
                        className="border-neutral-300 bg-neutral-50 text-sm"
                        placeholder="https://... (or upload below)"
                      />
                    </div>
                    {slide.type === "video" && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                            Or upload video file
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleVideoUpload(slide.id, file);
                                  e.target.value = "";
                                }
                              }}
                              disabled={uploadingVideo === slide.id}
                              className="border-neutral-300 bg-neutral-50 text-sm"
                            />
                            {uploadingVideo === slide.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                            Poster image URL
                          </Label>
                          <Input
                            value={slide.poster ?? ""}
                            onChange={(e) =>
                              updateSlide(slide.id, { poster: e.target.value })
                            }
                            className="border-neutral-300 bg-neutral-50 text-sm"
                            placeholder="https://... (image shown before video plays)"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                        Order
                      </Label>
                      <Input
                        type="number"
                        value={slide.orderIndex}
                        onChange={(e) =>
                          updateSlide(slide.id, {
                            orderIndex: Number(e.target.value),
                          })
                        }
                        className="w-20 border-neutral-300 bg-neutral-50 text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Lower numbers appear earlier in the slider. Hidden slides
                      are skipped on the homepage.
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

