import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getGenres, getCountries, fetchAllHomepageData } from '@/lib/tmdb';
import { slugify } from '@/lib/utils';

/**
 * Segmented Sitemap Implementation for Enterprise Scale.
 * This allows us to bypass the 50,000 URL limit and improve indexing speed.
 */

export async function generateSitemaps() {
  return [
    { id: 'core' },
    { id: 'movies' },
    { id: 'tv' },
    { id: 'hubs' },
  ];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  if (id === 'core') {
    return [
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
      changeFrequency: 'daily',
      priority: route === '' ? 1 : 0.8,
    }));
  }

  if (id === 'movies' || id === 'tv') {
    const data = await fetchAllHomepageData();
    const items = id === 'movies' ? [...data.popularMovies, ...data.trendingMovies] : [...data.popularTVShows, ...data.trendingTVShows];
    
    return items.map((item) => {
      const type = 'title' in item ? 'movie' : 'tv';
      const title = 'title' in item ? item.title : item.name;
      return {
        url: `${baseUrl}/${type}/${slugify(title)}-${item.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });
  }

  if (id === 'hubs') {
    const [movieGenres, tvGenres, countries] = await Promise.all([
      getGenres('movie'),
      getGenres('tv'),
      getCountries(),
    ]);

    const genreRoutes = Object.entries({ ...movieGenres, ...tvGenres }).map(([id, name]) => ({
      url: `${baseUrl}/genre/${slugify(name)}-${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const countryRoutes = Object.keys(countries).map((code) => ({
      url: `${baseUrl}/country/${code}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }));

    const currentYear = new Date().getFullYear();
    const yearRoutes = Array.from({ length: 20 }, (_, i) => ({
      url: `${baseUrl}/year/${currentYear - i}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    }));

    return [...genreRoutes, ...countryRoutes, ...yearRoutes];
  }

  return [];
}
