
import { notFound } from 'next/navigation';
import { getMovieDetails, getMovieRecommendations, getMovieReviews } from '@/lib/tmdb';
import { extractIdFromSlug, getBackdropImage, getPosterImage, jsonLd } from '@/lib/utils';
import { CreditsCarousel, BackgroundImage, MediaHero, TrailersCarousel, WatchProviders, Recommendations, Reviews, MediaLlmSummary } from '@/components/media/details';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { Movie as MovieSchema, BreadcrumbList, VideoObject } from 'schema-dts';

type MoviePageProps = {
  params: {
    slug: string;
  };
};

export const runtime = 'edge';

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movieId = extractIdFromSlug(params.slug);
  if (!movieId) return { title: 'Movie not found' };
  
  const movie = await getMovieDetails(movieId);
  if (!movie) return { title: 'Movie not found' };

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const title = `Watch ${movie.title} (${releaseYear}) Online Free - Full Movie HD | ${siteConfig.name}`;
  const description = `Stream ${movie.title} (${releaseYear}) in stunning 4K/HD quality. ${movie.overview.slice(0, 150)}... No ads, no sign-ups on ${siteConfig.name}.`;
  
  const canonicalUrl = `${siteConfig.url}/movie/${params.slug}`;

  return {
    title,
    description,
    keywords: [movie.title, `${movie.title} online`, 'free movies', 'watch movie free', '4k streaming'],
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title,
        description,
        type: 'video.movie',
        url: canonicalUrl,
        images: [{ url: getPosterImage(movie.poster_path, 'w500'), width: 500, height: 750, alt: movie.title }],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = extractIdFromSlug(params.slug);
  if (!movieId) notFound();
  
  const movie = await getMovieDetails(movieId);
  if (!movie) notFound();

  const [recommendations, reviews] = await Promise.all([
    getMovieRecommendations(movieId),
    getMovieReviews(movieId)
  ]);

  const director = movie.credits.crew.find(p => p.job === 'Director');
  const trailer = movie.videos?.results.find(v => v.type === 'Trailer');

  const movieSchema: MovieSchema = {
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: getPosterImage(movie.poster_path, 'original'),
    datePublished: movie.release_date,
    director: director ? { '@type': 'Person', name: director.name } : undefined,
    actor: movie.credits.cast.slice(0, 10).map(p => ({ '@type': 'Person', name: p.name })),
    aggregateRating: movie.vote_count > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: movie.vote_average,
        bestRating: 10,
        ratingCount: movie.vote_count,
    } : undefined,
  };

  const videoSchema: VideoObject | null = trailer ? {
    '@type': 'VideoObject',
    name: `${movie.title} Trailer`,
    description: `Official trailer for ${movie.title}`,
    thumbnailUrl: `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`,
    uploadDate: movie.release_date,
    contentUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
    embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
  } : null;

  const breadcrumbSchema: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Movies', item: `${siteConfig.url}/movie` },
      { '@type': 'ListItem', position: 3, name: movie.title, item: `${siteConfig.url}/movie/${params.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(movieSchema)} />
      {videoSchema && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(videoSchema)} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbSchema)} />
      
      <div className="flex flex-col">
        <BackgroundImage posterUrl={getPosterImage(movie.poster_path)} backdropUrl={getBackdropImage(movie.backdrop_path)} />
        <div className="relative z-10"><MediaHero item={movie} type="movie" /></div>
        <div className="py-12 space-y-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <MediaLlmSummary item={movie} type="movie" />
          <TrailersCarousel videos={movie.videos?.results || []} />
          <CreditsCarousel credits={movie.credits.cast} title="Cast" />
          <Recommendations id={movie.id} type="movie" initialData={recommendations} />
          <Reviews id={movie.id} type="movie" initialData={reviews} />
        </div>
      </div>
    </>
  );
}
