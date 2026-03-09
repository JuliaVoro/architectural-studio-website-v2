-- Create hero template configuration table
create table if not exists public.hero_template_config (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  
  -- Template type: 'slider' or 'split'
  template_type text not null default 'slider' check (template_type in ('slider', 'split')),
  
  -- Settings for split template
  split_title text,
  split_subtitle text,
  split_description text,
  split_media_url text,
  split_media_type text default 'image' check (split_media_type in ('image', 'video')),
  split_layout text default 'media-right' check (split_layout in ('media-right', 'media-left')),
  
  -- Metadata
  is_active boolean not null default true
);

-- Ensure only one active config exists
create unique index if not exists hero_config_active_idx 
on public.hero_template_config (is_active) 
where is_active = true;

-- Insert default config
insert into public.hero_template_config (template_type, is_active)
values ('slider', true)
on conflict do nothing;
