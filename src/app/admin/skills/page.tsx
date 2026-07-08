"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSkillCategories, deleteSkillCategory } from "@/lib/skills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useToast } from "@/hooks/use-toast";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getSkillCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading skill categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load skill categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the "${categoryName}" category and all its skills?`)) {
      return;
    }

    try {
      await deleteSkillCategory(id);
      toast({
        title: 'Success',
        description: 'Skill category deleted successfully',
      });
      loadCategories();
    } catch (error) {
      console.error('Error deleting skill category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete skill category',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-cyan-400">Skills Management</h2>
          <p className="text-slate-400 mt-2">Manage your skill categories and individual skills</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950" asChild>
            <Link href="/admin/skills/category/new">
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Link>
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No skill categories yet</h3>
            <p className="text-muted-foreground mb-4">Create your first skill category to get started.</p>
            <Button asChild>
              <Link href="/admin/skills/category/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DynamicIcon name={category.icon || 'Code'} className="h-8 w-8 text-cyan-400" />
                    <div>
                      <CardTitle className="font-headline text-xl">{category.category}</CardTitle>
                      <CardDescription>{category.skills.length} skills</CardDescription>
                    </div>
                  </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/skills/category/${category.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteCategory(category.id, category.category)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill: any) => (
                        <Badge key={skill.id} variant="secondary" className="text-sm">
                          {skill.name} ({skill.proficiency}%)
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/admin/skills/category/${category.id}/skills`}>
                        Manage Skills
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
      )}
    </div>
  );
}
