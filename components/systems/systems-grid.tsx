"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { systems, systemCategories } from "@/lib/systems-data";
import { cn } from "@/lib/utils";

export function SystemsGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? systems
      : systems.filter((s) => s.category === activeCategory);

  return (
    <div className="mt-16">
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 border-b border-border pb-6">
        {systemCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300",
              activeCategory === cat
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cases grid */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
        {filtered.map((system, index) => (
          <Link
            href={`/systems/${system.slug}`}
            key={system.slug}
            className="group"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
              <Image
                src={system.image}
                alt={system.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {system.category}
              </p>
              <h3 className="mt-2 text-lg font-medium text-foreground">
                {system.title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {system.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
