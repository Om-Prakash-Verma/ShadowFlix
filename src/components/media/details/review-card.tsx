'use client'

import React, { useState, useEffect } from 'react';
import type { Review } from '@/lib/tmdb-schemas';
import { getProfileImage } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const author = review.author_details;

  useEffect(() => {
    if (review.created_at) {
      const date = new Date(review.created_at);
      setFormattedDate(new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date));
    }
  }, [review.created_at]);

  const avatarUrl = author.avatar_path
    ? getProfileImage(author.avatar_path, 'w185')
    : null;

  // TMDB review content can contain markdown-like syntax. This is a simple conversion.
  const formatContent = (content: string) => {
    return content.replace(/\r\n/g, '<br />');
  };

  const hasLongContent = review.content.length > 500;

  return (
    <Card className="bg-card/80 rounded-lg">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="rounded-full overflow-hidden">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={`Avatar of ${author.username}`} loading="lazy" />}
          <AvatarFallback>{author.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{author.name || author.username}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {author.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{author.rating}/10</span>
              </div>
            )}
            <p>{formattedDate}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn("text-sm text-foreground/80 leading-relaxed relative", {
            'max-h-48 overflow-hidden': hasLongContent && !isExpanded,
          })}
        >
          <p dangerouslySetInnerHTML={{ __html: formatContent(review.content) }} />
          {hasLongContent && !isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-card/80 to-transparent" />
          )}
        </div>
      </CardContent>
      {hasLongContent && (
        <CardFooter>
          <Button variant="link" className="p-0 h-auto" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Read less' : 'Read more'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
