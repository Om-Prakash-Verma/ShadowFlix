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
        '/*?*', // Block parameter spam to save crawl budget
        '/_next/',
        '/static/',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
