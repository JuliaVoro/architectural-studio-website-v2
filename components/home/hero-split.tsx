"use client";

import Image from "next/image";
import { useState } from "react";

interface HeroSplitProps {
  title?: string;
  subtitle?: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  layout?: "media-right" | "media-left";
}

export function HeroSplit({
  title = "Welcome to Our Studio",
  subtitle = "Architecture & Design",
  description = "Crafting spaces that inspire and transform everyday experiences.",
  mediaUrl = "/placeholder.jpg",
  mediaType = "image",
  layout = "media-right",
}: HeroSplitProps) {
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  const contentClasses = layout === "media-right" ? "order-1" : "order-2";
  const mediaClasses = layout === "media-right" ? "order-2" : "order-1";

  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Main container with flex layout */}
        <div className="grid min-h-screen grid-cols-1 gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-32">
          {/* Content side */}
          <div
            className={`${contentClasses} flex flex-col justify-center`}
          >
            <div className="space-y-6 lg:space-y-8">
              {subtitle && (
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  {subtitle}
                </p>
              )}

              {title && (
                <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                  {title}
                </h1>
              )}

              {description && (
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg lg:max-w-md">
                  {description}
                </p>
              )}

              {/* Optional CTA button */}
              <div className="pt-4">
                <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground border border-foreground/20 rounded-sm hover:border-foreground/40 transition-colors duration-300">
                  Explore Our Work
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Media side */}
          <div className={`${mediaClasses} relative w-full`}>
            {mediaType === "video" ? (
              <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-muted">
                <video
                  src={mediaUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={() => setIsMediaLoading(false)}
                />
                {isMediaLoading && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
              </div>
            ) : (
              <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-muted">
                <Image
                  src={mediaUrl}
                  alt={title || "Hero"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  onLoadingComplete={() => setIsMediaLoading(false)}
                />
                {isMediaLoading && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
