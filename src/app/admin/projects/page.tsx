'use client';

import { useState, useEffect } from 'react';
import {
  getAllProjects,
  deleteProject,
  toggleProjectPublished,
  toggleProjectFeatured,
  type Project,
} from '@/lib/projects';
import { getProjectImageUrl } from '@/lib/cms-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { LoadingState, EmptyState } from '@/components/ui/content-states';
import { Plus, Pencil, Trash2, ExternalLink, Github, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setProjects(await getAllProjects());
    } catch {
      toast({ title: 'Error', description: 'Failed to load projects', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId);
      setProjects((p) => p.filter((x) => x.id !== deleteId));
      toast({ title: 'Deleted', description: 'Project removed successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggle = async (id: string, field: 'published' | 'featured', value: boolean) => {
    try {
      const updated = field === 'published'
        ? await toggleProjectPublished(id, value)
        : await toggleProjectFeatured(id, value);
      setProjects((p) => p.map((x) => (x.id === id ? updated : x)));
      toast({ title: 'Updated', description: `Project ${field} status updated` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update project', variant: 'destructive' });
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingState message="Loading projects..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-cyan-400">Projects</h1>
          <p className="text-slate-400 mt-2">Manage portfolio projects, ordering, and visibility</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950" asChild>
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Link>
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search by title or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <EmptyState title="No projects found" description="Create your first project to get started." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project) => (
            <Card key={project.id}>
              <div className="relative h-40 w-full">
                <Image src={getProjectImageUrl(project)} alt={project.title} fill className="object-cover rounded-t-lg" />
                {project.featured && (
                  <Badge className="absolute top-2 right-2 gap-1"><Star className="h-3 w-3" />Featured</Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {project.category && <Badge variant="secondary" className="mb-1 text-xs">{project.category}</Badge>}
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Order: {project.sort_order} · {project.slug}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={project.published} onCheckedChange={(v) => handleToggle(project.id, 'published', v)} id={`pub-${project.id}`} />
                    <Label htmlFor={`pub-${project.id}`} className="text-xs">Published</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={project.featured} onCheckedChange={(v) => handleToggle(project.id, 'featured', v)} id={`feat-${project.id}`} />
                    <Label htmlFor={`feat-${project.id}`} className="text-xs">Featured</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4 text-muted-foreground hover:text-foreground" /></a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" /></a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/projects/${project.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => setDeleteId(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
