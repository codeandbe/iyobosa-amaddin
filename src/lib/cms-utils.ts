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

import { resolveImageUrl } from './utils/image-url';

export function getProjectImageUrl(project: {
  image_url?: string | null;
  image_id?: string | null;
}): string {
  const url = resolveImageUrl(project.image_url ?? null, project.image_id ? `projects/${project.image_id}` : null);
  return url ?? 'https://picsum.photos/seed/project/600/400';
}

export function parseTechStack(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
