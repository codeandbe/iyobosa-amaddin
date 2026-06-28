import { supabase } from './supabase-client';

export type AboutMeRecord = {
  id: string;
  headline: string;
  title: string | null;
  bio: string;
  highlights: string[];
  profile_image_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getAboutMeSection(): Promise<AboutMeRecord | null> {
  const { data, error } = await supabase
    .from('about_me_sections')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching about me section from Supabase', error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
  } as AboutMeRecord;
}

export async function upsertAboutMeSection(
  payload: Partial<Omit<AboutMeRecord, 'id' | 'created_at' | 'updated_at'>>
) {
  // Use the same logic as public fetch: published=true, order by sort_order ascending
  const { data: existing } = await supabase
    .from('about_me_sections')
    .select('id')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from('about_me_sections')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as AboutMeRecord;
  }

  const { data, error } = await supabase.from('about_me_sections').insert(payload).select().single();
  if (error) throw error;
  return data as AboutMeRecord;
}
