import { getAwards } from '@/lib/awards';
import { resolveImageUrl } from '@/lib/utils/image-url';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import AwardCard from '@/components/cards/AwardCard';
import OptimizedImage from '@/components/ui/OptimizedImage';
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
          {awards.map((award, index) => (
            <AnimatedSection key={award.id} delay={index * 100}>
              <div className="p-1">
                <AwardCard award={award as any} />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsHome;
