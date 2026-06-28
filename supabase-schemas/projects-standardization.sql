-- =============================================================================
-- Project Cards Standardization Migration
-- Adds release information fields and renames my_role to role for consistency
-- Run this in Supabase SQL Editor
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Add new release-related columns
-- ---------------------------------------------------------------------------
ALTER TABLE projects ADD COLUMN IF NOT EXISTS release_tag VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS release_title VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS release_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS release_notes TEXT;

-- ---------------------------------------------------------------------------
-- Rename my_role to role for consistency
-- First, add the new column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT;

-- Copy data from my_role to role if role is null and my_role has data
UPDATE projects SET role = my_role WHERE role IS NULL AND my_role IS NOT NULL;

-- Note: We keep my_role column for backward compatibility, can drop later if desired
-- ALTER TABLE projects DROP COLUMN IF EXISTS my_role;

-- ---------------------------------------------------------------------------
-- Add indexes for new fields
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_release_date ON projects(release_date);
CREATE INDEX IF NOT EXISTS idx_projects_release_tag ON projects(release_tag);

-- ---------------------------------------------------------------------------
-- Update existing projects with default release info if needed
-- ---------------------------------------------------------------------------
UPDATE projects 
SET 
  release_tag = 'v1.0.0',
  release_title = title,
  release_date = created_at::date,
  release_notes = 'Initial release'
WHERE release_tag IS NULL AND published = true;
