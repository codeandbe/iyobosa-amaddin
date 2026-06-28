import { supabase } from './supabase-client';

export interface Award {
  id: string;
  title: string;
  description: string;
  issuer: string;
  date_awarded: string;
  certificate_url: string;
  image_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getAwards(): Promise<Award[]> {
  try {
    const { data, error } = await supabase
      .from('awards_and_achievements')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching awards:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching awards:', error);
    return [];
  }
}

export async function getAwardById(id: string): Promise<Award | null> {
  const { data, error } = await supabase
    .from('awards_and_achievements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching award:', error);
    return null;
  }

  return data;
}

export async function createAward(award: Omit<Award, 'id' | 'created_at' | 'updated_at'>): Promise<Award | null> {
  try {
    const { data, error } = await supabase
      .from('awards_and_achievements')
      .insert(award)
      .select()
      .single();

    if (error) {
      console.error('Error creating award:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating award:', error);
    return null;
  }
}

export async function updateAward(id: string, award: Partial<Award>): Promise<Award | null> {
  try {
    const { data, error } = await supabase
      .from('awards_and_achievements')
      .update(award)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating award:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating award:', error);
    return null;
  }
}

export async function deleteAward(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('awards_and_achievements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting award:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting award:', error);
    return false;
  }
}
