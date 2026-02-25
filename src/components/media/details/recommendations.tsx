
'use client'

import React, { useState } from 'react';
import type { Movie, TVShow } from '@/lib/tmdb-schemas';
import { PosterCard } from '@/components/media/poster-card';
import {
  CarouselProvider,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type RecommendationsProps = {
  id: number;
  type: 'movie' | 'tv';
  initialData: {
    results: (Movie | TVShow)[];
  } | null;
};

export function Recommendations({ id, type, initialData }: RecommendationsProps) {
  const [items, setItems] = useState(initialData?.results || []);
  
  if (!initialData || items.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">More Like This</h2>
      <CarouselProvider
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 px-4 sm:px-8 items-start">
          {items.map(item => (
            <CarouselItem key={item.id} className="pl-4 basis-auto" style={{ flex: '0 0 190px' }}>
              <PosterCard item={item} type={'title' in item ? 'movie' : 'tv'} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/50 backdrop-blur-sm hover:bg-background/80 border-2 border-primary/50 text-primary hover:border-primary transition-all duration-300 disabled:opacity-0 disabled:scale-90" >
          <ChevronLeft className="h-6 w-6" />
        </CarouselPrevious>
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/50 backdrop-blur-sm hover:bg-background/80 border-2 border-primary/50 text-primary hover:border-primary transition-all duration-300 disabled:opacity-0 disabled:scale-90" >
          <ChevronRight className="h-6 w-6" />
        </CarouselNext>
      </CarouselProvider>
    </section>
  );
}
