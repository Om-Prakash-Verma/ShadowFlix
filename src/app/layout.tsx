
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/dialogs';
import { siteConfig } from '@/config/site';
import { cn, jsonLd } from '@/lib/utils';
import { AdScripts } from '@/components/AdScripts';
import { Inter, Roboto_Flex } from 'next/font/google';
import { Organization, WebSite } from 'schema-dts';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'watch movies free',
    'stream tv shows online',
    '4k free streaming',
    'no sign up movies',
    'legal movie database',
    'flixwatch',
    'best free streaming sites 2024',
  ],
  alternates: {
    canonical: './',
    languages: {
      'en-US': './',
      'en-GB': './',
      'en-CA': './',
      'en-AU': './',
      'x-default': './',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const organizationSchema: Organization = {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    sameAs: [
      'https://twitter.com/flixwatch', // Placeholder for brand signals
      'https://github.com/flixwatch'
    ]
  };

  const websiteSchema: WebSite = {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    } as any
  };

  return (
    <html lang="en" className={cn('dark', inter.variable, robotoFlex.variable)} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema)}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(websiteSchema)}
        />
        <AdScripts />
      </head>
      <body
        className={cn(
          "font-headline bg-background text-foreground antialiased",
          "transition-all duration-500"
        )}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
