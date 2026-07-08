"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getExperience, getEducation, deleteExperience, deleteEducation } from "@/lib/experience";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Briefcase, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [experienceData, educationData] = await Promise.all([
        getExperience(),
        getEducation()
      ]);
      setExperience(experienceData);
      setEducation(educationData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load experience and education',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" experience?`)) return;

    try {
      await deleteExperience(id);
      toast({
        title: 'Success',
        description: 'Experience deleted successfully',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete experience',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEducation = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" education?`)) return;

    try {
      await deleteEducation(id);
      toast({
        title: 'Success',
        description: 'Education deleted successfully',
      });
      loadData();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete education',
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
          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-cyan-400">Experience Management</h2>
          <p className="text-slate-400 mt-2">Manage your work experience and education</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950" asChild>
            <Link href="/admin/experience/experience/new">
              <Briefcase className="mr-2 h-4 w-4" />
              Add Experience
            </Link>
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950" asChild>
            <Link href="/admin/experience/education/new">
              <GraduationCap className="mr-2 h-4 w-4" />
              Add Education
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience ({experience.length})
            </CardTitle>
            <CardDescription>Your professional work history</CardDescription>
          </CardHeader>
          <CardContent>
            {experience.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No work experience added yet.</p>
                <Button asChild>
                  <Link href="/admin/experience/experience/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Experience
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {experience.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.role}</h4>
                      <p className="text-sm text-muted-foreground">{item.company}</p>
                      <p className="text-sm text-muted-foreground">{item.period}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/experience/experience/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExperience(item.id, item.role)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href="/admin/experience/experience/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Experience
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education ({education.length})
            </CardTitle>
            <CardDescription>Your educational background</CardDescription>
          </CardHeader>
          <CardContent>
            {education.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No education added yet.</p>
                <Button asChild>
                  <Link href="/admin/experience/education/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Education
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.degree}</h4>
                      <p className="text-sm text-muted-foreground">{item.institution}</p>
                      <p className="text-sm text-muted-foreground">{item.period}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/experience/education/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEducation(item.id, item.degree)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href="/admin/experience/education/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Education
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
