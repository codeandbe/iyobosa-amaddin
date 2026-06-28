import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, Bot, Database, Globe } from "lucide-react";

const capabilities = [
  {
    title: "Full-Stack Web Apps",
    description: "End-to-end web applications with modern frameworks, responsive design, and scalable architecture.",
    icon: Layout,
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
  },
  {
    title: "AI-Integrated Systems",
    description: "AI-powered tools and automation workflows using Python, machine learning, and intelligent APIs.",
    icon: Bot,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    title: "CMS & Admin Dashboards",
    description: "Content management systems with authentication, CRUD operations, and real-time data synchronization.",
    icon: Database,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
  {
    title: "Client Business Websites",
    description: "Professional websites and digital experiences for businesses across healthcare, education, and tech.",
    icon: Globe,
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
  },
];

export default function WhatIBuild() {
  return (
    <section className="py-20 md:py-28 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            What I Build
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real-world systems and digital products that solve business problems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <Card
                key={capability.title}
                className={`bg-gradient-to-br ${capability.color} ${capability.borderColor} border backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${capability.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 leading-relaxed">{capability.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
