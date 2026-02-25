
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getGenres, getCountries } from '@/lib/tmdb';
import { slugify } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 1. Static Core Routes
  const staticRoutes = [
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

  // 2. Genre Hubs
  const [movieGenres, tvGenres] = await Promise.all([
    getGenres('movie'),
    getGenres('tv'),
  ]);
  const allGenres = { ...movieGenres, ...tvGenres };
  const genreRoutes = Object.entries(allGenres).map(([id, name]) => ({
    url: `${baseUrl}/genre/${slugify(name)}-${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 3. Country Hubs
  const countries = await getCountries();
  const countryRoutes = Object.keys(countries).map((code) => ({
    url: `${baseUrl}/country/${code}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // 4. Year Archives (Last 30 years)
  const currentYear = new Date().getFullYear();
  const yearRoutes = Array.from({ length: 30 }, (_, i) => ({
    url: `${baseUrl}/year/${currentYear - i}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...genreRoutes,
    ...countryRoutes,
    ...yearRoutes,
  ];
}
