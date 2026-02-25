'use client'

import React, { useState, useCallback } from 'react';
import type { Review, PagedResponse } from '@/lib/tmdb-schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './review-card';
import { Loader2 } from 'lucide-react';
import { fetchTMDB } from '@/lib/tmdb-client';

type ReviewsProps = {
  id: number;
  type: 'movie' | 'tv';
  initialData: {
    results: Review[];
    total_pages: number;
    page: number;
  } | null;
};

export function Reviews({ id, type, initialData }: ReviewsProps) {
  const [reviews, setReviews] = useState(initialData?.results || []);
  const [page, setPage] = useState(initialData?.page || 1);
  const [totalPages, setTotalPages] = useState(initialData?.total_pages || 1);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = page < totalPages;

  const loadMoreReviews = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await fetchTMDB<PagedResponse<Review>>(
        `${type}/${id}/reviews`,
        { page: page + 1 }
      );

      if (data) {
        setReviews(prev => [...prev, ...data.results]);
        setPage(data.page);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Failed to fetch more reviews:', error);
    } finally {
        setIsLoading(false);
    }
  }, [type, id, page, isLoading, hasMore]);

  if (!initialData) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          <p>No reviews available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="space-y-6">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMoreReviews} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Load More
          </Button>
        </div>
      )}

      {!isLoading && !hasMore && reviews.length > 0 && (
        <div className="h-10 flex justify-center items-center mt-8">
          <p className="text-muted-foreground">You've reached the end.</p>
        </div>
      )}
    </section>
  );
}
