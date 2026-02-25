import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getGenres, getCountries, fetchAllHomepageData } from '@/lib/tmdb';
import { slugify } from '@/lib/utils';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 1. Core Static Routes
  const coreRoutes = [
    '',
    '/movie',
    '/tv',
    '/guides',
    '/legal/privacy-policy',
    '/legal/terms-of-service',
    '/legal/dmca',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Fetch data for dynamic segments
  // We fetch key data to populate the most important URLs in a single sitemap
  const [data, movieGenres, tvGenres, countries] = await Promise.all([
    fetchAllHomepageData(),
    getGenres('movie'),
    getGenres('tv'),
    getCountries(),
  ]);

  // 3. Movies & TV Shows (Popular/Trending)
  const movieRoutes = [...data.popularMovies, ...data.trendingMovies].map((item) => ({
    url: `${baseUrl}/movie/${slugify(item.title || '')}-${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const tvRoutes = [...data.popularTVShows, ...data.trendingTVShows].map((item) => ({
    url: `${baseUrl}/tv/${slugify(item.name || '')}-${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 4. Hub Pages (Genres & Top Countries)
  const genreRoutes = Object.entries({ ...movieGenres, ...tvGenres }).map(([id, name]) => ({
    url: `${baseUrl}/genre/${slugify(name || '')}-${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const countryRoutes = Object.keys(countries).slice(0, 50).map((code) => ({
    url: `${baseUrl}/country/${code}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...coreRoutes,
    ...movieRoutes,
    ...tvRoutes,
    ...genreRoutes,
    ...countryRoutes,
  ];
}
