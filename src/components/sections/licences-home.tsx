import { getLicences } from '@/lib/licences';
import { resolveImageUrl } from '@/lib/utils/image-url';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Award, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import LicenceCard from '@/components/cards/LicenceCard';
import OptimizedImage from '@/components/ui/OptimizedImage';
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
          {licences.map((licence, index) => (
            <AnimatedSection key={licence.id} delay={index * 100}>
              <div className="p-1">
                <LicenceCard licence={licence as any} />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LicencesHome;
