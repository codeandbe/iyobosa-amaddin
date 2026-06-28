import { Button } from "@/components/ui/button";
import { Mail, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Have a project, idea, or platform to build?
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Let's collaborate to bring your vision to life. From full-stack web applications to AI-integrated systems and custom CMS platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-lg px-8" asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8" asChild>
              <Link href="https://github.com/codeandbe" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                View GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
