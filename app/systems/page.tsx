"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/projects";
import { StoriesGrid } from "@/components/systems/systems-grid";
import { StoriesPagination } from "@/components/systems/stories-pagination";

export default function StoriesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects?published=true");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Stories
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Featured Work
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-8">
            <p className="pt-2 text-base leading-relaxed text-muted-foreground lg:pt-16">
              Projects exploring the intersection of space, service, and everyday experience.
            </p>
          </div>
        </div>

        {/* Grid */}
        {!isLoading && <StoriesGrid projects={projects} />}
      </div>
    </section>
  );
}
