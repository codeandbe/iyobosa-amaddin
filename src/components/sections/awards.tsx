import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAwards } from "@/lib/awards";
import { ExternalLink, Calendar } from "lucide-react";
import OptimizedImage from '@/components/ui/OptimizedImage';
import { resolveImageUrl } from '@/lib/utils/image-url';
import Link from "next/link";

const AwardsSection = async () => {
    const awards = await getAwards();

    return (
        <section id="awards" className="py-20 md:py-28">
            <div className="container mx-auto">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                        Awards & Achievements
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Recognition and achievements that highlight my professional journey.
                    </p>
                </div>

                {awards.length === 0 ? (
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground">No awards available yet.</p>
                    </div>
                ) : (
                    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {awards.map((award) => {
                            const imageUrl = resolveImageUrl((award as any).image_url, award.image_id ? `awards/${award.image_id}` : null);
                            
                            return (
                                <Card key={award.id} className="flex flex-col overflow-hidden">
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <OptimizedImage
                                            src={imageUrl ?? undefined}
                                            alt={award.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={false}
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-xl">{award.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(award.date_awarded).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </CardDescription>
                                        <CardDescription className="text-sm font-medium text-primary">
                                            {award.issuer}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {award.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex w-full justify-start gap-2">
                                            {award.certificate_url && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={award.certificate_url} target="_blank">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        View Certificate
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

export default AwardsSection;
