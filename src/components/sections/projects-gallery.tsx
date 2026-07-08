'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { getProjects, getProjectCategories, type Project } from '@/lib/projects';
import { getProjectImageUrl } from '@/lib/cms-utils';
import { resolveImageUrl } from '@/lib/utils/image-url';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/content-states';
import { Github, ExternalLink, Star, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [projectData, categoryData] = await Promise.all([
          getProjects(),
          getProjectCategories(),
        ]);
        setProjects(projectData);
        setCategories(categoryData);
      } catch {
        setError('Failed to load projects from the database.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  if (loading) return <LoadingState message="Loading projects..." />;
  if (error) return <ErrorState message={error} />;
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects published yet"
        description="Add and publish projects in the admin dashboard to showcase your work here."
      />
    );
  }

  return (
    <section id="projects" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        <SectionHeader 
          badge="CodeAndBe Projects"
          headline="Systems Built Across AI, Web, Automation, and Client Work"
          description="Explore real projects built across AgriTech, cybersecurity, education, healthcare, CMS platforms, and automation."
        />

        {categories.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {['All', ...categories].map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full',
                  activeCategory === cat 
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-500' 
                    : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20'
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            title="No projects in this category"
            description="Try selecting a different category filter."
            className="mt-8"
          />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => {
              const imageUrl = resolveImageUrl(project.image_url ?? null, project.image_id ? `projects/${project.image_id}` : null);
              return (
                <AnimatedSection key={project.id} delay={index * 100}>
                  <Card className="flex flex-col overflow-hidden bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                      <OptimizedImage
                        src={imageUrl ?? undefined}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {project.featured && (
                        <Badge className="absolute top-3 right-3 gap-1 bg-cyan-500/90 text-slate-950 border-cyan-500">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          {project.category && (
                            <Badge className="text-xs bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                              {project.category}
                            </Badge>
                          )}
                          {project.release_tag && (
                            <Badge variant="outline" className="text-xs gap-1 border-cyan-500/30 text-cyan-400">
                              <Tag className="h-3 w-3" />
                              {project.release_tag}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-slate-300">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack?.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs border-slate-600 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {(project.role || project.my_role) && (
                        <div>
                          <p className="text-xs font-semibold text-cyan-400 mb-1">Role</p>
                          <p className="text-sm text-slate-300 line-clamp-2">{project.role || project.my_role}</p>
                        </div>
                      )}
                      {project.problem && (
                        <div>
                          <p className="text-xs font-semibold text-cyan-400 mb-1">Problem</p>
                          <p className="text-sm text-slate-300 line-clamp-2">{project.problem}</p>
                        </div>
                      )}
                      {project.outcome && (
                        <div>
                          <p className="text-xs font-semibold text-cyan-400 mb-1">Outcome</p>
                          <p className="text-sm text-slate-300 line-clamp-2">{project.outcome}</p>
                        </div>
                      )}
                      {project.release_date && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          Released: {new Date(project.release_date).toLocaleDateString()}
                        </div>
                      )}
                      {project.status && (
                        <p className="text-xs text-slate-400">Status: {project.status}</p>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      {project.github_url && (
                        <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" asChild>
                          <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </Link>
                        </Button>
                      )}
                      {project.live_url && (
                        <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" asChild>
                          <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
