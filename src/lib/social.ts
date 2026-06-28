import { supabase } from './supabase-client';

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  display_name: string;
  icon: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching social links:', error);
    return [];
  }

  return data || [];
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all social links:', error);
    return [];
  }

  return data || [];
}

export async function getSocialLinkById(id: string): Promise<SocialLink | null> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching social link ${id}:`, error);
    return null;
  }

  return data;
}

export async function createSocialLink(link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('social_links')
    .insert(link)
    .select()
    .single();

  if (error) {
    console.error('Error creating social link:', error);
    throw error;
  }

  return data;
}

export async function updateSocialLink(
  id: string,
  updates: Partial<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('social_links')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating social link ${id}:`, error);
    throw error;
  }

  return data;
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase.from('social_links').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting social link ${id}:`, error);
    throw error;
  }
}

export async function toggleSocialLinkActive(id: string, active: boolean) {
  const { data, error } = await supabase
    .from('social_links')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error toggling social link ${id}:`, error);
    throw error;
  }

  return data;
}
