"use client";

import { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { defaultHeroSlides } from "@/lib/hero-slides";

type Slide = {
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  subtitle: string;
  location: string;
};

// Memoized video slide
const VideoSlide = memo(function VideoSlide({
  slide,
  isActive,
}: {
  slide: Slide;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Only reset on first activation
      if (!hasStartedRef.current) {
        video.currentTime = 0;
        hasStartedRef.current = true;
      }
      // Play the video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log("[v0] Video autoplay failed");
        });
      }
    } else {
      // Pause when inactive
      video.pause();
      hasStartedRef.current = false;
    }
  }, [isActive]);

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-800",
        isActive ? "z-20 opacity-100" : "z-0 opacity-0 pointer-events-none",
      )}
      style={{
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        loop={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(0.5px)" }}
        poster={slide.poster}
        aria-label={`${slide.title} - ${slide.subtitle}`}
      >
        <source src={slide.src} type="video/mp4" />
      </video>
    </div>
  );
});

// Memoized image slide
const ImageSlide = memo(function ImageSlide({
  slide,
  isActive,
  index,
}: {
  slide: Slide;
  isActive: boolean;
  index: number;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-800",
        isActive ? "z-20 opacity-100" : "z-0 opacity-0 pointer-events-none",
      )}
      style={{
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          animation: isActive ? "kenBurnsOptimized 5800ms ease-out forwards" : "none",
        }}
      >
        <Image
          src={slide.src}
          alt={`${slide.title} - ${slide.subtitle}`}
          fill
          className="object-cover"
          style={{ filter: "blur(0.5px)" }}
          priority={index === 0}
          sizes="100vw"
        />
      </div>
    </div>
  );
});

export function HeroSlideshow() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  const SLIDE_DURATION = 5000;

  // Load slides from API
  useEffect(() => {
    let isMounted = true;

    async function loadSlides() {
      try {
        const res = await fetch("/api/hero-slides", { cache: "no-store" });
        if (!res.ok) {
          const mapped: Slide[] = defaultHeroSlides.map((s) => ({
            type: s.type,
            src: s.src,
            poster: s.poster ?? undefined,
            title: s.title,
            subtitle: s.label,
            location: s.subtitle,
          }));
          if (isMounted) setSlides(mapped);
          return;
        }
        const data = (await res.json()) as {
          slides: Array<{
            id: string;
            type: "image" | "video";
            src: string;
            poster?: string | null;
            label: string;
            title: string;
            subtitle: string;
            hidden: boolean;
          }>;
        };
        const active = data.slides.filter((s) => !s.hidden);
        if (!active.length) {
          const mapped: Slide[] = defaultHeroSlides.map((s) => ({
            type: s.type,
            src: s.src,
            poster: s.poster ?? undefined,
            title: s.title,
            subtitle: s.label,
            location: s.subtitle,
          }));
          if (isMounted) setSlides(mapped);
          return;
        }
        const mapped: Slide[] = active.map((s) => ({
          type: s.type,
          src: s.src,
          poster: s.poster ?? undefined,
          title: s.title,
          subtitle: s.label,
          location: s.subtitle,
        }));
        if (isMounted) {
          setSlides(mapped);
          setCurrent(0);
          hasInitialized.current = false;
        }
      } catch {
        const mapped: Slide[] = defaultHeroSlides.map((s) => ({
          type: s.type,
          src: s.src,
          poster: s.poster ?? undefined,
          title: s.title,
          subtitle: s.label,
          location: s.subtitle,
        }));
        if (isMounted) setSlides(mapped);
      }
    }

    loadSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  // Simple auto-advance without re-renders during animation
  useEffect(() => {
    if (isHovering || slides.length === 0) {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
      return;
    }

    autoAdvanceRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, [current, isHovering, slides.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  const handleSlideClick = (index: number) => {
    setCurrent(index);
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      suppressHydrationWarning
    >
      {/* Video slides */}
      {slides.map((slide, index) => {
        if (slide.type !== "video") return null;
        return (
          <VideoSlide key={`video-${index}`} slide={slide} isActive={index === current} />
        );
      })}

      {/* Image slides */}
      {slides.map((slide, index) => {
        if (slide.type !== "image") return null;
        return (
          <ImageSlide
            key={`image-${index}`}
            slide={slide}
            isActive={index === current}
            index={index}
          />
        );
      })}

      {/* Overlay */}
      <div className="absolute inset-0 z-25 bg-[#0a0f14]/60" suppressHydrationWarning />

      {/* Gradient for text */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-[50%] bg-gradient-to-t from-[#0a0f14]/80 via-[#0a0f14]/40 to-transparent" suppressHydrationWarning />

      {/* Content overlay */}
      <div className="absolute inset-0 z-40 flex flex-col justify-end" suppressHydrationWarning>
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-12 lg:px-12 lg:pb-16">
          {/* Project info */}
          <div className="mb-8 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/60"
                key={`subtitle-${current}`}
                style={{
                  animation: "fadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
              >
                {slides[current]?.subtitle}
              </p>
              <h2
                className="font-serif text-4xl leading-[1.1] tracking-tight text-cream md:text-6xl lg:text-7xl"
                key={`title-${current}`}
                style={{
                  animation: "fadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms forwards",
                  opacity: 0,
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                }}
              >
                {slides[current]?.title}
              </h2>
              <p
                className="mt-3 text-sm text-cream/50"
                key={`location-${current}`}
                style={{
                  animation: "fadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms forwards",
                  opacity: 0,
                }}
              >
                {slides[current]?.location}
              </p>
            </div>

            <div
              key={`cta-${current}`}
              style={{
                animation: "fadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards",
                opacity: 0,
              }}
            >
              <button
                onClick={() => {
                  const projectsSection = document.getElementById("projects");
                  projectsSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/80 transition-colors duration-300 hover:text-cream"
              >
                {"View Projects"}
                <span className="inline-block h-px w-8 bg-cream/40 transition-all duration-300 group-hover:w-12 group-hover:bg-cream" />
              </button>
            </div>
          </div>

          {/* Counter */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tabular-nums tracking-[0.1em] text-cream/50">
              {String(current + 1).padStart(2, "0")}
              {" / "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-cream/30">
              {"Scroll to explore"}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 lg:bottom-8">
        <div className="flex h-10 w-[1px] flex-col items-center">
          <div
            className="w-[1px] bg-cream/60"
            style={{ animation: "scrollPulseOptimized 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
