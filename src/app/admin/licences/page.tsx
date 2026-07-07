'use client';

import { useState, useEffect } from 'react';
import { getLicences, deleteLicence, Licence } from '@/lib/licences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LicencesAdminPage() {
  const [licences, setLicences] = useState<Licence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchLicences();
  }, []);

  const fetchLicences = async () => {
    try {
      setLoading(true);
      const data = await getLicences();
      setLicences(data);
    } catch (error) {
      console.error('Error loading licences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load licences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this licence?')) return;
    
    try {
      await deleteLicence(id);
      setLicences(licences.filter(licence => licence.id !== id));
      toast({
        title: 'Success',
        description: 'Licence deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting licence:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete licence',
        variant: 'destructive',
      });
    }
  };

  const filteredLicences = licences.filter(licence =>
    licence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    licence.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    licence.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Loading licences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-cyan-400">Licences & Certifications</h1>
          <p className="text-slate-400 mt-2">Add and manage your professional licenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950" asChild>
            <Link href="/admin/licences/new">
              <Plus className="mr-2 h-4 w-4" />
              New Licence
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search licences..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredLicences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? 'No licences found matching your search.' : 'No licences yet. Create your first licence!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLicences.map((licence) => {
            const imageUrl = licence.image_id 
              ? `https://divlxdqckjoijfmeydvo.supabase.co/storage/v1/object/public/portfolio-assets/licences/${licence.image_id}`
              : "https://picsum.photos/seed/licence/600/400";
            
            return (
              <Card key={licence.id} className="flex flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={imageUrl}
                    alt={licence.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">{licence.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(licence.issue_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {licence.issuer}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {licence.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full justify-between items-center">
                    <div className="flex gap-2">
                      {licence.credential_url && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={licence.credential_url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/licences/${licence.id}`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(licence.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
