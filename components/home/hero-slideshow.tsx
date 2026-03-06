"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Slide = {
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  subtitle: string;
  location: string;
};

const slides: Slide[] = [
  {
    type: "video",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stairs-iDqt60Un21rkelbbMx9n414hrC0xn4.mp4",
    poster: "/images/poster-bude.jpg",
    title: "Bude Plus",
    subtitle: "Retail",
    location: "Tbilisi, Georgia",
  },
  {
    type: "video",
    src: "https://makgbcplbjjmrvrn.public.blob.vercel-storage.com/header-videos/office-termoindustria-v2.mp4",
    poster: "/images/poster-office.jpg",
    title: "Office Termoindustria",
    subtitle: "Office",
    location: "Tbilisi, Georgia",
  },
  {
    type: "image",
    src: "/images/slide-lobby.jpg",
    title: "Gran Palazzo",
    subtitle: "Hospitality",
    location: "Milan, Italy",
  },
  {
    type: "image",
    src: "/images/slide-retail.jpg",
    title: "Forma Showroom",
    subtitle: "Retail",
    location: "Berlin, Germany",
  },
  {
    type: "image",
    src: "/images/slide-workspace.jpg",
    title: "Atelier Collectif",
    subtitle: "Workspace",
    location: "Amsterdam, Netherlands",
  },
  {
    type: "image",
    src: "/images/slide-facade.jpg",
    title: "Casa Luce",
    subtitle: "Residential",
    location: "Lisbon, Portugal",
  },
  {
    type: "image",
    src: "/images/slide-corridor.jpg",
    title: "Passage Noir",
    subtitle: "Cultural",
    location: "Paris, France",
  },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [videoReady, setVideoReady] = useState<Set<number>>(new Set());
  const [videoDurations, setVideoDurations] = useState<Map<number, number>>(new Map());
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const hasInitialized = useRef(false);

  const SLIDE_DURATION = 3000; // 3 seconds for all slides
  const TRANSITION_MS = 1000;

  // Preload next video when current slide starts
  useEffect(() => {
    const nextIndex = (current + 1) % slides.length;
    const nextSlide = slides[nextIndex];
    
    if (nextSlide.type === "video") {
      const video = videoRefs.current.get(nextIndex);
      if (video && video.preload === "none") {
        video.preload = "auto";
        video.src = nextSlide.src;
        video.load();
      }
    }
  }, [current]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      const prevIndex = current;
      setPrevious(prevIndex);
      setCurrent(index);
      setProgress(0);

      // Start playing the new video immediately
      const newVideo = videoRefs.current.get(index);
      if (newVideo) {
        newVideo.currentTime = 0;
        newVideo.play().catch(() => {});
      }

      // After transition completes, pause the old video and clean up
      setTimeout(() => {
        const oldVideo = videoRefs.current.get(prevIndex);
        if (oldVideo) {
          oldVideo.pause();
          oldVideo.currentTime = 0;
        }
        setIsTransitioning(false);
        setPrevious(-1);
      }, TRANSITION_MS);
    },
    [current, isTransitioning]
  );

  const nextSlide = useCallback(() => {
    const next = (current + 1) % slides.length;
    goToSlide(next);
  }, [current, goToSlide]);

  // Auto-advance timer
  const nextSlideRef = useRef(nextSlide);
  nextSlideRef.current = nextSlide;

  useEffect(() => {
    if (isTransitioning || isHovering) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlideRef.current();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isTransitioning, isHovering]);

  

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video slides - always mounted for preloading */}
      {slides.map((slide, index) => {
        if (slide.type !== "video") return null;
        const isActive = index === current;
        const isPrev = index === previous;
        
        return (
          <div
            key={`video-${index}`}
            className={cn(
              "absolute inset-0 transition-opacity",
              isActive
                ? "z-20 opacity-100"
                : isPrev
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0"
            )}
            style={{
              transitionDuration: `${TRANSITION_MS}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(index, el);
              }}
              poster={slide.poster}
              muted
              playsInline
              autoPlay={index === 0}
              preload={index === 0 ? "auto" : "none"}
              onCanPlay={() => {
                setVideoReady((prev) => new Set(prev).add(index));
                if (isActive) setIsBuffering(false);
              }}
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                if (video.duration && isFinite(video.duration)) {
                  setVideoDurations((prev) => new Map(prev).set(index, video.duration));
                }
              }}
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={`${slide.title} - ${slide.subtitle} project in ${slide.location}`}
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          </div>
        );
      })}

      {/* Image slides - render only when needed */}
      {slides.map((slide, index) => {
        if (slide.type !== "image") return null;
        const isActive = index === current;
        const isPrev = index === previous;
        const isVisible = isActive || isPrev;

        if (!isVisible) return null;

        return (
          <div
            key={`image-${index}`}
            className={cn(
              "absolute inset-0 transition-opacity",
              isActive
                ? "z-20 opacity-100"
                : isPrev
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0"
            )}
            style={{
              transitionDuration: `${TRANSITION_MS}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                animation: isActive
                  ? `kenBurns ${SLIDE_DURATION + TRANSITION_MS}ms ease-out forwards`
                  : "none",
              }}
            >
              <Image
                src={slide.src}
                alt={`${slide.title} - ${slide.subtitle} project in ${slide.location}`}
                fill
                className="object-cover"
                priority={index < 3}
                sizes="100vw"
              />
            </div>
          </div>
        );
      })}

      

      {/* Full overlay - deep blue-black tint for cinematic feel and masking video quality */}
      <div className="absolute inset-0 z-25 bg-[#0a0f14]/40" />

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-[50%] bg-gradient-to-t from-[#0a0f14]/80 via-[#0a0f14]/40 to-transparent" />

      {/* Bottom content overlay */}
      <div className="absolute inset-0 z-40 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-12 lg:px-12 lg:pb-16">
          {/* Project info */}
          <div className="mb-8 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
            {/* Left: project title */}
            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/60 transition-all duration-700"
                key={`subtitle-${current}`}
                style={{
                  animation: "fadeSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
              >
                {slides[current].subtitle}
              </p>
              <h2
                className="font-serif text-4xl leading-[1.1] tracking-tight text-cream md:text-6xl lg:text-7xl"
                key={`title-${current}`}
                style={{
                  animation: "fadeSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms forwards",
                  opacity: 0,
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                }}
              >
                {slides[current].title}
              </h2>
              <p
                className="mt-3 text-sm text-cream/50"
                key={`location-${current}`}
                style={{
                  animation: "fadeSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms forwards",
                  opacity: 0,
                }}
              >
                {slides[current].location}
              </p>
            </div>

            {/* Right: CTA */}
            <div
              key={`cta-${current}`}
              style={{
                animation: "fadeSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards",
                opacity: 0,
              }}
            >
              <Link
                href="/systems"
                className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/80 transition-colors duration-300 hover:text-cream"
              >
                {"View Project"}
                <span className="inline-block h-px w-8 bg-cream/40 transition-all duration-300 group-hover:w-12 group-hover:bg-cream" />
              </Link>
            </div>
          </div>

          {/* Slide indicators with progress */}
          <div className="flex items-center gap-1">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group relative flex h-8 flex-1 items-end"
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              >
                {/* Track background */}
                <div className="h-[2px] w-full bg-cream/20 transition-all duration-300 group-hover:bg-cream/30">
                  {/* Progress fill */}
                  <div
                    className="h-full bg-cream transition-all"
                    style={{
                      width:
                        index === current
                          ? `${progress}%`
                          : index < current ||
                              (previous !== -1 && index <= previous && current < previous)
                            ? "100%"
                            : "0%",
                      transitionDuration: index === current ? "50ms" : "400ms",
                      transitionTimingFunction: "linear",
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Slide counter */}
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
            style={{ animation: "scrollPulse 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
