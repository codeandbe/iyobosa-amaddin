import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Star, Zap, Award, BookOpen } from "lucide-react";
import { getPublicStats } from "@/lib/stats";

const StatsStrip = async () => {
  const stats = await getPublicStats();

  const statCards = [
    { value: stats.publishedProjects, label: "Projects Built", icon: FolderOpen },
    { value: stats.featuredProjects, label: "Featured Projects", icon: Star },
    { value: stats.skills, label: "Skills", icon: Zap },
    { value: stats.certifications, label: "Certifications", icon: Award },
    { value: stats.publishedBlogPosts, label: "Blog Posts", icon: BookOpen },
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Icon className="h-6 w-6 text-cyan-400" />
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
