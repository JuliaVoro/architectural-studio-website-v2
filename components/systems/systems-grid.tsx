"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface StoriesGridProps {
  projects: Project[];
}

export function StoriesGrid({ projects }: StoriesGridProps) {
  return (
    <div className="mt-16">
      {/* Projects grid */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
        {projects.map((project, index) => {
          const isPrivate = project.private;
          
          if (isPrivate) {
            // Private story - no navigation, show NDA icon
            return (
              <div
                key={project.id}
                className="group opacity-75"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
                  <Image
                    src={project.heroImagePath ? getProjectMediaUrl(project.heroImagePath) : "/placeholder.jpg"}
                    alt={project.keyFacts.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-black/70 p-2">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      {project.keyFacts.materials?.split(',')[0].trim() || "Project"}
                    </p>
                    <span className="text-[10px] px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                      NDA Protected
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-foreground">
                    {project.keyFacts.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {project.introText}
                  </p>
                </div>
              </div>
            );
          }
          
          // Public story - normal navigation
          return (
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
          );
        })}
      </div>
    </div>
  );
}
