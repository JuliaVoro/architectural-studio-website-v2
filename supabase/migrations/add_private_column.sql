-- Add private column to projects table for NDA protection
ALTER TABLE projects ADD COLUMN private BOOLEAN DEFAULT FALSE;

-- Add index for better performance on private/public queries
CREATE INDEX idx_projects_private ON projects(private);
