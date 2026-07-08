'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from '@/components/ui/section-header';
import { AnimatedSection } from '@/components/ui/animated-section';
import { getBlogPosts } from "@/lib/blog";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import OptimizedImage from '@/components/ui/OptimizedImage';
import { resolveImageUrl } from '@/lib/utils/image-url';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { EmptyState, LoadingState } from '@/components/ui/content-states';
import { Badge } from '@/components/ui/badge';

const BlogSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto">
          <SectionHeader 
            badge="From the Blog"
            headline="Sharing Insights on Technology, Development, and More"
          />
          <LoadingState message="Loading blog posts..." />
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section id="blog" className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto">
          <SectionHeader 
            badge="From the Blog"
            headline="Sharing Insights on Technology, Development, and More"
          />
          <EmptyState title="No blog posts yet" description="Publish blog posts in the admin dashboard." />
        </div>
      </section>
    );
  }

  return (
        <section id="blog" className="relative py-20 md:py-28 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto relative">
                <SectionHeader 
                  badge="From the Blog"
                  headline="Sharing Insights on Technology, Development, and More"
                />

                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <AnimatedSection key={post.id} delay={index * 100}>
                          <Card className="flex flex-col bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">
                              <CardHeader>
                                    {post.image_url && (
                                      <div className="w-full h-48 bg-slate-800 rounded-lg mb-4 overflow-hidden">
                                        <OptimizedImage
                                        src={resolveImageUrl(post.image_url, post.image_id ?? null)}
                                        alt={post.title}
                                        fill={false}
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                      </div>
                                    )}
                                  {post.category && (
                                    <Badge className="w-fit bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs mb-2">
                                      {post.category}
                                    </Badge>
                                  )}
                                  <CardTitle className="font-headline text-xl">{post.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-grow space-y-4">
                                  <CardDescription className="text-slate-300">{post.excerpt}</CardDescription>
                                  {post.published_at && (
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(post.published_at).toLocaleDateString()}
                                      </div>
                                      {post.reading_time && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {post.reading_time} min read
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </CardContent>
                              <CardFooter>
                                  <Button variant="link" asChild className="p-0 text-cyan-400 hover:text-cyan-300">
                                      <Link href={post.url || '#'}>
                                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                                      </Link>
                                  </Button>
                              </CardFooter>
                          </Card>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
  );
};

export default BlogSection;
