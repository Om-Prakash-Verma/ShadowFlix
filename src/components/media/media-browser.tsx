'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Movie, TVShow, PagedResponse } from '@/lib/tmdb-schemas';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchTMDB } from '@/lib/tmdb-client';
import { MediaGrid } from './media-grid';

type SortOption = 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' | 'first_air_date.desc';

type MediaBrowserProps = {
  title: string;
  type: 'movie' | 'tv';
  genres: Record<number, string>;
  countries: Record<string, string>;
};

export function MediaBrowser({ title, type, genres, countries }: MediaBrowserProps) {
  const [filters, setFilters] = useState({
    genre: 'all',
    year: 'all',
    country: 'all',
    sort: 'popularity.desc' as SortOption
  });

  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  const fetcher = useCallback(async (page: number, currentFilters: typeof filters) => {
    const params: Record<string, string | number> = {
        page: page,
        sort_by: currentFilters.sort,
    };
    if (currentFilters.genre && currentFilters.genre !== 'all') {
        params.with_genres = currentFilters.genre;
    }
    if (currentFilters.year && currentFilters.year !== 'all') {
        if (type === 'movie') {
            params.primary_release_year = currentFilters.year;
        } else {
            params.first_air_date_year = currentFilters.year;
        }
    }
    if (currentFilters.country && currentFilters.country !== 'all') {
        params.with_origin_country = currentFilters.country;
    }
    
    const data = await fetchTMDB<PagedResponse<Movie | TVShow>>(`discover/${type}`, params);
    return data || { results: [], total_pages: 1, page: 1, total_results: 0 };
  }, [type]);

  const loadInitialItems = useCallback((currentFilters: typeof filters) => {
    setIsLoading(true);
    fetcher(1, currentFilters).then(data => {
      setItems(data.results);
      setPage(1);
      setTotalPages(data.total_pages);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [fetcher]);

  useEffect(() => {
    loadInitialItems(filters);
  }, [filters, loadInitialItems]);

  const handleFilterChange = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const sortOptions = type === 'movie' ? [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'vote_average.desc', label: 'Rating' },
    { value: 'primary_release_date.desc', label: 'Release Date' }
  ] : [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'vote_average.desc', label: 'Rating' },
    { value: 'first_air_date.desc', label: 'Release Date' }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="grid w-full gap-1.5">
                <Label htmlFor="sort-by" className="text-muted-foreground">Sort By</Label>
                <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value as SortOption)}>
                    <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border" id="sort-by">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid w-full gap-1.5">
                <Label htmlFor="genre" className="text-muted-foreground">Genre</Label>
                <Select value={filters.genre} onValueChange={(value) => handleFilterChange('genre', value)}>
                    <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border" id="genre">
                        <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        {Object.entries(genres).map(([id, name]) => (
                            <SelectItem key={id} value={id}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid w-full gap-1.5">
                <Label htmlFor="year" className="text-muted-foreground">Year</Label>
                <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                    <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border" id="year">
                        <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="country" className="text-muted-foreground">Country</Label>
              <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                  <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border" id="country">
                      <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {Object.entries(countries).map(([code, name]) => (
                          <SelectItem key={code} value={code}>{name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
        </div>
      </div>
      
      <MediaGrid 
          initialItems={items} 
          type={type}
          initialLoading={isLoading}
          imageSize="w342"
          fetcher={(nextPage: number) => fetcher(nextPage, filters).then(data => data.results)}
          initialPage={page}
          totalPages={totalPages}
      />
    </>
  );
}
