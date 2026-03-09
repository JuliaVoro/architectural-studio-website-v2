"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VideoPreviewCardProps {
  imageSrc: string;
  videoSrc?: string;
  title: string;
  className?: string;
}

export function VideoPreviewCard({
  imageSrc,
  videoSrc,
  title,
  className,
}: VideoPreviewCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && videoSrc) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Silently fail if video can't autoplay
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={cn("relative aspect-[16/10] w-full overflow-hidden bg-sand", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image - always visible, background layer */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isHovering && videoSrc ? "opacity-0" : "opacity-100"
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Video - overlay on hover */}
      {videoSrc && (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-0"
          )}
          muted
          playsInline
          loop={false}
          preload="none"
          onError={() => {
            // Video failed to load, keep showing image
            setIsHovering(false);
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
