"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "@/lib/stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/content-states";
import {
  User, Award, FileText, Wrench, Briefcase, PenTool, BookOpen, MessageSquare,
  FolderKanban, Star, Mail, Settings,
} from "lucide-react";

const sections = [
  { href: "/admin/hero", title: "Hero", description: "Landing headline and CTAs", icon: User, color: "text-cyan-500" },
  { href: "/admin/about", title: "About Me", description: "Bio, title, and profile image", icon: User, color: "text-blue-500" },
  { href: "/admin/projects", title: "Projects", description: "Featured portfolio projects", icon: Briefcase, color: "text-orange-500" },
  { href: "/admin/skills", title: "Skills", description: "Categories and proficiency", icon: Wrench, color: "text-purple-500" },
  { href: "/admin/experience", title: "Experience", description: "Work history and education", icon: PenTool, color: "text-indigo-500" },
  { href: "/admin/blog", title: "Blog", description: "Articles and external links", icon: BookOpen, color: "text-pink-500" },
  { href: "/admin/awards", title: "Awards", description: "Achievements and recognition", icon: Award, color: "text-yellow-500" },
  { href: "/admin/licences", title: "Licenses", description: "Certifications and credentials", icon: FileText, color: "text-green-500" },
  { href: "/admin/social", title: "Social Links", description: "GitHub, LinkedIn, and more", icon: MessageSquare, color: "text-teal-500" },
  { href: "/admin/contact", title: "Messages", description: "Contact form inbox", icon: Mail, color: "text-red-400" },
  { href: "/admin/settings", title: "Settings", description: "Site configuration", icon: Settings, color: "text-slate-400" },
];

const statCards = (stats: DashboardStats) => [
  { label: "Total Projects", value: stats.totalProjects, icon: FolderKanban },
  { label: "Published", value: stats.publishedProjects, icon: Briefcase },
  { label: "Featured", value: stats.featuredProjects, icon: Star },
  { label: "Blog Posts", value: stats.blogPosts, icon: BookOpen },
  { label: "Messages", value: stats.contactMessages, icon: Mail },
  { label: "Skills", value: stats.skills, icon: Wrench },
];

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline text-cyan-400">Admin Dashboard</h2>
        <p className="text-slate-400 mt-2">
          Manage IYOBOSA MAJID AMADDIN / CodeAndBe portfolio content
        </p>
        {stats && stats.unreadMessages > 0 && (
          <p className="text-sm text-cyan-400 mt-1">
            {stats.unreadMessages} unread contact message{stats.unreadMessages !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards(stats).map(({ label, value, icon: Icon }) => (
            <Card key={label} className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-slate-400">
                  <Icon className="h-4 w-4 text-cyan-400" />
                  {label}
                </CardDescription>
                <CardTitle className="text-3xl text-white">{value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Quick Edit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800/50 border-slate-700 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
                        <Icon className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <CardTitle className="text-base text-white">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">{section.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
