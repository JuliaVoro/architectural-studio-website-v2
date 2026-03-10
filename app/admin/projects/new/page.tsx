"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabase-client";
import type { CreateProjectPayload } from "@/lib/projects";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type MediaGroup = {
  images: File[];
  videos: File[];
  drawings: File[];
};

type MediaFileWithId = File & { id: string };

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [size, setSize] = useState("");
  const [materials, setMaterials] = useState("");
  const [client, setClient] = useState("");
  const [notes, setNotes] = useState("");
  const [media, setMedia] = useState<MediaGroup>({
    images: [],
    videos: [],
    drawings: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleFileChange(
    type: keyof MediaGroup,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);
    setMedia((prev) => ({ ...prev, [type]: files }));
  }

  function addFile(type: keyof MediaGroup) {
    // Create a temporary file input to trigger file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    if (type === 'images') {
      input.accept = 'image/*';
    } else if (type === 'videos') {
      input.accept = 'video/*';
    } else if (type === 'drawings') {
      input.accept = 'application/pdf,image/*';
    }
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files ?? []);
      if (files.length > 0) {
        setMedia(prev => ({
          ...prev,
          [type]: [...prev[type], ...files]
        }));
      }
    };
    
    input.click();
  }

  function removeFile(type: keyof MediaGroup, index: number) {
    setMedia(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  }

  function getFileDisplayText(type: keyof MediaGroup): string {
    if (type === 'images') return 'Photography';
    if (type === 'videos') return 'Video';
    if (type === 'drawings') return 'Technical drawings';
    return '';
  }

  async function uploadFilesToSupabase(): Promise<{
    imagePaths: string[];
    videoPaths: string[];
    drawingPaths: string[];
  }> {
    const bucket = "project-media";
    const folder = `projects/${Date.now()}`;

    async function uploadGroup(
      files: File[],
      kind: "images" | "videos" | "drawings",
    ) {
      const paths: string[] = [];

      for (const file of files) {
        const safeName = file.name.replace(/[^a-z0-9_.-]/gi, "_").toLowerCase();
        const path = `${folder}/${kind}/${Date.now()}-${safeName}`;

        const { data, error } = await supabaseBrowserClient.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          throw new Error(`Failed to upload ${kind} file: ${file.name}`);
        }

        paths.push(data.path);
      }

      return paths;
    }

    const [imagePaths, videoPaths, drawingPaths] = await Promise.all([
      uploadGroup(media.images, "images"),
      uploadGroup(media.videos, "videos"),
      uploadGroup(media.drawings, "drawings"),
    ]);

    return { imagePaths, videoPaths, drawingPaths };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { imagePaths, videoPaths, drawingPaths } =
        await uploadFilesToSupabase();

      const payload: CreateProjectPayload = {
        keyFacts: {
          title,
          location: location || undefined,
          year: year ? Number(year) : undefined,
          size: size || undefined,
          materials: materials || undefined,
          client: client || undefined,
        },
        notes: notes || undefined,
        imagePaths,
        videoPaths,
        drawingPaths,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create project");
      }

      const data = await response.json();
      const slug: string | undefined = data.project?.slug;

      setSuccessMessage("Project created. Opening public page…");

      if (slug) {
        setTimeout(() => {
          router.push(`/systems/${slug}`);
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
          New Project
        </h1>
        <p className="max-w-xl text-sm text-neutral-600">
          Upload photography, video, and technical drawings. Provide a few key
          facts and notes, and the AI editor will assemble a magazine-style case
          study page.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[2fr,1.3fr]">
        <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-5">
          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="House on a Narrow Plot"
              className="border-neutral-300 bg-neutral-50"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Lisbon, Portugal"
                className="border-neutral-300 bg-neutral-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="2024"
                className="border-neutral-300 bg-neutral-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                placeholder="420 m²"
                className="border-neutral-300 bg-neutral-50"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="materials">Key materials</Label>
              <Input
                id="materials"
                value={materials}
                onChange={(event) => setMaterials(event.target.value)}
                placeholder="Board-formed concrete, oak, brushed aluminium"
                className="border-neutral-300 bg-neutral-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={client}
                onChange={(event) => setClient(event.target.value)}
                placeholder="Private client"
                className="border-neutral-300 bg-neutral-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Short notes to the editor</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe the intent, constraints, and what matters most to you in this project."
              rows={6}
              className="border-neutral-300 bg-neutral-50"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-5">
            <div className="space-y-1">
              <Label>{getFileDisplayText('images')}</Label>
              <p className="text-xs text-neutral-500">
                Upload multiple JPG or PNG images. Include overall views,
                details, and context.
              </p>
            </div>
            
            {media.images.length > 0 && (
              <div className="space-y-2 mb-3">
                {media.images.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded border border-neutral-200 p-2">
                    <span className="text-sm text-neutral-700 truncate flex-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile('images', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => handleFileChange("images", event)}
                className="border-neutral-300 bg-neutral-50 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFile('images')}
                className="whitespace-nowrap"
              >
                Add More
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-5">
            <div className="space-y-1">
              <Label>{getFileDisplayText('videos')}</Label>
              <p className="text-xs text-neutral-500">
                Short project films or walkthroughs.
              </p>
            </div>
            
            {media.videos.length > 0 && (
              <div className="space-y-2 mb-3">
                {media.videos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded border border-neutral-200 p-2">
                    <span className="text-sm text-neutral-700 truncate flex-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile('videos', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                type="file"
                accept="video/*"
                multiple
                onChange={(event) => handleFileChange("videos", event)}
                className="border-neutral-300 bg-neutral-50 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFile('videos')}
                className="whitespace-nowrap"
              >
                Add More
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-5">
            <div className="space-y-1">
              <Label>{getFileDisplayText('drawings')}</Label>
              <p className="text-xs text-neutral-500">
                Plans, sections, elevations, or diagrams.
              </p>
            </div>
            
            {media.drawings.length > 0 && (
              <div className="space-y-2 mb-3">
                {media.drawings.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded border border-neutral-200 p-2">
                    <span className="text-sm text-neutral-700 truncate flex-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile('drawings', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                type="file"
                accept="application/pdf,image/*"
                multiple
                onChange={(event) => handleFileChange("drawings", event)}
                className="border-neutral-300 bg-neutral-50 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFile('drawings')}
                className="whitespace-nowrap"
              >
                Add More
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-xs text-emerald-700">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting || !title}
            className="w-full bg-neutral-900 text-xs uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
          >
            {submitting ? "Generating case study…" : "Generate case study"}
          </Button>
        </section>
      </form>
    </div>
  );
}

