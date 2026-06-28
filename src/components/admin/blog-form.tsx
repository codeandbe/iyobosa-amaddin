'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost, createBlogPost, updateBlogPost } from '@/lib/blog';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { slugify } from '@/lib/cms-utils';
import {
  X,
  Loader2,
  Upload,
  ImageIcon,
  Calendar,
  Save,
} from "lucide-react";
type BlogFormProps = {
  post?: BlogPost;
  onSuccess?: () => void;
};

export default function BlogForm({ post, onSuccess }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    url: post?.url || '',
    image_url: post?.image_url || '',
    published: post?.published || false,
    sort_order: post?.sort_order?.toString() || '0',
  });
  const [slugManual, setSlugManual] = useState(!!post?.slug);

  useEffect(() => {
    if (!slugManual && formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title, slugManual]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.image_url || null);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `blog-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = formData.image_url;
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        url: formData.url.trim() || '',
        image_url: imageUrl || undefined,
        published: formData.published,
        sort_order: parseInt(formData.sort_order, 10) || 0,
      };
      
      if (post) {
        await updateBlogPost(post.id, postData);
        toast({
          title: 'Success',
          description: 'Blog post updated successfully',
        });
      } else {
        await createBlogPost(postData);
        toast({
          title: 'Success',
          description: 'Blog post created successfully',
        });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/blog');
      }
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save blog post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter blog post title..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={(e) => {
            setSlugManual(true);
            handleChange('slug', e.target.value);
          }}
          placeholder="auto-generated-from-title"
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          placeholder="Brief description of the blog post..."
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          This will be shown in the blog listing
        </p>
      </div>
      
      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Write your blog post content here..."
          rows={12}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="url">External URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://example.com/blog-post (optional)"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Link to external blog post or resource
        </p>
      </div>
      
      <div>
        <Label htmlFor="image">Blog Image</Label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              disabled={!imageFile && !imagePreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Blog post preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Upload an image for your blog post. This will be displayed in the blog listing.
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="published">Published</Label>
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => handleChange('published', checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Unpublished posts won't appear on the public site
        </p>
      </div>
      
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => handleChange('sort_order', e.target.value)}
          min="0"
          step="1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Lower numbers appear first in the list
        </p>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/blog')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}
