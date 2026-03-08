-- Add order column to projects table for manual sorting
ALTER TABLE projects ADD COLUMN order INTEGER DEFAULT 0;

-- Update existing projects to have order based on creation date (newest first)
UPDATE projects SET "order" = (
  SELECT COUNT(*) FROM projects p2 
  WHERE p2.created_at >= projects.created_at 
  AND p2.status = 'published'
);

-- Add index for better performance on order queries
CREATE INDEX idx_projects_order ON projects("order");
