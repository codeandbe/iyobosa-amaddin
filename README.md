# CodeAndBe Portfolio CMS

A Supabase-backed developer portfolio and CMS for **IYOBOSA MAJID AMADDIN / CodeAndBe**.

## Setup

1. Copy `.env.local` with Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=your_email@gmail.com
   ADMIN_EMAIL=your_email@gmail.com
   ```

2. Run SQL schemas in Supabase SQL Editor (in order):
   - `supabase-schemas/projects-schema.sql`
   - `supabase-schemas/skills-schema.sql`
   - `supabase-schemas/experience-schema.sql`
   - `supabase-schemas/blog-schema.sql`
   - `supabase-schemas/contact-schema.sql`
   - `supabase-schemas/social-schema.sql`
   - `supabase-schemas/awards-schema.sql`
   - `supabase-schemas/licences-schema.sql`
   - **`supabase-schemas/cms-migration.sql`** (adds CMS fields + seeds CodeAndBe content)

3. Create Supabase Storage bucket: `portfolio-assets` (public read)

4. Create admin user in Supabase Auth

5. Start dev server:
   ```bash
   npm run dev
   ```
   - Public site: http://localhost:9002
   - Admin: http://localhost:9002/admin

## CMS Features

- Full CRUD for hero, about, projects, skills, experience, education, blog, awards, licenses, social links, contact messages
- Featured / published / sort_order / slug / category / case-study fields on projects
- Image uploads via Supabase Storage
- Admin dashboard with content counts
- Public pages fetch live data from Supabase (fallbacks only when DB is empty)

## Featured Projects (seeded)

1. GanSystem
2. GanSystem Weed Detection
3. NCSC Hackathon / WeGoComply
4. Stack & Hustle WordPress Theme
5. SchoolTry EdTech
6. Opulent Medspa
7. Portfolio CMS
