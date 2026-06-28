'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { slugify, parseTechStack, getStoragePublicUrl } from '@/lib/cms-utils';
import {
  Project,
  createProject,
  updateProject,
} from '@/lib/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { revalidatePortfolioPages } from '@/app/revalidate-actions';
import { Loader2, ImageIcon, X, Calendar } from 'lucide-react';

type ProjectFormProps = {
  project?: Project;
  onSuccess?: () => void;
};

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    category: project?.category || '',
    status: project?.status || 'Active',
    tech_stack: project?.tech_stack?.join(', ') || '',
    github_url: project?.github_url || '',
    live_url: project?.live_url || '',
    sort_order: project?.sort_order?.toString() || '0',
    problem: project?.problem || '',
    solution: project?.solution || '',
    my_role: project?.my_role || '',
    role: project?.role || project?.my_role || '',
    outcome: project?.outcome || '',
    published: project?.published ?? true,
    featured: project?.featured ?? false,
    release_tag: project?.release_tag || '',
    release_title: project?.release_title || '',
    release_date: project?.release_date || '',
    release_notes: project?.release_notes || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    project?.image_url || (project?.image_id ? getStoragePublicUrl(`projects/${project.image_id}`) : null)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugManual, setSlugManual] = useState(!!project?.slug);

  useEffect(() => {
    if (!slugManual && formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title, slugManual]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'slug') setSlugManual(true);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max size is 5MB.', variant: 'destructive' });
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const uploadImage = async (): Promise<{ image_id?: string; image_url?: string } | null> => {
    if (!imageFile) return null;
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${slugify(formData.slug || formData.title)}-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;
      return {
        image_id: fileName,
        image_url: getStoragePublicUrl(filePath),
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const uploaded = imageFile ? await uploadImage() : null;
      const slug = formData.slug.trim() || slugify(formData.title);

      const projectData = {
        title: formData.title.trim(),
        slug,
        description: formData.description.trim(),
        category: formData.category.trim() || null,
        status: formData.status.trim() || 'Active',
        tech_stack: parseTechStack(formData.tech_stack),
        github_url: formData.github_url.trim() || null,
        live_url: formData.live_url.trim() || null,
        sort_order: parseInt(formData.sort_order, 10) || 0,
        problem: formData.problem.trim() || null,
        solution: formData.solution.trim() || null,
        my_role: formData.my_role.trim() || null,
        role: formData.role.trim() || null,
        outcome: formData.outcome.trim() || null,
        published: formData.published,
        featured: formData.featured,
        image_id: uploaded?.image_id ?? project?.image_id ?? null,
        image_url: uploaded?.image_url ?? project?.image_url ?? null,
        screenshots: project?.screenshots ?? [],
        release_tag: formData.release_tag.trim() || null,
        release_title: formData.release_title.trim() || null,
        release_date: formData.release_date || null,
        release_notes: formData.release_notes.trim() || null,
      };

      if (project) {
        await updateProject(project.id, projectData);
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        await createProject(projectData);
        toast({ title: 'Success', description: 'Project created successfully' });
      }

      if (onSuccess) onSuccess();
      else router.push('/admin/projects');

      await revalidatePortfolioPages();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated-from-title" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="AgriTech / IoT / AI" />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
          </div>
          <div>
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input id="tech_stack" name="tech_stack" value={formData.tech_stack} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" name="github_url" type="url" value={formData.github_url} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="live_url">Live URL</Label>
              <Input id="live_url" name="live_url" type="url" value={formData.live_url} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" value={formData.status} onChange={handleChange} placeholder="Active / Client Project" />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input id="sort_order" name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} min="0" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(v) => setFormData((p) => ({ ...p, published: v }))}
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(v) => setFormData((p) => ({ ...p, featured: v }))}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Project Image</Label>
            <div className="mt-1 flex justify-center rounded-lg border border-dashed px-6 py-8">
              {previewUrl ? (
                <div className="relative w-full">
                  <div className="relative h-48 w-full rounded-md overflow-hidden">
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer text-center">
                  <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                  <span className="mt-2 block text-sm text-primary">Upload image</span>
                  <input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="problem">Problem</Label>
            <Textarea id="problem" name="problem" value={formData.problem} onChange={handleChange} rows={3} />
          </div>
          <div>
            <Label htmlFor="solution">Solution</Label>
            <Textarea id="solution" name="solution" value={formData.solution} onChange={handleChange} rows={3} />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Textarea id="role" name="role" value={formData.role} onChange={handleChange} rows={2} placeholder="Your role in the project" />
          </div>
          <div>
            <Label htmlFor="my_role">My Role (Legacy)</Label>
            <Textarea id="my_role" name="my_role" value={formData.my_role} onChange={handleChange} rows={2} placeholder="Legacy field - use Role instead" />
          </div>
          <div>
            <Label htmlFor="outcome">Outcome</Label>
            <Textarea id="outcome" name="outcome" value={formData.outcome} onChange={handleChange} rows={3} />
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Release Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="release_tag">Release Tag</Label>
                <Input id="release_tag" name="release_tag" value={formData.release_tag} onChange={handleChange} placeholder="v1.0.0" />
              </div>
              <div>
                <Label htmlFor="release_date">Release Date</Label>
                <Input id="release_date" name="release_date" type="date" value={formData.release_date} onChange={handleChange} />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="release_title">Release Title</Label>
              <Input id="release_title" name="release_title" value={formData.release_title} onChange={handleChange} placeholder="Initial Release" />
            </div>
            <div className="mt-3">
              <Label htmlFor="release_notes">Release Notes</Label>
              <Textarea id="release_notes" name="release_notes" value={formData.release_notes} onChange={handleChange} rows={3} placeholder="What's new in this release" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/projects')} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
