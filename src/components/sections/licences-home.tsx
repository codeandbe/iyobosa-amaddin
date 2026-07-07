import { getLicences } from '@/lib/licences';
import { resolveImageUrl } from '@/lib/utils/image-url';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Award, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const LicencesHome = async () => {
  const licences = await getLicences();

  if (!licences || licences.length === 0) {
    return null;
  }

  return (
    <section id="licences" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        <SectionHeader 
          badge="Licenses & Certifications"
          headline="Professional Credentials"
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licences.map((licence, index) => {
            const imageSrc = resolveImageUrl((licence as any).image_url, licence.image_id);
            
            return (
              <AnimatedSection key={licence.id} delay={index * 100}>
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-6">
                    {/* License Image */}
                    {imageSrc && (
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-slate-800/50">
                        <Image
                          src={imageSrc}
                          alt={licence.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                  {/* License Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-headline text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {licence.title}
                      </h3>
                      {licence.credential_url && (
                        <Link 
                          href={licence.credential_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                      {licence.issuer}
                    </Badge>

                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {licence.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Issued: {new Date(licence.issue_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {licence.expiry_date && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          <span>
                            Expires: {new Date(licence.expiry_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {licence.credential_id && (
                      <div className="text-xs text-slate-500">
                        Credential ID: {licence.credential_id}
                      </div>
                    )}
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

export default LicencesHome;
