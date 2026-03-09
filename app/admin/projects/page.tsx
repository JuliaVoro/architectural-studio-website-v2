"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@/lib/supabase-client";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl } from "@/lib/projects";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

async function getProjects(sortBy: string = 'order', sortOrder: 'asc' | 'desc' = 'asc'): Promise<Project[]> {
  if (!supabaseBrowserClient) {
    return [];
  }

  let query = supabaseBrowserClient
    .from("projects")
    .select("*");

  // Apply sorting
  if (sortBy === 'featured') {
    query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
  } else if (sortBy === 'title') {
    query = query.order('title', { ascending: sortOrder === 'asc' });
  } else if (sortBy === 'status') {
    query = query.order('status', { ascending: sortOrder === 'asc' });
  } else if (sortBy === 'private') {
    query = query.order('private', { ascending: sortOrder === 'asc' });
  } else if (sortBy === 'order') {
    // Try to sort by order, fallback to created_at if column doesn't exist
    query = query.order('order', { ascending: true }).order('created_at', { ascending: false });
  } else {
    // Default: created_at
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  }

  const { data, error } = await query;

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
    heroVideoPath: row.hero_video_path ?? undefined,
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
  const [sortBy, setSortBy] = useState('created_at'); // Temporarily default to created_at
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const projectsData = await getProjects(sortBy, sortOrder);
      setProjects(projectsData);
      setLoading(false);
    }
    loadProjects();
  }, [sortBy, sortOrder]);

  const handleStatusUpdate = async (id: string, status: string) => {
    const success = await updateProjectStatus(id, status);
    if (success) {
      // Update the local state
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, status: status as any } : p
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

  const handleDragStart = (project: Project) => {
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetProject: Project) => {
    e.preventDefault();
    
    if (!draggedProject || draggedProject.id === targetProject.id) return;

    // Reorder projects in state
    const newProjects = [...projects];
    const draggedIndex = newProjects.findIndex(p => p.id === draggedProject.id);
    const targetIndex = newProjects.findIndex(p => p.id === targetProject.id);
    
    // Remove dragged project and insert at target position
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, draggedProject);
    
    // Update order values based on new positions
    const updatedProjects = newProjects.map((project, index) => ({
      ...project,
      order: index
    }));

    setProjects(updatedProjects);
    
    // Update database
    await updateProjectOrders(updatedProjects);
    setDraggedProject(null);
  };

  const updateProjectOrders = async (projects: Project[]) => {
    const updates = projects.map(project => 
      supabaseBrowserClient
        .from("projects")
        .update({ order: project.order })
        .eq("id", project.id)
    );
    
    await Promise.all(updates);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            Stories
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

      {/* Sorting Controls */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-neutral-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        >
          <option value="order">Manual Order</option>
          <option value="featured">Featured</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
          <option value="private">Privacy</option>
          <option value="created_at">Date Created</option>
        </select>
        
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="px-3 py-1 border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        
        <span className="text-neutral-500">
          {projects.length} {projects.length === 1 ? 'story' : 'stories'}
        </span>
      </div>

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
          projects.map((project, index) => (
            <div 
              key={project.id} 
              className="group relative"
              draggable={sortBy === 'order'}
              onDragStart={() => handleDragStart(project)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, project)}
            >
              {sortBy === 'order' && (
                <div className="absolute top-2 left-2 z-10 bg-white/90 rounded p-1 cursor-move">
                  <GripVertical className="w-4 h-4 text-neutral-600" />
                </div>
              )}
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
                    
                    {project.featured && (
                      <span className="rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.18em] border-purple-300 text-purple-700 bg-purple-50">
                        Featured
                      </span>
                    )}
                    
                    {project.private && (
                      <span className="rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.18em] border-gray-300 text-gray-700 bg-gray-50">
                        Private
                      </span>
                    )}
                  </div>
                    
                    <div className="flex items-center gap-2">
                    <Link
                      href={`/systems/${project.slug}`}
                      className="text-xs text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/projects/${project.slug}/edit`}
                      className="text-xs text-blue-600 underline underline-offset-4 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                  </div>
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

