'use client';

import { getSocialLinks } from "@/lib/social";
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';

const SocialSection = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const data = await getSocialLinks();
        setLinks(data);
      } catch (error) {
        console.error('Error loading social links:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, []);

  if (loading) {
    return (
      <section id="social" className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Connect With Me
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find me on these platforms
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (links.length === 0) {
    return null; // Don't show section if no active links
  }

  return (
    <section id="social" className="py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Connect With Me
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find me on these platforms
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-card border rounded-xl hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 hover:scale-110"
              aria-label={link.platform}
            >
              <DynamicIcon 
                name={link.icon} 
                className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground group-hover:text-foreground transition-colors" 
              />
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Or send me a message through the{' '}
            <a href="#contact" className="text-foreground hover:text-primary underline underline-offset-4 transition-colors">
              contact form
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
