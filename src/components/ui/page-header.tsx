import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  badge: string;
  headline: string;
  description?: string;
  stats?: Array<{ label: string; value: string }>;
  className?: string;
}

export function PageHeader({ badge, headline, description, stats, className }: PageHeaderProps) {
  return (
    <div className={cn('text-center space-y-6 mb-12', className)}>
      <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/20 px-4 py-2 text-sm">
        {badge}
      </Badge>
      <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
        {headline}
      </h1>
      {description && (
        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>
      )}
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8 pt-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-headline text-2xl sm:text-3xl font-bold text-cyan-400">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
