import { supabase } from './supabase-client';

export type HeroSectionRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  tagline: string | null;
  description: string | null;
  cta_primary_label: string | null;
  cta_primary_url: string | null;
  cta_secondary_label: string | null;
  cta_secondary_url: string | null;
  cta_tertiary_label: string | null;
  cta_tertiary_url: string | null;
  hero_image_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getHeroSection(): Promise<HeroSectionRecord | null> {
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching hero section from Supabase', error);
    return null;
  }
  return data as HeroSectionRecord | null;
}

export async function upsertHeroSection(payload: Partial<Omit<HeroSectionRecord, 'id' | 'created_at' | 'updated_at'>>) {
  // Use the same logic as public fetch: published=true, order by sort_order ascending
  const { data: existing } = await supabase
    .from('hero_sections')
    .select('id')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from('hero_sections')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as HeroSectionRecord;
  }

  const { data, error } = await supabase.from('hero_sections').insert(payload).select().single();
  if (error) throw error;
  return data as HeroSectionRecord;
}

export async function getAllHeroSections() {
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all hero sections', error);
    return [];
  }
  return data as HeroSectionRecord[];
}

export async function unpublishHeroSection(id: string) {
  const { data, error } = await supabase
    .from('hero_sections')
    .update({ published: false, sort_order: 99, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as HeroSectionRecord;
}
