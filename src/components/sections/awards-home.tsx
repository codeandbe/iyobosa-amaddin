import { getAwards } from '@/lib/awards';
import { resolveImageUrl } from '@/lib/utils/image-url';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AwardsHome = async () => {
  const awards = await getAwards();

  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section id="awards" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        <SectionHeader 
          badge="Awards & Achievements"
          headline="Recognition & Milestones"
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => {
            const imageSrc = resolveImageUrl((award as any).image_url, award.image_id);
            
            return (
              <AnimatedSection key={award.id} delay={index * 100}>
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-6">
                    {/* Award Image */}
                    {imageSrc && (
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-slate-800/50">
                        <Image
                          src={imageSrc}
                          alt={award.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                  {/* Award Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-headline text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {award.title}
                      </h3>
                      {award.certificate_url && (
                        <Link 
                          href={award.certificate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                      {award.issuer}
                    </Badge>

                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {award.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(award.date_awarded).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AwardsHome;
