"use client";

import { useState, useEffect } from "react";
import { HeroSlideshow } from "./hero-slideshow";
import { HeroSingle } from "./hero-single";
import type { HeroConfig } from "@/app/api/hero-config/route";

export function Hero() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/hero-config", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { config: HeroConfig };
        setConfig(data.config);
      } catch {
        // If config fails to load, default to slider
        setConfig({
          id: "fallback",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          template: "slider",
        } as HeroConfig);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  if (loading) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-[#0a0f14]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-cream/60 text-sm">Loading...</div>
        </div>
      </section>
    );
  }

  if (!config) {
    // Fallback to slider if no config
    return <HeroSlideshow />;
  }

  // Render based on template selection
  if (config.template === "single") {
    return <HeroSingle config={config} />;
  }

  // Default to slider
  return <HeroSlideshow />;
}
