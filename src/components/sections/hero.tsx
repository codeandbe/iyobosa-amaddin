import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Github, ArrowRight, Database, Cpu, Globe, Zap, Layout, Code, Bot } from "lucide-react";
import Link from "next/link";
import { getHeroSection } from "@/lib/hero";
import { getPublicStats } from "@/lib/stats";
import { BRAND } from "@/lib/fallbacks";

const HeroSection = async () => {
  const hero = await getHeroSection();
  const stats = await getPublicStats();

  // Hero content from Supabase database with fallbacks
  const badge = hero?.tagline ?? "CodeAndBe Portfolio";
  const headline = hero?.title ?? "Building Real Systems With Code, AI, and Automation.";

  // subtitle field: Used for identity/title line (name and roles), NOT a description paragraph
  const identityLine = hero?.subtitle ?? "Iyobosa Majid Amaddin · Full-Stack Developer · AI Systems Builder · Automation Developer";

  // description field: The main hero paragraph - this is the ONLY description shown
  const description = hero?.description ?? "I build CMS-powered websites, AI-integrated tools, automation workflows, and secure digital platforms that turn complex ideas into reliable products.";

  const primaryLabel = hero?.cta_primary_label ?? "View Projects";
  const primaryUrl = hero?.cta_primary_url ?? "/projects";
  const secondaryLabel = hero?.cta_secondary_label ?? "Explore CMS";
  const secondaryUrl = hero?.cta_secondary_url ?? "/admin";
  const tertiaryLabel = hero?.cta_tertiary_label ?? "Contact Me";
  const tertiaryUrl = hero?.cta_tertiary_url ?? "/contact";

  // Helper function to render headline with gradient highlight
  const renderHeadline = (text: string) => {
    const highlight = "Code, AI, and Automation";
    if (text.includes(highlight)) {
      const [before, after] = text.split(highlight);
      return (
        <>
          {before}
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
            {highlight}
          </span>
          {after}
        </>
      );
    }
    return text;
  };

  const techBadges = [
    { name: "Next.js", icon: Layout },
    { name: "TypeScript", icon: Code },
    { name: "Supabase", icon: Database },
    { name: "Python", icon: Bot },
    { name: "React", icon: Cpu },
    { name: "AI", icon: Zap },
    { name: "WordPress", icon: Globe },
  ];

  const dashboardCards = [
    { title: "Featured Projects", value: stats.featuredProjects.toString(), icon: Globe, color: "from-cyan-500/20 to-blue-500/20" },
    { title: "CMS Admin", value: "Live", icon: Layout, color: "from-purple-500/20 to-pink-500/20" },
    { title: "Supabase Backend", value: "Connected", icon: Database, color: "from-green-500/20 to-emerald-500/20" },
    { title: "AI Integrations", value: "Active", icon: Bot, color: "from-orange-500/20 to-red-500/20" },
  ];

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto py-20 md:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/20 px-4 py-2 text-sm">
              {badge}
            </Badge>
            
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              {renderHeadline(headline)}
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              {identityLine}
            </p>
            
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium" asChild>
                <Link href={primaryUrl}>
                  {primaryLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20" asChild>
                <Link href={secondaryUrl}>{secondaryLabel}</Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800" asChild>
                <Link href={tertiaryUrl}>{tertiaryLabel}</Link>
              </Button>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {techBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Badge key={badge.name} variant="secondary" className="gap-1.5 px-3 py-1.5 bg-slate-800/50 border-slate-700 text-slate-300 text-xs font-medium">
                    <Icon className="h-3 w-3" />
                    {badge.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="relative">
              {/* Glassmorphism card */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-2xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-slate-500 font-mono">codeandbe.dev</span>
                  </div>

                  {/* Dashboard cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {dashboardCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.title} className={`bg-gradient-to-br ${card.color} rounded-lg p-4 border border-white/10`}>
                          <Icon className="h-5 w-5 text-white mb-2" />
                          <p className="text-xs text-slate-300">{card.title}</p>
                          <p className="text-sm font-semibold text-white">{card.value}</p>
                        </div>
                      );
                    })}
                  </div>

                </CardContent>
              </Card>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 animate-bounce" style={{ animationDuration: "3s" }}>
                <Zap className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 animate-bounce" style={{ animationDuration: "3s", animationDelay: "1.5s" }}>
                <Bot className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
