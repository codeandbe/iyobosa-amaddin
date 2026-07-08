'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase-client";
import { Licence, createLicence, updateLicence } from '@/lib/licences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { getStoragePublicUrl } from '@/lib/cms-utils';

type LicenceFormProps = {
  licence?: Licence;
};

export default function LicenceForm({ licence }: LicenceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: licence?.title || '',
    description: licence?.description || '',
    issuer: licence?.issuer || '',
    issue_date: licence?.issue_date || '',
    expiry_date: licence?.expiry_date || '',
    credential_id: licence?.credential_id || '',
    credential_url: licence?.credential_url || '',
    sort_order: licence?.sort_order || 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (licence?.image_id) {
      setImagePreview(getStoragePublicUrl(`licences/${licence.image_id}`));
    }
  }, [licence]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `licences/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const extractImageId = (url: string): string | null => {
    const match = url.match(/licences\/(.+)$/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageId = licence?.image_id || null;
      
      if (imageFile) {
        setUploading(true);
        const imageUrl = await uploadImage(imageFile);
        setUploading(false);
        
        if (imageUrl) {
          imageId = extractImageId(imageUrl);
        }
      }

      const licenceData = {
        title: formData.title,
        description: formData.description,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date || null,
        credential_id: formData.credential_id,
        credential_url: formData.credential_url,
        sort_order: formData.sort_order,
        ...(imageId && { image_id: imageId }),
      };

      let result;
      if (licence?.id) {
        result = await updateLicence(licence.id, licenceData);
      } else {
        result = await createLicence(licenceData);
      }

      if (result) {
        toast({
          title: 'Success',
          description: licence?.id ? 'Licence updated successfully' : 'Licence created successfully',
        });
        router.push('/admin/licences');
      } else {
        toast({
          title: 'Error',
          description: licence?.id ? 'Failed to update licence' : 'Failed to create licence',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving licence:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin')}>
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">
            {licence?.id ? 'Edit Licence' : 'New Licence'}
          </h1>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/licences')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer *</Label>
            <Input
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleInputChange}
              required
              placeholder="e.g., Amazon Web Services"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue_date">Issue Date *</Label>
            <Input
              id="issue_date"
              name="issue_date"
              type="date"
              value={formData.issue_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleInputChange}
              placeholder="Leave empty if no expiry"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credential_id">Credential ID</Label>
            <Input
              id="credential_id"
              name="credential_id"
              value={formData.credential_id}
              onChange={handleInputChange}
              placeholder="e.g., AWS-SAA-C032J4Y8"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describe the licence/certification and your achievement..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="credential_url">Credential URL</Label>
          <Input
            id="credential_url"
            name="credential_url"
            type="url"
            value={formData.credential_url}
            onChange={handleInputChange}
            placeholder="https://example.com/credential"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Licence/Certification Image</Label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                <OptimizedImage
                  src={imagePreview}
                  alt="Licence preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="mr-2 h-4 w-4" />
                )}
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/licences')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || uploading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {licence?.id ? 'Update Licence' : 'Create Licence'}
          </Button>
        </div>
      </form>
    </div>
  );
}
