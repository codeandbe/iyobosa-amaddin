import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false }: GlassCardProps) {
  return (
    <Card
      className={cn(
        'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-xl',
        glow && 'hover:shadow-cyan-500/10 transition-shadow duration-300',
        className
      )}
    >
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
