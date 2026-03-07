-- Supabase schema for AI-powered architecture portfolio

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  status text not null default 'draft' check (status in ('draft', 'processing', 'published', 'failed')),
  featured boolean not null default false,
  slug text not null unique,
  title text not null,
  location text,
  year integer,
  size text,
  materials text,
  client text,
  notes text,
  hero_image_path text,
  intro_text text,
  story text,
  sections jsonb,
  key_facts jsonb,
  ai_raw_response jsonb
);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('image', 'video', 'drawing', 'other')),
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  width integer,
  height integer,
  order_index integer
);

create index if not exists project_assets_project_id_idx
  on public.project_assets (project_id);

create index if not exists projects_featured_created_at_idx
  on public.projects (featured desc, created_at desc);

-- Storage bucket for project media (create this bucket in the Supabase UI or via SQL)
-- select storage.create_bucket('project-media', jsonb_build_object(
--   'public', true
-- ));

