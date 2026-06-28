import ExperienceSection from '@/components/sections/experience';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function ExperiencePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="flex-1">
        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
}
