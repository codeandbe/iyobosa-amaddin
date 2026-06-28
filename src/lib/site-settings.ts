import { supabase } from './supabase-client';

export type SiteSettingValue = string | number | boolean | null | Record<string, any>;

export async function getSiteSetting(key: string): Promise<SiteSettingValue | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching site setting ${key}:`, error);
    return null;
  }

  return data?.value ?? null;
}

export async function getSiteSettingWithDefault<T extends SiteSettingValue>(
  key: string,
  defaultValue: T
): Promise<T> {
  const value = await getSiteSetting(key);
  return (value as T) ?? defaultValue;
}

export async function setSiteSetting(key: string, value: SiteSettingValue): Promise<boolean> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    console.error(`Error setting site setting ${key}:`, error);
    return false;
  }

  return true;
}

export async function getAllSiteSettings(): Promise<Record<string, SiteSettingValue>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  const settings: Record<string, SiteSettingValue> = {};
  data?.forEach(({ key, value }) => {
    settings[key] = value;
  });

  return settings;
}

// Specific setting getters with defaults
export async function getFeaturedProjectsHomeLimit(): Promise<number> {
  return getSiteSettingWithDefault('featured_projects_home_limit', 3);
}

export async function getBlogPostsHomeLimit(): Promise<number> {
  return getSiteSettingWithDefault('blog_posts_home_limit', 3);
}
