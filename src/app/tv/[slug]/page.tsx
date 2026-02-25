import { notFound } from 'next/navigation';
import { getTVShowDetails, getSeasonDetails, getTvRecommendations, getTvReviews } from '@/lib/tmdb';
import { extractIdFromSlug, getBackdropImage, getPosterImage, jsonLd } from '@/lib/utils';
import { CreditsCarousel, SeasonsDisplay, BackgroundImage, MediaHero, TrailersCarousel, WatchProviders, Recommendations, Reviews, MediaLlmSummary } from '@/components/media/details';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { TVSeries, BreadcrumbList } from 'schema-dts';

type TVShowPageProps = {
  params: {
    slug: string;
  };
};

export const runtime = 'edge';

export async function generateMetadata({ params }: TVShowPageProps): Promise<Metadata> {
  const showId = extractIdFromSlug(params.slug);
  if (!showId) {
    return { title: 'TV Show not found' };
  }
  const show = await getTVShowDetails(showId);

  if (!show) {
    return {
      title: 'TV Show not found',
    };
  }

  const releaseYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
  const title = `Watch ${show.name} (${releaseYear}) Online Free - All Seasons HD | ${siteConfig.name}`;
  const description = `Binge all seasons of ${show.name} (${releaseYear}) in HD/4K for free. Episode guides, cast details, and full streaming on ${siteConfig.name}.`;
  
  const keywords = [
    show.name,
    `${show.name} series`,
    'watch tv shows free',
    'stream all episodes',
    'free streaming site',
  ];

  const canonicalUrl = `${siteConfig.url}/tv/${params.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title,
        description,
        type: 'video.tv_show',
        url: canonicalUrl,
        images: [
            {
                url: getPosterImage(show.poster_path, 'w500'),
                width: 500,
                height: 750,
                alt: show.name,
            },
        ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [getBackdropImage(show.backdrop_path, 'w1280')],
    },
  };
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  const showId = extractIdFromSlug(params.slug);
  if (!showId) {
    notFound();
  }
  const show = await getTVShowDetails(showId);

  if (!show) {
    notFound();
  }
  
  const [recommendations, reviews] = await Promise.all([
    getTvRecommendations(showId),
    getTvReviews(showId)
  ]);

  const firstSeason = show.seasons.find(s => s.season_number > 0);
  const initialSeasonDetails = firstSeason
    ? await getSeasonDetails(showId, firstSeason.season_number)
    : null;

  const watchProviders = show['watch/providers']?.results.US;

  const tvSeriesSchema: TVSeries = {
    '@type': 'TVSeries',
    name: show.name,
    description: show.overview,
    image: getPosterImage(show.poster_path, 'original'),
    numberOfSeasons: show.seasons.filter(s => s.season_number > 0).length,
    aggregateRating: show.vote_count > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: show.vote_average,
        bestRating: 10,
        ratingCount: show.vote_count,
    } : undefined,
  };

  const breadcrumbSchema: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'TV Shows',
        item: `${siteConfig.url}/tv`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: show.name,
        item: `${siteConfig.url}/tv/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(tvSeriesSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbSchema)} />
      
      <div className="flex flex-col">
        <BackgroundImage posterUrl={getPosterImage(show.poster_path)} backdropUrl={getBackdropImage(show.backdrop_path)} />
        
        <div className="relative z-10">
          <MediaHero item={show} type="tv" />
        </div>
        
        <div className="py-12 space-y-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">

          <MediaLlmSummary item={show} type="tv" />

          {watchProviders && <WatchProviders providers={watchProviders} />}
          
          <TrailersCarousel videos={show.videos?.results || []} />

          <SeasonsDisplay 
            seasons={show.seasons} 
            showId={show.id} 
            showName={show.name}
            initialData={initialSeasonDetails}
          />

          <CreditsCarousel credits={show.credits.cast} title="Cast" />

          <Recommendations id={show.id} type="tv" initialData={recommendations} />

          <Reviews id={show.id} type="tv" initialData={reviews} />
          
        </div>
      </div>
    </>
  );
}
