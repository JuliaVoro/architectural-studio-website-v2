"use client";

import { useState } from "react";
import { getProjectMediaUrl } from "@/lib/projects";
import { ImageLightbox } from "./ImageLightbox";

interface TechnicalDrawingsProps {
  drawingPaths: string[];
  notes?: string;
}

export function TechnicalDrawings({
  drawingPaths,
  notes,
}: TechnicalDrawingsProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!drawingPaths.length) return null;

  // Filter out PDFs for lightbox (only images)
  const imagePaths = drawingPaths.filter((path) => !path.toLowerCase().endsWith(".pdf"));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
              Technical Drawings
            </div>
            {notes && (
              <p className="mt-2 max-w-xl text-xs text-neutral-600">{notes}</p>
            )}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {drawingPaths.map((path) => {
            const url = getProjectMediaUrl(path);
            const isPdf = path.toLowerCase().endsWith(".pdf");

            if (isPdf) {
              return (
                <a
                  key={path}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[220px] items-center justify-center rounded-lg border border-neutral-200 bg-white text-xs text-neutral-600 hover:border-neutral-900"
                >
                  Open drawing PDF
                </a>
              );
            }

            // Calculate the index in the filtered image array
            const imageIndex = imagePaths.findIndex((p) => p === path);

            return (
              <figure
                key={path}
                className="flex h-[220px] items-center justify-center rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-neutral-400 transition-colors"
                onClick={() => openLightbox(imageIndex)}
              >
                <img
                  src={url}
                  alt="Technical drawing"
                  className="max-h-full max-w-full object-contain"
                />
              </figure>
            );
          })}
        </div>
      </div>

      <ImageLightbox
        images={imagePaths}
        initialIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}

