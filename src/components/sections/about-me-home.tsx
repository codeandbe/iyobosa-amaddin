import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getAboutMeSection } from '@/lib/about';
import { BRAND } from '@/lib/fallbacks';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import Image from 'next/image';
import { User, MapPin, Calendar, Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AboutMeHome = async () => {
  const about = await getAboutMeSection();

  // Use CMS data or fallback
  const headline = about?.headline ?? BRAND.headline;
  const title = about?.title ?? BRAND.title;
  const bio = about?.bio ?? BRAND.bio;
  const highlights = about?.highlights ?? BRAND.positioning;
  const profileImageUrl = about?.profile_image_url;

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        <SectionHeader 
          badge="About Me"
          headline={headline}
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Profile Image */}
          <AnimatedSection delay={100}>
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto lg:max-w-full">
                {profileImageUrl ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 shadow-2xl">
                    <Image
                      src={profileImageUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 shadow-2xl flex items-center justify-center">
                    <User className="h-32 w-32 text-slate-600" />
                  </div>
                )}
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <User className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column - Content */}
          <AnimatedSection delay={200} className="space-y-6">
            <div>
              <h3 className="font-headline text-2xl font-bold text-cyan-400 mb-2">{title}</h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{bio}</p>
            </div>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((highlight, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 px-3 py-1.5 text-sm"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm font-medium text-white">Remote / Global</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">Available</p>
                    <p className="text-sm font-medium text-white">For Projects</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" asChild>
                <Link href="https://github.com/codeandbe" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" asChild>
                <Link href="https://linkedin.com/in/codeandbe" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutMeHome;
