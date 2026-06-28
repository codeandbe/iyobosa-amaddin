-- =============================================================================
-- Hero Section Standard Content Update
-- Run this in Supabase SQL Editor after hero-cleanup-duplicates.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Update the active hero record (published=true, sort_order=0) with standard content
-- ---------------------------------------------------------------------------

UPDATE hero_sections
SET
  title = 'Building With Code, Becoming Through It.',
  subtitle = 'Full-Stack Developer · AI Systems Builder · Automation Developer',
  tagline = 'CodeAndBe Portfolio',
  description = 'I build CMS-powered websites, AI-integrated tools, automation workflows, and secure digital platforms that turn complex ideas into reliable products.',
  cta_primary_label = 'View Projects',
  cta_primary_url = '/projects',
  cta_secondary_label = 'GitHub',
  cta_secondary_url = 'https://github.com/codeandbe',
  cta_tertiary_label = 'Contact Me',
  cta_tertiary_url = '/contact',
  published = true,
  sort_order = 0,
  updated_at = CURRENT_TIMESTAMP
WHERE published = true AND sort_order = 0;

-- ---------------------------------------------------------------------------
-- Verify the update
-- ---------------------------------------------------------------------------
SELECT id, title, subtitle, tagline, published, sort_order, updated_at
FROM hero_sections
WHERE published = true
ORDER BY sort_order ASC;
