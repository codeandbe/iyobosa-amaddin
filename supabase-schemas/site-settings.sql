-- =============================================================================
-- Site Settings Table
-- Stores CMS-controlled configuration values for the portfolio
-- =============================================================================

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent runs)
DROP POLICY IF EXISTS "settings_auth_read" ON site_settings;
DROP POLICY IF EXISTS "settings_auth_update" ON site_settings;
DROP POLICY IF EXISTS "settings_auth_insert" ON site_settings;

-- Policy: Authenticated users can read settings
CREATE POLICY "settings_auth_read" ON site_settings
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can update settings
CREATE POLICY "settings_auth_update" ON site_settings
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert settings
CREATE POLICY "settings_auth_insert" ON site_settings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (for idempotent runs)
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed default settings
INSERT INTO site_settings (key, value, description) VALUES
    ('featured_projects_home_limit', '3', 'Number of featured projects to show on homepage preview'),
    ('blog_posts_home_limit', '3', 'Number of blog posts to show on homepage preview')
ON CONFLICT (key) DO NOTHING;

-- Verify seed
SELECT key, value, description FROM site_settings;
