"use client";

import { useEffect, useState } from "react";
import { HeroSlideshow } from "./hero-slideshow";
import { HeroSplit } from "./hero-split";

interface HeroConfig {
  template_type: "slider" | "split";
  split_title?: string;
  split_subtitle?: string;
  split_description?: string;
  split_media_url?: string;
  split_media_type?: "image" | "video";
  split_layout?: "media-right" | "media-left";
}

export function Hero() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/api/hero-config");
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (error) {
        console.error("Error fetching hero config:", error);
        // Default to slider if fetch fails
        setConfig({ template_type: "slider" });
      } finally {
        setIsLoading(false);
      }
    }

    fetchConfig();
  }, []);

  if (isLoading) {
    return <HeroSlideshow />;
  }

  if (config?.template_type === "split") {
    return (
      <HeroSplit
        title={config.split_title}
        subtitle={config.split_subtitle}
        description={config.split_description}
        mediaUrl={config.split_media_url}
        mediaType={config.split_media_type}
        layout={config.split_layout}
      />
    );
  }

  return <HeroSlideshow />;
}

