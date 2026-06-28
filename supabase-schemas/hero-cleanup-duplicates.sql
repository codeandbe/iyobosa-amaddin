-- =============================================================================
-- Hero Section Cleanup: Unpublish Duplicate Records
-- Run this in Supabase SQL Editor
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Unpublish all hero records except the one with the lowest sort_order
-- This ensures only one active hero record remains
-- ---------------------------------------------------------------------------

-- First, unpublish all hero records
UPDATE hero_sections
SET
  published = false,
  sort_order = 99,
  updated_at = CURRENT_TIMESTAMP
WHERE published = true;

-- Then, republish the record with the lowest original sort_order (now 99)
-- We'll use the one with the earliest created_at as the canonical record
UPDATE hero_sections
SET
  published = true,
  sort_order = 0,
  updated_at = CURRENT_TIMESTAMP
WHERE id = (
  SELECT id
  FROM hero_sections
  ORDER BY created_at ASC
  LIMIT 1
);

-- ---------------------------------------------------------------------------
-- Verify the cleanup
-- ---------------------------------------------------------------------------
SELECT id, title, published, sort_order, created_at, updated_at
FROM hero_sections
ORDER BY sort_order ASC, created_at ASC;
