'use client'

import { Skeleton } from '@/components/ui/skeleton';

export function PosterCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] rounded-poster bg-muted/50" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
