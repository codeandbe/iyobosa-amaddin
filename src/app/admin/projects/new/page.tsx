'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import ProjectForm from '@/components/admin/project-form';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/projects');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Add New Project</h1>
            <p className="text-muted-foreground">
              Fill in the details below to add a new project to your portfolio.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Provide all the necessary information about your project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
