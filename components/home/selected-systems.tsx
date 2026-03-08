"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase-client";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import { Lock } from "lucide-react";

export function SelectedStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadProjects() {
      if (!supabaseBrowserClient) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabaseBrowserClient
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error loading projects:", error);
        setLoading(false);
        return;
      }

      const mappedProjects: Project[] = data.map((row: any) => ({
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        status: row.status,
        featured: row.featured,
        private: row.private || false,
        order: row.order || 0,
        slug: row.slug,
        keyFacts: {
          title: row.title,
          location: row.location ?? undefined,
          year: row.year ?? undefined,
          size: row.size ?? undefined,
          materials: row.materials ?? undefined,
          client: row.client ?? undefined,
        },
        notes: row.notes ?? undefined,
        heroImagePath: row.hero_image_path ?? undefined,
        introText: row.intro_text ?? undefined,
        story: row.story ?? undefined,
        sections: row.sections ?? undefined,
        aiRawResponse: row.ai_raw_response ?? undefined,
      }));

      setProjects(mappedProjects);
      setLoading(false);
    }

    loadProjects();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Selected Stories
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl text-balance">
              Recent Work
            </h2>
          </div>
          <Link
            href="/systems"
            className="hidden text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground md:inline-block"
          >
            {"View All →"}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="group"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
                }}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand animate-pulse" />
                <div className="mt-5">
                  <div className="h-6 w-3/4 bg-sand animate-pulse rounded" />
                  <div className="mt-2 h-4 w-full bg-sand animate-pulse rounded" />
                  <div className="mt-1 h-4 w-2/3 bg-sand animate-pulse rounded" />
                </div>
              </div>
            ))
          ) : projects.length > 0 ? (
            projects.map((project, index) => {
              const isPrivate = project.private;
              
              if (isPrivate) {
                // Private story - no navigation, show NDA icon
                return (
                  <div
                    key={project.id}
                    className="group opacity-75"
                    style={{
                      opacity: isVisible ? 0.75 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(20px)",
                      transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
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
                        <h3 className="text-base font-medium text-foreground">
                          {project.keyFacts.title}
                        </h3>
                        <span className="text-[10px] px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                          NDA Protected
                        </span>
                      </div>
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
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
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
                    <h3 className="text-base font-medium text-foreground">
                      {project.keyFacts.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {project.introText}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects available yet.</p>
            </div>
          )}
        </div>

        <Link
          href="/systems"
          className="mt-10 inline-block text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground md:hidden"
        >
          {"View All →"}
        </Link>
      </div>
    </section>
  );
}
