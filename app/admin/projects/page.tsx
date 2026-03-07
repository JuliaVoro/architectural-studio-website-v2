"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@/lib/supabase-client";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import Image from "next/image";
import { Button } from "@/components/ui/button";

async function getProjects(): Promise<Project[]> {
  if (!supabaseBrowserClient) {
    return [];
  }

  const { data, error } = await supabaseBrowserClient
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error loading projects:", error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    featured: row.featured,
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
}

async function updateProjectStatus(id: string, status: string): Promise<boolean> {
  if (!supabaseBrowserClient) return false;
  
  const { error } = await supabaseBrowserClient
    .from("projects")
    .update({ status })
    .eq("id", id);
  
  return !error;
}

async function deleteProject(id: string): Promise<boolean> {
  if (!supabaseBrowserClient) return false;
  
  const { error } = await supabaseBrowserClient
    .from("projects")
    .delete()
    .eq("id", id);
  
  return !error;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const projectsData = await getProjects();
      setProjects(projectsData);
      setLoading(false);
    }
    loadProjects();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    const success = await updateProjectStatus(id, status);
    if (success) {
      // Update the local state
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, status } : p
      ));
    }
    return success;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this system? This action cannot be undone.')) {
      const deleted = await deleteProject(id);
      if (deleted) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            Systems
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Overview of AI-generated architectural systems. Click through to preview the
            public systems page.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          New System
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="relative aspect-[16/10] w-full overflow-hidden bg-sand rounded-lg border border-neutral-200 animate-pulse"
            />
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-neutral-200 rounded-lg">
            <p className="text-sm text-neutral-500">
              No systems yet. Start by creating a new one.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="group relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand rounded-lg border border-neutral-200">
                <Image
                  src={project.heroImagePath ? getProjectMediaUrl(project.heroImagePath) : "/placeholder.jpg"}
                  alt={project.keyFacts.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className="mt-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-medium text-neutral-900">
                      {project.keyFacts.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {project.keyFacts.location ?? "—"} • {project.keyFacts.year ?? "—"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${
                    project.status === 'published' 
                        ? 'border-green-300 text-green-700 bg-green-50' 
                        : project.status === 'draft'
                        ? 'border-yellow-300 text-yellow-700 bg-yellow-50'
                        : 'border-red-300 text-red-700 bg-red-50'
                    }`}>
                      {project.status}
                    </span>
                    
                    <Link
                      href={`/systems/${project.slug}`}
                      className="text-xs text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
                    >
                      View
                    </Link>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {project.status === 'published' ? (
                    <Button
                      onClick={() => handleStatusUpdate(project.id, 'draft')}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Hide
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStatusUpdate(project.id, 'published')}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Publish
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

