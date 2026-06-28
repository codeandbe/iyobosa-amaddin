'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { getExperience, getEducation } from "@/lib/experience";
import { Briefcase, GraduationCap } from "lucide-react";
import { useEffect, useState } from 'react';
import { EmptyState, LoadingState } from '@/components/ui/content-states';

const TimelineItem = ({
  icon: Icon,
  title,
  subtitle,
  period,
  description
}: {
  icon: React.ElementType,
  title: string,
  subtitle: string,
  period: string,
  description: string
}) => (
  <div className="relative pl-8">
    <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full bg-cyan-500 border-2 border-background shadow-lg shadow-cyan-500/50"></div>
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <Icon className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
            <p className="font-medium text-slate-300">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-cyan-400 font-mono mb-2">{period}</p>
        <p className="text-slate-300">{description}</p>
      </CardContent>
    </Card>
  </div>
);

const ExperienceSection = () => {
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [experienceData, educationData] = await Promise.all([
          getExperience(),
          getEducation()
        ]);
        setExperience(experienceData);
        setEducation(educationData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto">
          <SectionHeader 
            badge="My Journey"
            headline="Following My Path in Technology and Education"
          />
          <LoadingState message="Loading experience..." />
        </div>
      </section>
    );
  }

  if (experience.length === 0 && education.length === 0) {
    return (
      <section id="experience" className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto">
          <SectionHeader 
            badge="My Journey"
            headline="Following My Path in Technology and Education"
          />
          <EmptyState title="No experience added yet" description="Add work history and education in the admin dashboard." />
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        <SectionHeader 
          badge="My Journey"
          headline="Following My Path in Technology and Education"
        />

        <div className="relative grid gap-12 md:grid-cols-2">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent md:block"></div>
          
          {/* Experience Column */}
          <div className="md:pr-8">
            <h3 className="mb-8 text-center font-headline text-2xl font-bold md:text-left text-cyan-400">Experience</h3>
            <div className="relative space-y-8">
              <div className="absolute left-0 hidden h-full w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent md:block"></div>
              {experience.map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <TimelineItem icon={Briefcase} title={item.role} subtitle={item.company} period={item.period} description={item.description} />
                </AnimatedSection>
              ))}
            </div>
          </div>
          
          {/* Education Column */}
          <div className="md:pl-8">
            <h3 className="mb-8 text-center font-headline text-2xl font-bold md:text-left text-cyan-400">Education</h3>
            <div className="relative space-y-8">
              <div className="absolute left-0 hidden h-full w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent md:block"></div>
              {education.map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <TimelineItem icon={GraduationCap} title={item.degree} subtitle={item.institution} period={item.period} description={item.description} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
