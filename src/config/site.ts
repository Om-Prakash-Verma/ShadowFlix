
type NavItem = {
  title: string;
  href: string;
  icon?: string;
};

export const siteConfig = {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'FlixWatch',
    description: 'FlixWatch is the ultimate destination to discover and watch your favorite movies and TV shows online for free in stunning 4K quality. No ads, no subscriptions, just pure entertainment.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://flixwatch.pro',
    mainNav: [
      {
        title: 'Explore',
        href: '/',
        icon: 'compass',
      },
      {
        title: 'Movies',
        href: '/movie',
        icon: 'clapperboard',
      },
      {
        title: 'TV Shows',
        href: '/tv',
        icon: 'tv',
      },
      {
        title: 'Guides',
        href: '/guides',
        icon: 'book-open',
      },
    ] satisfies NavItem[],
    footerNav: [
      {
        title: 'Terms of Service',
        href: '/legal/terms-of-service',
        icon: 'file',
      },
      {
        title: 'Privacy Policy',
        href: '/legal/privacy-policy',
        icon: 'file',
      },
      {
        title: 'Cookie Policy',
        href: '/legal/cookie-policy',
        icon: 'file',
      },
      {
        title: 'DMCA',
        href: '/legal/dmca',
        icon: 'file',
      },
    ] satisfies NavItem[],
  };
  
  export type SiteConfig = typeof siteConfig;
