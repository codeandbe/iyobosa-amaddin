'use client';

import { useState, useEffect } from 'react';
import { getAwards, deleteAward, Award } from '@/lib/awards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Calendar } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { resolveImageUrl } from '@/lib/utils/image-url';
import Link from 'next/link';

export default function AwardsAdminPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const data = await getAwards();
      setAwards(data);
    } catch (error) {
      console.error('Error loading awards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load awards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this award?')) return;
    
    try {
      await deleteAward(id);
      setAwards(awards.filter(award => award.id !== id));
      toast({
        title: 'Success',
        description: 'Award deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting award:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete award',
        variant: 'destructive',
      });
    }
  };

  const filteredAwards = awards.filter(award =>
    award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Loading awards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline text-cyan-400">Awards & Achievements</h1>
          <p className="text-slate-400 mt-2">Manage your awards and achievements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950" asChild>
            <Link href="/admin/awards/new">
              <Plus className="mr-2 h-4 w-4" />
              New Award
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search awards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredAwards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? 'No awards found matching your search.' : 'No awards yet. Create your first award!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAwards.map((award) => {
            const imageUrl = resolveImageUrl((award as any).image_url, award.image_id ? `awards/${award.image_id}` : null);
            
            return (
              <Card key={award.id} className="flex flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <OptimizedImage
                    src={imageUrl ?? undefined}
                    alt={award.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">{award.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(award.date_awarded).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {award.issuer}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {award.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full justify-between items-center">
                    <div className="flex gap-2">
                      {award.certificate_url && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={award.certificate_url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/awards/${award.id}`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(award.id)}>
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
