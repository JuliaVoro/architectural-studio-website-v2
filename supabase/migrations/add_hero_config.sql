-- Add hero configuration table for template selection and single hero content
create table if not exists public.hero_config (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  
  -- Template selection: 'slider' or 'single'
  template text not null default 'slider' check (template in ('slider', 'single')),
  
  -- Single hero fields (only used when template is 'single')
  title text,
  subtitle text,
  description text,
  cta_text text default 'View Projects',
  cta_link text default '#projects',
  background_type text check (background_type in ('image', 'video')) default 'image',
  background_src text,
  background_poster text, -- for videos
  overlay_opacity integer default 40 check (overlay_opacity >= 0 and overlay_opacity <= 100),
  label text -- optional category/label above title
);

-- Insert default configuration
insert into public.hero_config (template, title, subtitle, description, cta_text, cta_link, background_type, background_src, overlay_opacity, label)
values (
  'slider',
  null,
  null,
  null,
  'View Projects',
  '#projects',
  'image',
  null,
  40,
  null
) on conflict (id) do nothing;

-- Create index for efficient lookups
create index if not exists hero_config_template_idx on public.hero_config (template);
