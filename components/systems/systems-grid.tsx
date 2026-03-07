"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface SystemsGridProps {
  projects: Project[];
}

export function SystemsGrid({ projects }: SystemsGridProps) {
  return (
    <div className="mt-16">
      {/* Projects grid */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
        {projects.map((project, index) => (
          <Link
            href={`/systems/${project.slug}`}
            key={project.id}
            className="group"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
              <Image
                src={project.heroImagePath ? getProjectMediaUrl(project.heroImagePath) : "/placeholder.jpg"}
                alt={project.keyFacts.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {project.keyFacts.materials?.split(',')[0].trim() || "Project"}
              </p>
              <h3 className="mt-2 text-lg font-medium text-foreground">
                {project.keyFacts.title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {project.introText}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
