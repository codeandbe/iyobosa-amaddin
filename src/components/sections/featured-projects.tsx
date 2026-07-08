import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getFeaturedProjects } from '@/lib/projects';
import { resolveImageUrl } from '@/lib/utils/image-url';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { getFeaturedProjectsHomeLimit } from '@/lib/site-settings';
import { Github, ExternalLink, Star, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/content-states';

const FeaturedProjectsSection = async () => {
  const limit = await getFeaturedProjectsHomeLimit();
  const projects = await getFeaturedProjects(limit);

  return (
    <section id="featured-projects" className="py-20 md:py-28 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center">
          <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
            CodeAndBe Portfolio
          </Badge>
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world systems spanning AgriTech, AI, cybersecurity, EdTech, and client platforms.
          </p>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No featured projects yet"
            description="Mark projects as featured in the admin dashboard to highlight them here."
          />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const imageUrl = resolveImageUrl(project.image_url ?? null, project.image_id ? `projects/${project.image_id}` : null);
              return (
                <Card key={project.id} className="flex flex-col overflow-hidden border-border/60 hover:border-primary/30 transition-colors">
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <OptimizedImage
                      src={imageUrl ?? undefined}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/90 gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        {project.category && (
                          <Badge variant="secondary" className="text-xs">
                            {project.category}
                          </Badge>
                        )}
                        {project.release_tag && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Tag className="h-3 w-3" />
                            {project.release_tag}
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-primary/90 gap-1 shrink-0">
                        <Star className="h-3 w-3" />
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.slice(0, 5).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {(project.tech_stack?.length ?? 0) > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tech_stack.length - 5}
                        </Badge>
                      )}
                    </div>
                    {(project.role || project.my_role) && (
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">Role</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.role || project.my_role}</p>
                      </div>
                    )}
                    {project.release_date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Released: {new Date(project.release_date).toLocaleDateString()}
                      </div>
                    )}
                    {project.status && (
                      <p className="text-xs text-muted-foreground">Status: {project.status}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    {project.github_url && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Link>
                      </Button>
                    )}
                    {project.live_url && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href="/projects">All projects</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
