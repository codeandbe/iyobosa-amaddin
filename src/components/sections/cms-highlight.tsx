import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Layout, Shield, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Supabase Database",
    description: "PostgreSQL-powered backend with Row Level Security for secure data access",
    icon: Database,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Admin Dashboard",
    description: "Full CRUD content management with authentication and real-time updates",
    icon: Layout,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Secure Auth",
    description: "Supabase Auth integration with protected admin routes and session management",
    icon: Shield,
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "Image Storage",
    description: "Supabase Storage for project images with CDN delivery and optimized loading",
    icon: Zap,
    color: "from-orange-500/20 to-red-500/20",
  },
];

export default function CMSHighlight() {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/20">
              CMS-Powered Portfolio
            </Badge>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">
              This portfolio is built with a custom CMS
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Every piece of content on this site — projects, skills, blog posts, and more — is managed through a Supabase-backed admin dashboard. No code changes needed to update content.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium" asChild>
                <Link href="/admin">
                  Explore Admin
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
                <Link href="https://github.com/codeandbe" target="_blank" rel="noopener noreferrer">
                  View Source
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={`bg-gradient-to-br ${feature.color} border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
