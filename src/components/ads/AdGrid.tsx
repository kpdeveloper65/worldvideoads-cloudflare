import { AdCard, AdCardData } from './AdCard';
import { cn } from '@/lib/utils';

interface AdGridProps {
  ads: AdCardData[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  emptyMessage?: string;
  variant?: 'default' | 'compact' | 'wide' | 'featured';
  showStats?: boolean;
  loading?: boolean;
  loadingCount?: number;
}

function AdCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="aspect-video w-full shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 shimmer rounded-full" />
        <div className="h-4 w-full shimmer rounded-lg" />
        <div className="h-4 w-3/4 shimmer rounded-lg" />
        <div className="h-3 w-1/2 shimmer rounded-full mt-3" />
      </div>
    </div>
  );
}

export function AdGrid({
  ads,
  columns = 4,
  className,
  emptyMessage = 'No ads found.',
  variant = 'default',
  showStats = true,
  loading = false,
  loadingCount = 8,
}: AdGridProps) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  }[columns];

  if (loading) {
    return (
      <div className={cn('grid gap-5', gridClass, className)}>
        {Array.from({ length: loadingCount }).map((_, i) => (
          <AdCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">🎬</span>
        </div>
        <p className="text-base font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-5', gridClass, className)}>
      {ads.map((ad, idx) => (
        <AdCard
          key={ad.id}
          ad={ad}
          priority={idx < 4}
          variant={variant}
          showStats={showStats}
        />
      ))}
    </div>
  );
}
