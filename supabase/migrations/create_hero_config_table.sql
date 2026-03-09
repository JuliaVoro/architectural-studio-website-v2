-- Create hero_config table for homepage hero configuration management
CREATE TABLE IF NOT EXISTS hero_config (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  template TEXT NOT NULL CHECK (template IN ('slider', 'single')),
  title TEXT,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT,
  cta_link TEXT,
  background_type TEXT CHECK (background_type IN ('image', 'video')),
  background_src TEXT,
  background_poster TEXT,
  overlay_opacity INTEGER CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100),
  label TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_hero_config_template ON hero_config(template);

-- Insert default configuration
INSERT INTO hero_config (
  id, 
  template, 
  cta_text, 
  cta_link, 
  overlay_opacity
) VALUES (
  'default',
  'slider',
  'View Projects',
  '#projects',
  40
) ON CONFLICT (id) DO NOTHING;
