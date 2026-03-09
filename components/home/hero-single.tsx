"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HeroConfig } from "@/app/api/hero-config/route";

interface HeroSingleProps {
  config: HeroConfig;
}

export function HeroSingle({ config }: HeroSingleProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video if background type is video
    if (config.backgroundType === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, that's fine
      });
    }
  }, [config.backgroundType]);

  // Fallback background if none provided
  const fallbackBackground = "/images/building-final.jpg";
  const backgroundSrc = config.backgroundSrc || fallbackBackground;
  const overlayOpacity = config.overlayOpacity || 40;

  const handleCTAClick = () => {
    if (config.ctaLink?.startsWith("#")) {
      const element = document.querySelector(config.ctaLink);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {config.backgroundType === "video" ? (
          <video
            ref={videoRef}
            poster={config.backgroundPoster || undefined}
            muted
            playsInline
            autoPlay
            loop
            className="absolute inset-0 h-full w-full object-cover"
            onLoadedData={() => setIsLoaded(true)}
          >
            <source src={backgroundSrc} type="video/mp4" />
          </video>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={backgroundSrc}
              alt="Hero background"
              fill
              className={cn(
                "object-cover transition-opacity duration-1000",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              priority
              sizes="100vw"
              onLoadingComplete={() => setIsLoaded(true)}
            />
          </div>
        )}
      </div>

      {/* Overlay for text readability */}
      <div 
        className="absolute inset-0 z-20 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Bottom gradient for better text readability */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-[60%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-40 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-12 lg:px-12 lg:pb-16">
          <div className="mb-8 max-w-3xl">
            {/* Optional Label */}
            {config.label && (
              <p
                className={cn(
                  "mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/60 transition-all duration-1000",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {config.label}
              </p>
            )}

            {/* Title */}
            {config.title && (
              <h1
                className={cn(
                  "font-serif text-4xl leading-[1.1] tracking-tight text-cream md:text-6xl lg:text-7xl mb-4",
                  "transition-all duration-1000 delay-100",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                }}
              >
                {config.title}
              </h1>
            )}

            {/* Subtitle */}
            {config.subtitle && (
              <h2
                className={cn(
                  "font-serif text-2xl leading-[1.2] tracking-tight text-cream/90 md:text-3xl lg:text-4xl mb-4",
                  "transition-all duration-1000 delay-200",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{
                  textShadow: "0 1px 10px rgba(0,0,0,0.3)",
                }}
              >
                {config.subtitle}
              </h2>
            )}

            {/* Description */}
            {config.description && (
              <p
                className={cn(
                  "text-base text-cream/70 md:text-lg mb-8 max-w-2xl",
                  "transition-all duration-1000 delay-300",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {config.description}
              </p>
            )}

            {/* CTA Button */}
            {config.ctaText && (
              <div
                className={cn(
                  "transition-all duration-1000 delay-400",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {config.ctaLink?.startsWith("#") ? (
                  <button
                    onClick={handleCTAClick}
                    className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/80 transition-colors duration-300 hover:text-cream"
                  >
                    {config.ctaText}
                    <span className="inline-block h-px w-8 bg-cream/40 transition-all duration-300 group-hover:w-12 group-hover:bg-cream" />
                  </button>
                ) : (
                  <Link
                    href={config.ctaLink || "#"}
                    className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/80 transition-colors duration-300 hover:text-cream"
                  >
                    {config.ctaText}
                    <span className="inline-block h-px w-8 bg-cream/40 transition-all duration-300 group-hover:w-12 group-hover:bg-cream" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="mt-8 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.2em] text-cream/30">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 lg:bottom-8">
        <div className="flex h-10 w-[1px] flex-col items-center">
          <div
            className="w-[1px] bg-cream/60"
            style={{ animation: "scrollPulse 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
