import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface TechBadgeProps {
  name: string;
  icon?: LucideIcon;
  className?: string;
}

export function TechBadge({ name, icon: Icon, className }: TechBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1.5 px-3 py-1.5 bg-slate-800/50 border-slate-700 text-slate-300 text-xs font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-colors',
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {name}
    </Badge>
  );
}
