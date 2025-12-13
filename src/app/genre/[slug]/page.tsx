
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getGenres, fetchMediaByGenre } from '@/lib/tmdb';
import { extractIdFromSlug } from '@/lib/utils';
import { GenrePageContent, GenrePageSkeleton } from './genre-page-client';

export const runtime = 'edge';

type GenrePageProps = {
  params: {
    slug: string;
  };
};

async function getGenreNameFromSlug(slug: string): Promise<string | null> {
    const genreId = extractIdFromSlug(slug);
    if (!genreId) return null;

    const [movieGenres, tvGenres] = await Promise.all([
        getGenres('movie'),
        getGenres('tv'),
    ]);
    
    const allGenres = {...movieGenres, ...tvGenres};
    const genreName = allGenres[Number(genreId)];

    if (genreName) return genreName;

    // Fallback for slugs where the name is present but ID might be wrong
    const nameFromSlug = slug.split('-').slice(0, -1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return nameFromSlug || null;
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
    const { slug } = params;
    const genreId = extractIdFromSlug(slug);
    const genreName = await getGenreNameFromSlug(slug);

    if (!genreId || !genreName) {
        return { title: 'Genre not found' };
    }
    
    const title = `Watch ${genreName} Movies & TV Shows Online`;
    const description = `Discover and stream the best ${genreName} movies and TV shows. Browse a full list of ${genreName} content available to watch for free.`;
    const canonicalUrl = `/genre/${slug}`;

    return {
        title,
        description,
        keywords: [genreName, 'movies', 'tv shows', 'free streaming'],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GenrePage({ params }: GenrePageProps) {
    const { slug } = params;
    const genreId = extractIdFromSlug(slug);
    
    const [initialData, genreName] = await Promise.all([
        genreId ? fetchMediaByGenre({ genreId, page: 1 }) : Promise.resolve({ results: [], total_pages: 0 }),
        getGenreNameFromSlug(slug)
    ]);


    return (
        <Suspense fallback={<GenrePageSkeleton />}>
            <GenrePageContent 
                genreId={genreId}
                genreName={genreName || 'Genre'}
                initialData={initialData.results}
                totalPages={initialData.total_pages}
            />
        </Suspense>
    )
}
