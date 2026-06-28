import { supabase } from './supabase-client';

export interface Licence {
  id: string;
  title: string;
  description: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  image_id?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getLicences(): Promise<Licence[]> {
  try {
    const { data, error } = await supabase
      .from('licences_and_certifications')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching licences:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching licences:', error);
    return [];
  }
}

export async function getLicenceById(id: string): Promise<Licence | null> {
  try {
    const { data, error } = await supabase
      .from('licences_and_certifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching licence:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching licence:', error);
    return null;
  }
}

export async function createLicence(licence: Omit<Licence, 'id' | 'created_at' | 'updated_at'>): Promise<Licence | null> {
  try {
    const { data, error } = await supabase
      .from('licences_and_certifications')
      .insert([licence])
      .select()
      .single();

    if (error) {
      console.error('Error creating licence:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating licence:', error);
    return null;
  }
}

export async function updateLicence(id: string, licence: Partial<Omit<Licence, 'id' | 'created_at' | 'updated_at'>>): Promise<Licence | null> {
  try {
    const { data, error } = await supabase
      .from('licences_and_certifications')
      .update(licence)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating licence:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating licence:', error);
    return null;
  }
}

export async function deleteLicence(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('licences_and_certifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting licence:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting licence:', error);
    return false;
  }
}
