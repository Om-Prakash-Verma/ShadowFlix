
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/search/',
        '/*?*', // Prevent parameter spam
        '/_next/',
        '/static/',
      ],
    },
    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      `${siteConfig.url}/sitemap-movies.xml`,
      `${siteConfig.url}/sitemap-tv.xml`
    ],
  };
}
