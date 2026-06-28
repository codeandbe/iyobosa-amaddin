import { supabase } from './supabase-client';

export type DashboardStats = {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  blogPosts: number;
  contactMessages: number;
  unreadMessages: number;
  skills: number;
  skillCategories: number;
};

export type PublicStats = {
  publishedProjects: number;
  featuredProjects: number;
  publishedBlogPosts: number;
  skills: number;
  certifications: number;
  awards: number;
  experienceItems: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    projectsRes,
    publishedRes,
    featuredRes,
    blogRes,
    contactRes,
    unreadRes,
    skillsRes,
    categoriesRes,
  ] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
    supabase.from('skills').select('id', { count: 'exact', head: true }),
    supabase.from('skill_categories').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalProjects: projectsRes.count ?? 0,
    publishedProjects: publishedRes.count ?? 0,
    featuredProjects: featuredRes.count ?? 0,
    blogPosts: blogRes.count ?? 0,
    contactMessages: contactRes.count ?? 0,
    unreadMessages: unreadRes.count ?? 0,
    skills: skillsRes.count ?? 0,
    skillCategories: categoriesRes.count ?? 0,
  };
}

export async function getPublicStats(): Promise<PublicStats> {
  const [
    publishedProjectsRes,
    featuredProjectsRes,
    publishedBlogPostsRes,
    skillsRes,
    certificationsRes,
    awardsRes,
    experienceRes,
  ] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true).eq('featured', true),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('skills').select('id', { count: 'exact', head: true }),
    supabase.from('licences_and_certifications').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('awards_and_achievements').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('experience').select('id', { count: 'exact', head: true }),
  ]);

  return {
    publishedProjects: publishedProjectsRes.count ?? 0,
    featuredProjects: featuredProjectsRes.count ?? 0,
    publishedBlogPosts: publishedBlogPostsRes.count ?? 0,
    skills: skillsRes.count ?? 0,
    certifications: certificationsRes.count ?? 0,
    awards: awardsRes.count ?? 0,
    experienceItems: experienceRes.count ?? 0,
  };
}
