-- Add category column to projects table
ALTER TABLE projects ADD COLUMN category TEXT DEFAULT 'residential';

-- Add check constraint to ensure valid category values
ALTER TABLE projects ADD CONSTRAINT check_category
    CHECK (category IN ('residential', 'commercial', 'mixed'));

-- Update existing projects to have residential category (most common)
UPDATE projects SET category = 'residential' WHERE category IS NULL;
