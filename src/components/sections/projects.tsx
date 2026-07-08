import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/lib/projects";
import { Github, ExternalLink } from "lucide-react";
import OptimizedImage from '@/components/ui/OptimizedImage';
import { resolveImageUrl } from '@/lib/utils/image-url';
import Link from "next/link";

const ProjectsSection = async () => {
    const projects = await getProjects();

    return (
        <section id="projects" className="py-20 md:py-28">
            <div className="container mx-auto">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                        Featured Projects
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A selection of projects that showcase my passion for building.
                    </p>
                </div>

                {projects.length === 0 ? (
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground">No projects available yet.</p>
                    </div>
                ) : (
                    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => {
                            const imageUrl = resolveImageUrl(project.image_url ?? null, project.image_id ? `projects/${project.image_id}` : null);
                            
                            return (
                                <Card key={project.id} className="flex flex-col overflow-hidden">
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <OptimizedImage
                                            src={imageUrl ?? undefined}
                                            alt={project.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={false}
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
                                        <CardDescription>{project.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech_stack.map((tech: string) => (
                                                <Badge key={tech} variant="secondary">{tech}</Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex w-full justify-start gap-2">
                                            {project.github_url && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={project.github_url} target="_blank">
                                                        <Github className="mr-2 h-4 w-4" />
                                                        GitHub
                                                    </Link>
                                                </Button>
                                            )}
                                            {project.live_url && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={project.live_url} target="_blank">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Live Demo
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProjectsSection;
