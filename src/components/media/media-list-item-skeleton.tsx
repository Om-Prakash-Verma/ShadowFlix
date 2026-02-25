'use client'

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MediaListItemSkeleton() {
  return (
    <Card className="flex items-start gap-4 p-3 bg-card/80 rounded-lg h-[158px] md:h-[182px]">
        <div className="w-24 md:w-28 flex-shrink-0">
            <Skeleton className="aspect-[2/3] rounded-md" />
        </div>
        <div className="flex-grow space-y-2 mt-1 w-full">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full mt-4" />
        </div>
    </Card>
  );
}
