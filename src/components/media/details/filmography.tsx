'use client'

import React from 'react';
import Link from 'next/link';
import type { PersonCombinedCreditsCast } from '@/lib/tmdb-schemas';
import { slugify } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type FilmographyProps = {
  allCredits: PersonCombinedCreditsCast[];
};

export function Filmography({ allCredits }: FilmographyProps) {
  return (
    <Card className="bg-card/80 rounded-lg">
      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-4">
          {allCredits.map((item) => (
            <CreditRow key={`${item.id}-${item.credit_id}`} item={item} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function CreditRow({ item }: { item: PersonCombinedCreditsCast }) {
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '----';
  const href = `/${item.media_type}/${slugify(title || '')}-${item.id}`;

  return (
    <div className="flex items-center gap-4 text-sm hover:bg-muted/50 p-2 rounded-md -mx-2">
      <span className="font-bold w-12 text-center">{year}</span>
      <div className="flex-grow">
        <Link href={href} className="font-semibold hover:text-primary transition-colors" prefetch={false}>{title}</Link>
        {item.character && <p className="text-xs text-muted-foreground">as {item.character}</p>}
      </div>
    </div>
  );
}
