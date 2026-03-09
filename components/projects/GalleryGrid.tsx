"use client";

import { useState } from "react";
import Image from "next/image";
import { getProjectMediaUrl } from "@/lib/projects";
import { ImageLightbox } from "./ImageLightbox";

interface GalleryGridProps {
  imagePaths: string[];
}

export function GalleryGrid({ imagePaths }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!imagePaths.length) return null;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {imagePaths.map((path, index) => {
            const src = getProjectMediaUrl(path);
            return (
              <div
                key={path}
                className="relative h-[160px] overflow-hidden rounded-lg bg-neutral-200 md:h-[220px] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={src}
                  alt="Project gallery image"
                  fill
                  sizes="(min-width: 1024px) 320px, 33vw"
                  className="object-cover"
                  loading="eager"
                />
              </div>
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

