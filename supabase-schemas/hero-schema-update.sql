-- =============================================================================
-- Hero Section Schema Update
-- Adds description field and tertiary CTA fields for better hero customization
-- Run this in Supabase SQL Editor
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Add missing columns to hero_sections table
-- ---------------------------------------------------------------------------
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS cta_tertiary_label VARCHAR(100);
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS cta_tertiary_url VARCHAR(500);

-- ---------------------------------------------------------------------------
-- Update existing hero record with default values if fields are null
-- ---------------------------------------------------------------------------
UPDATE hero_sections 
SET 
  description = 'I build CMS-powered websites, AI-integrated tools, automation workflows, and secure digital platforms that turn complex ideas into reliable products.',
  cta_tertiary_label = 'Contact Me',
  cta_tertiary_url = '/contact'
WHERE description IS NULL;
