import HeroSection from '@/components/sections/hero';
import AboutMeHome from '@/components/sections/about-me-home';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import StatsStrip from '@/components/sections/stats-strip';
import FeaturedProjectsSection from '@/components/sections/featured-projects';
import WhatIBuild from '@/components/sections/what-i-build';
import CMSHighlight from '@/components/sections/cms-highlight';
import FinalCTA from '@/components/sections/final-cta';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutMeHome />
        <StatsStrip />
        <FeaturedProjectsSection />
        <WhatIBuild />
        <CMSHighlight />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
