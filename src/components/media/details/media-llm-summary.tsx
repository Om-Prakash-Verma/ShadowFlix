'use client'

import React from 'react';
import type { MovieDetails, TVShowDetails } from '@/lib/tmdb-schemas';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

export function MediaLlmSummary({ item, type }: { item: MovieDetails | TVShowDetails, type: 'movie' | 'tv' }) {
  const isMovie = (item: MovieDetails | TVShowDetails): item is MovieDetails => type === 'movie';
  const title = isMovie(item) ? item.title : item.name;
  const year = isMovie(item) ? item.release_date.split('-')[0] : item.first_air_date.split('-')[0];
  const director = item.credits.crew.find(c => c.job === 'Director')?.name || 'N/A';
  const mainCast = item.credits.cast.slice(0, 3).map(c => c.name).join(', ');
  const genres = item.genres.map(g => g.name).join(', ');

  return (
    <div className="glass-card p-6 rounded-xl border border-primary/20 mb-8 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-3 text-primary/30 group-hover:text-primary transition-colors">
        <Info className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-primary">Quick Facts</span> & LLM Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong>{title} ({year})</strong> is a <strong>{genres}</strong> {type === 'movie' ? 'film' : 'series'}
            {isMovie(item) ? ` directed by ${director}` : ''}. 
            Starring {mainCast}, this production holds a rating of {item.vote_average.toFixed(1)}/10 on TMDB. 
            The plot follows: {item.overview.slice(0, 200)}...
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">Direct Link</Badge>
            <Badge variant="secondary">No Sign-up</Badge>
            <Badge variant="secondary">4K Streaming</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <span className="text-muted-foreground block mb-1">Director / Creator</span>
            <span className="font-bold">{director}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <span className="text-muted-foreground block mb-1">Status</span>
            <span className="font-bold">{item.status}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <span className="text-muted-foreground block mb-1">Score</span>
            <span className="font-bold">{item.vote_average.toFixed(1)} / 10</span>
          </div>
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <span className="text-muted-foreground block mb-1">Language</span>
            <span className="font-bold uppercase">{item.production_companies[0]?.origin_country || 'EN'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
