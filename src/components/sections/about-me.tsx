import OptimizedImage from '@/components/ui/OptimizedImage';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Download } from "lucide-react";
import { getAboutMeSection } from "@/lib/about";
import { getSocialLinks } from "@/lib/social";
import { BRAND } from "@/lib/fallbacks";
import { DynamicIcon } from '@/components/ui/dynamic-icon';

const AboutMeSection = async () => {
  const about = await getAboutMeSection();
  const socialLinks = await getSocialLinks();

  const imageUrl = about?.profile_image_url ?? 'https://picsum.photos/seed/codeandbe/400/400';
  const headline = about?.headline ?? `About ${BRAND.name}`;
  const title = about?.title ?? BRAND.title;
  const bio = about?.bio ?? BRAND.bio;
  const highlights = about?.highlights?.length ? about.highlights : [...BRAND.positioning];

  return (
    <section id="about" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="overflow-hidden rounded-lg border-primary/10">
              <div className="relative aspect-square w-full">
                <OptimizedImage
                  src={imageUrl}
                  alt={BRAND.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary">{BRAND.brand}</Badge>
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>
            <p className="mt-2 text-primary font-medium">{title}</p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{bio}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <Badge key={item} variant="secondary">{item}</Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href="/resume.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </a>
              </Button>
              {socialLinks.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {socialLinks.map((link) => (
                    <Button key={link.id} variant="outline" size="lg" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                        <DynamicIcon name={link.icon} className="h-5 w-5" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
