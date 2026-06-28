import { supabase } from './supabase-client';

export type BlogPost = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string;
  content: string;
  url: string;
  image_url?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }
  return data || [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching blog post ${id}:`, error);
    return null;
  }

  return data;
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }

  return data;
}

export async function updateBlogPost(
  id: string,
  updates: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating blog post ${id}:`, error);
    throw error;
  }

  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting blog post ${id}:`, error);
    throw error;
  }
}

export async function toggleBlogPostPublished(id: string, published: boolean) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error toggling blog post ${id}:`, error);
    throw error;
  }

  return data;
}
