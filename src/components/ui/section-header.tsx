import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badge?: string;
  headline: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ badge, headline, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('text-center space-y-4 mb-12', className)}>
      {badge && (
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/20 px-4 py-2 text-sm">
          {badge}
        </Badge>
      )}
      <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">{headline}</h2>
      {description && (
        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
