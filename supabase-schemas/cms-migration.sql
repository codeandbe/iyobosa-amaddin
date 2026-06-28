-- =============================================================================
-- CodeAndBe Portfolio CMS Migration
-- Run this in the Supabase SQL Editor after existing base schemas.
-- Safe to re-run: uses IF NOT EXISTS / IF EXISTS guards.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Hero sections
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '',
    subtitle TEXT,
    tagline VARCHAR(255),
    cta_primary_label VARCHAR(100),
    cta_primary_url VARCHAR(500),
    cta_secondary_label VARCHAR(100),
    cta_secondary_url VARCHAR(500),
    hero_image_url VARCHAR(500),
    published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hero_public_read" ON hero_sections;
DROP POLICY IF EXISTS "hero_auth_write" ON hero_sections;
CREATE POLICY "hero_public_read" ON hero_sections FOR SELECT USING (true);
CREATE POLICY "hero_auth_insert" ON hero_sections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "hero_auth_update" ON hero_sections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "hero_auth_delete" ON hero_sections FOR DELETE USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- About me sections
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_me_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    headline VARCHAR(255) NOT NULL DEFAULT '',
    title VARCHAR(255),
    bio TEXT NOT NULL DEFAULT '',
    highlights JSONB DEFAULT '[]'::jsonb,
    profile_image_url VARCHAR(500),
    published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE about_me_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "about_public_read" ON about_me_sections;
CREATE POLICY "about_public_read" ON about_me_sections FOR SELECT USING (true);
CREATE POLICY "about_auth_insert" ON about_me_sections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "about_auth_update" ON about_me_sections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "about_auth_delete" ON about_me_sections FOR DELETE USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Projects – extend with CMS fields
-- ---------------------------------------------------------------------------
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(100) DEFAULT 'Active';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS my_role TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots TEXT[] DEFAULT '{}';

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- ---------------------------------------------------------------------------
-- Blog posts – slug
-- ---------------------------------------------------------------------------
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- ---------------------------------------------------------------------------
-- Awards – CMS fields
-- ---------------------------------------------------------------------------
ALTER TABLE awards_and_achievements ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE awards_and_achievements ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE awards_and_achievements ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- ---------------------------------------------------------------------------
-- Licences – CMS fields
-- ---------------------------------------------------------------------------
ALTER TABLE licences_and_certifications ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE licences_and_certifications ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE licences_and_certifications ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE licences_and_certifications ADD COLUMN IF NOT EXISTS status VARCHAR(100);

-- ---------------------------------------------------------------------------
-- Experience / Education – published flag
-- ---------------------------------------------------------------------------
ALTER TABLE experience ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE education ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

-- ---------------------------------------------------------------------------
-- Add missing columns to existing tables (if they were created without them)
-- ---------------------------------------------------------------------------
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS hero_image_url VARCHAR(500);
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE hero_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE about_me_sections ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE about_me_sections ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;
ALTER TABLE about_me_sections ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
ALTER TABLE about_me_sections ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE about_me_sections ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE about_me_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE about_me_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- ---------------------------------------------------------------------------
-- Seed: Hero
-- ---------------------------------------------------------------------------
INSERT INTO hero_sections (title, subtitle, tagline, cta_primary_label, cta_primary_url, cta_secondary_label, cta_secondary_url, published)
SELECT
    'Building Systems With Code, Living the Process',
    'Full-Stack Developer | AI Systems Builder | Automation Developer | Data Analyst',
    'CodeAndBe — IYOBOSA MAJID AMADDIN',
    'View My Work',
    '/projects',
    'GitHub',
    'https://github.com/codeandbe',
    true
WHERE NOT EXISTS (SELECT 1 FROM hero_sections LIMIT 1);

-- ---------------------------------------------------------------------------
-- Seed: About Me
-- ---------------------------------------------------------------------------
INSERT INTO about_me_sections (headline, title, bio, highlights, published)
SELECT
    'About IYOBOSA MAJID AMADDIN',
    'Full-Stack Developer | AI Systems Builder | Automation Developer | Data Analyst',
    'I''m a developer documenting my journey of building real-world systems, exploring AI, and growing through technology. My work focuses on full-stack applications, AI-integrated systems, automation workflows, secure platforms, and practical tools that solve real business and community problems.',
    '["Full-Stack Applications","AI-Integrated Systems","Secure & Decentralized Systems","Automation-Driven Engineering","CMS and Admin Dashboard Development","Client Websites and Business Platforms"]'::jsonb,
    true
WHERE NOT EXISTS (SELECT 1 FROM about_me_sections LIMIT 1);

-- ---------------------------------------------------------------------------
-- Seed: Social links
-- ---------------------------------------------------------------------------
DELETE FROM social_links WHERE platform IN ('GitHub', 'LinkedIn', 'Medium', 'X', 'Instagram');

INSERT INTO social_links (platform, url, display_name, icon, sort_order, active) VALUES
    ('GitHub', 'https://github.com/codeandbe', 'codeandbe', 'Github', 1, true),
    ('LinkedIn', 'https://linkedin.com/in/codeandbe', 'codeandbe', 'Linkedin', 2, true),
    ('Medium', 'https://medium.com/@codeandbe', 'codeandbe', 'BookOpen', 3, true),
    ('X', 'https://x.com/codeandbe', 'codeandbe', 'Twitter', 4, true),
    ('Instagram', 'https://www.instagram.com/codeandbe/', 'codeandbe', 'Instagram', 5, true);

-- ---------------------------------------------------------------------------
-- Seed: Featured projects (upsert by slug)
-- ---------------------------------------------------------------------------
INSERT INTO projects (
    title, slug, description, category, tech_stack, github_url, live_url,
    sort_order, featured, published, status, problem, solution, my_role, outcome
) VALUES
(
    'GanSystem',
    'gansystem',
    'AI-powered IoT farm automation platform built with Next.js, ESP32, MQTT, WebSockets, and PostgreSQL. Designed to support smart irrigation, farm monitoring, automation, and agricultural decision-making.',
    'AgriTech / IoT / AI',
    ARRAY['Next.js', 'TypeScript', 'ESP32', 'MQTT', 'WebSockets', 'PostgreSQL', 'IoT'],
    'https://github.com/codeandbe/gansystem',
    NULL,
    1, true, true, 'Active',
    'Farmers need real-time monitoring and automated irrigation without expensive proprietary systems.',
    'Built an IoT platform connecting ESP32 sensors via MQTT to a Next.js dashboard with live WebSocket updates and PostgreSQL persistence.',
    'Full-stack developer — architecture, firmware integration, backend, and dashboard UI.',
    'Delivered a scalable farm automation prototype with smart irrigation and monitoring capabilities.'
),
(
    'GanSystem Weed Detection',
    'gansystem-weed-detection',
    'AI-powered weed detection system developed for smart agriculture. Uses computer vision and model training workflows to detect weeds and support smarter crop monitoring.',
    'Computer Vision / AgriTech AI',
    ARRAY['Python', 'YOLO', 'Roboflow', 'OpenCV', 'Computer Vision'],
    'https://github.com/codeandbe/gansystem-weed-detection',
    NULL,
    2, true, true, 'Active',
    'Manual weed identification is slow and error-prone at scale in agricultural fields.',
    'Trained YOLO models on annotated datasets via Roboflow and built a detection pipeline with OpenCV.',
    'ML engineer — dataset curation, model training, and inference pipeline development.',
    'Created a working weed detection workflow that supports smarter crop monitoring decisions.'
),
(
    'NCSC Hackathon Platform / WeGoComply',
    'ncsc-hackathon-wegoComply',
    'React and Supabase hackathon platform built for cybersecurity event registration, content management, and admin dashboard workflows. Also connected to compliance-focused workflows involving KYC, TIN verification, and AML concepts.',
    'Cybersecurity / RegTech / Supabase',
    ARRAY['React', 'TypeScript', 'Supabase', 'Cybersecurity', 'Admin Dashboard'],
    'https://github.com/codeandbe/ncsc-hackaton',
    NULL,
    3, true, true, 'Active',
    'Cybersecurity events need secure registration and admin-managed content with compliance awareness.',
    'Built a React + Supabase platform with event registration, CMS admin, and compliance workflow concepts.',
    'Full-stack developer — platform architecture, Supabase schema, and admin dashboard.',
    'Delivered a hackathon-ready platform with registration and content management capabilities.'
),
(
    'Stack & Hustle WordPress Theme',
    'stack-and-hustle-wordpress-theme',
    'Custom WordPress theme developed for Stack & Hustle, a coworking, tech, and event space in Abuja, Nigeria. Built to showcase the brand, services, events, and business identity.',
    'Business Website / WordPress / Client Project',
    ARRAY['PHP', 'WordPress', 'CSS', 'JavaScript'],
    'https://github.com/codeandbe/stackandhustle-wordpress-theme',
    NULL,
    4, true, true, 'Client Project',
    'Stack & Hustle needed a branded web presence reflecting their coworking and events identity.',
    'Developed a custom WordPress theme with responsive layouts for services, events, and brand storytelling.',
    'Theme developer — design implementation, WordPress customization, and client delivery.',
    'Launched a polished brand website for a Abuja-based coworking and tech space.'
),
(
    'SchoolTry EdTech',
    'schooltry-edtech',
    'A simple learning assistant that helps students ask questions about lessons and uses AI to provide helpful answers.',
    'EdTech / AI Learning Assistant',
    ARRAY['PHP', 'Laravel', 'AI Integration', 'MySQL'],
    'https://github.com/codeandbe/schooltry-edtech',
    NULL,
    5, true, true, 'Active',
    'Students need accessible help understanding lesson content outside the classroom.',
    'Built a Laravel-based learning assistant with AI integration for question answering.',
    'Backend developer — API design, AI integration, and database modeling.',
    'Shipped an EdTech assistant prototype that helps students engage with lesson material.'
),
(
    'Opulent Medspa / Opulent Clinical Group',
    'opulent-medspa',
    'A polished client-facing website and digital brand experience for Opulent Medspa / Opulent Clinical Group, focused on luxury aesthetics, healthcare services, appointment conversion, and brand consistency.',
    'Client Website / Healthcare / Brand System',
    ARRAY['React', 'WordPress', 'Responsive Design', 'SEO', 'UI/UX', 'Client CMS'],
    NULL,
    NULL,
    6, true, true, 'Client Project',
    'A luxury medspa brand needed a high-converting digital presence with consistent visual identity.',
    'Designed and built a client-facing website focused on aesthetics, services, and appointment conversion.',
    'Web developer — UI/UX, responsive design, SEO, and brand system implementation.',
    'Delivered a polished healthcare brand experience optimized for client engagement.'
),
(
    'Portfolio CMS',
    'portfolio-cms',
    'This portfolio itself — a full-stack CMS-powered developer portfolio built with Next.js, TypeScript, Supabase, authentication, storage, and an admin dashboard.',
    'Full-Stack / SaaS / CMS',
    ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
    'https://github.com/codeandbe',
    NULL,
    7, true, true, 'Active',
    'Developer portfolios often require code changes for every content update.',
    'Built a Supabase-backed CMS with admin dashboard, storage, auth, and live public pages.',
    'Solo full-stack developer — architecture, CMS, admin UI, and deployment.',
    'A self-hosted portfolio CMS where all content is managed without touching code.'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    tech_stack = EXCLUDED.tech_stack,
    github_url = EXCLUDED.github_url,
    live_url = EXCLUDED.live_url,
    sort_order = EXCLUDED.sort_order,
    featured = EXCLUDED.featured,
    published = EXCLUDED.published,
    status = EXCLUDED.status,
    problem = EXCLUDED.problem,
    solution = EXCLUDED.solution,
    my_role = EXCLUDED.my_role,
    outcome = EXCLUDED.outcome,
    updated_at = CURRENT_TIMESTAMP;
