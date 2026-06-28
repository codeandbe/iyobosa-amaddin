'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { getSkillCategories } from '@/lib/skills';
import { EmptyState, LoadingState } from '@/components/ui/content-states';
import { Code } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

const SkillsSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSkillCategories()
      .then(setCategories)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="skills" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        <SectionHeader 
          badge="Technical Skills"
          headline="Expertise Across Full-Stack, AI, Automation, and Data"
        />
        
        {loading ? (
          <LoadingState message="Loading skills..." />
        ) : error ? (
          <EmptyState title="Could not load skills" description="Check your Supabase connection and try again." />
        ) : categories.length === 0 ? (
          <EmptyState title="No skills yet" description="Add skill categories in the admin dashboard." />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {categories.map((skillCategory, index) => (
              <AnimatedSection key={skillCategory.id} delay={index * 100}>
                <GlassCard glow>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        <DynamicIcon 
                          name={skillCategory.icon || 'Code'} 
                          className="h-6 w-6 text-cyan-400" 
                        />
                      </div>
                      <span className="font-headline text-2xl">{skillCategory.category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillCategory.skills.map((skill: { id: string; name: string; proficiency: number }) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-300">{skill.name}</span>
                          <span className="text-xs text-cyan-400 font-mono">{skill.proficiency}%</span>
                        </div>
                        <Progress 
                          value={skill.proficiency} 
                          className="h-2 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-cyan-600"
                        />
                      </div>
                    ))}
                  </CardContent>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
