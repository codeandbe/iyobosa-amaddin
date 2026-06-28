import CodeExplainerSection from '@/components/sections/code-explainer';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function AiPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="flex-1">
        <CodeExplainerSection />
      </main>
      <Footer />
    </div>
  );
}
