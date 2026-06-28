import { supabase } from './supabase-client';

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Experience functions
export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching experience:', error);
    return [];
  }

  return data || [];
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching experience ${id}:`, error);
    return null;
  }

  return data;
}

export async function createExperience(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('experience')
    .insert(experience)
    .select()
    .single();

  if (error) {
    console.error('Error creating experience:', error);
    throw error;
  }

  return data;
}

export async function updateExperience(
  id: string,
  updates: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('experience')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating experience ${id}:`, error);
    throw error;
  }

  return data;
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from('experience').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting experience ${id}:`, error);
    throw error;
  }
}

// Education functions
export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching education:', error);
    return [];
  }

  return data || [];
}

export async function getEducationById(id: string): Promise<Education | null> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching education ${id}:`, error);
    return null;
  }

  return data;
}

export async function createEducation(education: Omit<Education, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('education')
    .insert(education)
    .select()
    .single();

  if (error) {
    console.error('Error creating education:', error);
    throw error;
  }

  return data;
}

export async function updateEducation(
  id: string,
  updates: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('education')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating education ${id}:`, error);
    throw error;
  }

  return data;
}

export async function deleteEducation(id: string) {
  const { error } = await supabase.from('education').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting education ${id}:`, error);
    throw error;
  }
}
