import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLicences } from "@/lib/licences";
import { BadgeCheck, ExternalLink, Calendar } from "lucide-react";
import OptimizedImage from '@/components/ui/OptimizedImage';
import { resolveImageUrl } from '@/lib/utils/image-url';
import Link from "next/link";
import { Button } from "../ui/button";

const CertificationsSection = async () => {
    const licences = await getLicences();

    return (
        <section id="certifications" className="bg-muted/30 py-20 md:py-28">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                        Licenses & Certifications
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Validating expertise through continuous learning.
                    </p>
                </div>
                
                {licences.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No certifications available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {licences.map((licence) => {
                            const imageUrl = resolveImageUrl((licence as any).image_url, licence.image_id ? `licences/${licence.image_id}` : null);
                            
                            return (
                                <Card key={licence.id} className="flex flex-col overflow-hidden">
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <OptimizedImage
                                            src={imageUrl ?? undefined}
                                            alt={`Badge for ${licence.title}`}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={false}
                                        />
                                    </div>
                                    <CardHeader className="flex-grow">
                                        <div className="flex items-start gap-4">
                                            <BadgeCheck className="mt-1 h-8 w-8 text-primary" />
                                            <div>
                                                <CardTitle className="font-headline text-xl">{licence.title}</CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{licence.issuer}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Issued: {new Date(licence.issue_date).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                    {licence.expiry_date && (
                                                        <span className="ml-2">
                                                            • Expires: {new Date(licence.expiry_date).toLocaleDateString('en-US', { 
                                                                year: 'numeric', 
                                                                month: 'short', 
                                                                day: 'numeric' 
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {licence.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex w-full justify-start gap-2">
                                            {licence.credential_url && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={licence.credential_url} target="_blank">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        Show Credential
                                                    </Link>
                                                </Button>
                                            )}
                                            {licence.credential_id && (
                                                <Button variant="outline" size="sm" className="ml-2">
                                                    ID: {licence.credential_id}
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
};

export default CertificationsSection;
