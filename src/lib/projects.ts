import { supabase } from './supabase-client';

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  status: string | null;
  tech_stack: string[];
  image_id: string | null;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  problem: string | null;
  solution: string | null;
  my_role: string | null; // Legacy field, kept for backward compatibility
  role: string | null; // New standardized field
  outcome: string | null;
  screenshots: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  release_tag: string | null;
  release_title: string | null;
  release_date: string | null;
  release_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
  return (data as Project[]) || [];
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return (data as Project[]) || [];
}

export async function getFeaturedProjects(limit = 7): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
  return (data as Project[]) || [];
}

export async function getProjectCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .eq('published', true)
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching project categories:', error);
    return [];
  }

  const categories = new Set<string>();
  (data || []).forEach((row: { category: string | null }) => {
    if (row.category) categories.add(row.category);
  });
  return Array.from(categories).sort();
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
  return data as Project;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
  if (error) {
    console.error(`Error fetching project slug ${slug}:`, error);
    return null;
  }
  return data as Project;
}

export async function createProject(project: Partial<ProjectInput> & Pick<ProjectInput, 'title' | 'description'>) {
  const { data, error } = await supabase.from('projects').insert(project).select().single();
  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  return data as Project;
}

export async function updateProject(id: string, updates: Partial<ProjectInput>) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
}

export async function toggleProjectPublished(id: string, published: boolean) {
  return updateProject(id, { published });
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  return updateProject(id, { featured });
}

export async function updateProjectSortOrder(id: string, sort_order: number) {
  return updateProject(id, { sort_order });
}
