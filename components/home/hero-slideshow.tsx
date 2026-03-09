"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
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

// Memoized video slide to prevent unnecessary re-renders
const VideoSlide = memo(function VideoSlide({
  slide,
  isActive,
  isPrev,
  transitionMs,
  videoRef,
}: {
  slide: Slide;
  isActive: boolean;
  isPrev: boolean;
  transitionMs: number;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity",
        isActive
          ? "z-20 opacity-100"
          : isPrev
            ? "z-10 opacity-100"
            : "z-0 opacity-0 pointer-events-none",
      )}
      style={{
        transitionDuration: `${transitionMs}ms`,
        transitionTimingFunction: "ease-in-out",
        willChange: isActive || isPrev ? "opacity" : "auto",
      }}
    >
      <video
        ref={videoRef}
        poster={slide.poster}
        muted
        playsInline
        preload="auto"
        loop={false}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={`${slide.title} - ${slide.subtitle} project in ${slide.location}`}
      >
        <source src={slide.src} type="video/mp4" />
      </video>
    </div>
  );
});

// Memoized image slide to prevent unnecessary re-renders
const ImageSlide = memo(function ImageSlide({
  slide,
  isActive,
  isPrev,
  transitionMs,
  index,
}: {
  slide: Slide;
  isActive: boolean;
  isPrev: boolean;
  transitionMs: number;
  index: number;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity",
        isActive
          ? "z-20 opacity-100"
          : isPrev
            ? "z-10 opacity-100"
            : "z-0 opacity-0 pointer-events-none",
      )}
      style={{
        transitionDuration: `${transitionMs}ms`,
        transitionTimingFunction: "ease-in-out",
        willChange: isActive || isPrev ? "opacity" : "auto",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          animation: isActive ? "kenBurnsOptimized 6000ms ease-out forwards" : "none",
        }}
      >
        <Image
          src={slide.src}
          alt={`${slide.title} - ${slide.subtitle} project in ${slide.location}`}
          fill
          className="object-cover"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          sizes="100vw"
        />
      </div>
    </div>
  );
});

// Memoized progress bar for better performance
const ProgressBar = memo(function ProgressBar({
  slides,
  current,
  progress,
  onSlideClick,
}: {
  slides: Slide[];
  current: number;
  progress: number;
  onSlideClick: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {slides.map((_, index) => (
        <button
          key={`progress-${index}`}
          onClick={() => onSlideClick(index)}
          className="group relative flex h-8 flex-1 items-end"
          aria-label={`Go to slide ${index + 1}`}
        >
          <div className="h-[2px] w-full bg-cream/20 transition-all duration-300 group-hover:bg-cream/30">
            <div
              className="h-full bg-cream"
              style={{
                width:
                  index === current
                    ? `${progress}%`
                    : index < current
                      ? "100%"
                      : "0%",
                transitionDuration: index === current ? "0ms" : "400ms",
                transitionTimingFunction: "linear",
              }}
            />
          </div>
        </button>
      ))}
    </div>
  );
});

export function HeroSlideshow() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const hasInitialized = useRef(false);
  const progressAnimationRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 5000;
  const TRANSITION_MS = 800;

  // Load dynamic slides from API
  useEffect(() => {
    let isMounted = true;

    async function loadSlides() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/hero-slides", { cache: "no-store" });
        if (!res.ok) {
          // Fallback to defaults if API fails
          const mapped: Slide[] = defaultHeroSlides.map((s) => ({
            type: s.type,
            src: s.src,
            poster: s.poster ?? undefined,
            title: s.title,
            subtitle: s.label,
            location: s.subtitle,
          }));
          if (isMounted) {
            setSlides(mapped);
          }
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
          // Fallback to defaults if no active slides
          const mapped: Slide[] = defaultHeroSlides.map((s) => ({
            type: s.type,
            src: s.src,
            poster: s.poster ?? undefined,
            title: s.title,
            subtitle: s.label,
            location: s.subtitle,
          }));
          if (isMounted) {
            setSlides(mapped);
          }
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
        // Fallback to defaults on error
        const mapped: Slide[] = defaultHeroSlides.map((s) => ({
          type: s.type,
          src: s.src,
          poster: s.poster ?? undefined,
          title: s.title,
          subtitle: s.label,
          location: s.subtitle,
        }));
        if (isMounted) {
          setSlides(mapped);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cleanup old video refs when slides change
  useEffect(() => {
    const entriesToDelete: number[] = [];
    videoRefs.current.forEach((video, key) => {
      if (key >= slides.length) {
        entriesToDelete.push(key);
        video.pause();
        video.currentTime = 0;
      }
    });
    entriesToDelete.forEach((key) => videoRefs.current.delete(key));

    if (current >= slides.length) {
      setCurrent(0);
      setPrevious(-1);
    }
  }, [slides.length]);

  // Pause non-active videos
  useEffect(() => {
    slides.forEach((_, index) => {
      const video = videoRefs.current.get(index);
      if (video && index !== current && index !== previous) {
        if (!video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [current, previous, slides.length]);

  // Navigate to slide
  const goToSlide = useCallback(
    (index: number) => {
      if (
        isTransitioning ||
        index === current ||
        index < 0 ||
        index >= slides.length
      ) {
        return;
      }

      setIsTransitioning(true);
      setPrevious(current);
      setCurrent(index);
      setProgress(0);

      // Play new video immediately
      const newVideo = videoRefs.current.get(index);
      if (newVideo) {
        newVideo.currentTime = 0;
        newVideo.play().catch(() => {});
      }

      // Complete transition
      const timer = setTimeout(() => {
        const oldVideo = videoRefs.current.get(current);
        if (oldVideo) {
          oldVideo.pause();
          oldVideo.currentTime = 0;
        }
        setIsTransitioning(false);
        setPrevious(-1);
      }, TRANSITION_MS);

      return () => clearTimeout(timer);
    },
    [current, isTransitioning, slides.length],
  );

  // Auto-advance slides with optimized progress tracking
  useEffect(() => {
    if (isTransitioning || isHovering || slides.length === 0) {
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
        progressAnimationRef.current = null;
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
        autoAdvanceTimeoutRef.current = null;
      }
      return;
    }

    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(percent);

      if (elapsed >= SLIDE_DURATION) {
        setCurrent((prev) => {
          const next = (prev + 1) % slides.length;
          goToSlide(next);
          return prev;
        });
      } else {
        progressAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    progressAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
        progressAnimationRef.current = null;
      }
    };
  }, [isTransitioning, isHovering, slides.length, goToSlide]);

  // Initialize first video
  useEffect(() => {
    if (!hasInitialized.current && slides.length > 0 && slides[0]?.type === "video") {
      hasInitialized.current = true;
      const firstVideo = videoRefs.current.get(0);
      if (firstVideo) {
        firstVideo.play().catch(() => {
          autoAdvanceTimeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
          }, 1000);
        });
      }
    }
  }, [slides.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      videoRefs.current.forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
      videoRefs.current.clear();
    };
  }, []);

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      suppressHydrationWarning
    >
      {slides.length === 0 ? (
        // Only show loading overlay if no slides at all
        <div className="absolute inset-0 z-50 bg-neutral-900" />
      ) : (
        <>
          {/* Video slides - render current, previous, and next to prevent gaps */}
          {slides.map((slide, index) => {
            if (slide.type !== "video") return null;
            const isActive = index === current;
            const isPrev = index === previous;
            const isNext = index === (current + 1) % slides.length;

            if (!isActive && !isPrev && !isNext) return null;

            return (
              <VideoSlide
                key={`video-${index}`}
                slide={slide}
                isActive={isActive}
                isPrev={isPrev}
                transitionMs={TRANSITION_MS}
                videoRef={(el) => {
                  if (el) videoRefs.current.set(index, el);
                }}
              />
            );
          })}

          {/* Image slides - render current, previous, and next to prevent gaps */}
          {slides.map((slide, index) => {
            if (slide.type !== "image") return null;
            const isActive = index === current;
            const isPrev = index === previous;
            const isNext = index === (current + 1) % slides.length;

            if (!isActive && !isPrev && !isNext) return null;

            return (
              <ImageSlide
                key={`image-${index}`}
                slide={slide}
                isActive={isActive}
                isPrev={isPrev}
                transitionMs={TRANSITION_MS}
                index={index}
              />
            );
          })}

          {/* Overlay */}
          <div className="absolute inset-0 z-25 bg-[#0a0f14]/40" suppressHydrationWarning />

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

              {/* Progress bars */}
              <ProgressBar
                slides={slides}
                current={current}
                progress={progress}
                onSlideClick={goToSlide}
              />

              {/* Counter */}
              <div className="mt-4 flex items-center justify-between">
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
        </>
      )}
    </section>
  );
}
