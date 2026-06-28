/** Shared CMS helpers for slug generation, storage URLs, and image resolution. */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getStoragePublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  return `${base}/storage/v1/object/public/portfolio-assets/${path}`;
}

export function getProjectImageUrl(project: {
  image_url?: string | null;
  image_id?: string | null;
}): string {
  if (project.image_url) return project.image_url;
  if (project.image_id) return getStoragePublicUrl(`projects/${project.image_id}`);
  return 'https://picsum.photos/seed/project/600/400';
}

export function parseTechStack(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
