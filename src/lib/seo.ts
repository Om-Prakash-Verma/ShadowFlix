import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { buildMediaSlug } from "@/lib/slug";
import { getTitle, getYear, imageUrl, truncate } from "@/lib/utils";
import type { CollectionDetails, MediaResult } from "@/types/tmdb";

function buildKeywords(title: string, year: string, typeLabel: string) {
  return [
    `${title} ${year}`,
    `watch ${title} online free`,
    `${title} full ${typeLabel.toLowerCase()} hd`,
    `stream ${title} 4k`,
    `${title} cast and plot`,
    `${title} ${SITE_NAME}`,
  ];
}

function defaultRobots(): NonNullable<Metadata["robots"]> {
  return {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

function defaultSiteImage() {
  return {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} homepage preview`,
  };
}

function homepageKeywords() {
  return [
    "free movies online",
    "free tv shows online",
    "movie discovery platform",
    "tv show discovery",
    "streaming guide",
    "watch movies online free",
    "watch tv shows online free",
    "latest movies and shows",
    `${SITE_NAME} movies`,
    `${SITE_NAME} tv shows`,
  ];
}

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `Watch Movies & TV Shows Online for Free | ${SITE_NAME}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: homepageKeywords(),
    applicationName: SITE_NAME,
    alternates: { canonical: SITE_URL },
    robots: defaultRobots(),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} | Free Movie & TV Discovery`,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      images: [defaultSiteImage()],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} | Free Movie & TV Discovery`,
      description: SITE_DESCRIPTION,
      images: [defaultSiteImage().url],
    },
  };
}

export function buildMediaMetadata(item: MediaResult, type: "movie" | "tv"): Metadata {
  const title = getTitle(item);
  const year =
    type === "movie"
      ? item.release_date
        ? new Date(item.release_date).getFullYear().toString()
        : "2026"
      : item.first_air_date
        ? new Date(item.first_air_date).getFullYear().toString()
        : "2026";
  const typeLabel = type === "movie" ? "Movie" : "TV Show";
  const pageTitle = `Watch ${title} (${year}) Online Free - Full ${typeLabel} HD `;
  const description = `Stream ${title} (${year}) in 4K/HD. ${truncate(item.overview || `${title} is now streaming in our discovery hub.`, 110)}. No ads, no signup. Watch now on ${SITE_NAME}.`;
  const slug = buildMediaSlug(title, item.id);
  const pathname = type === "movie" ? `/movie/${slug}` : `/tv/${slug}`;

  return {
    title: pageTitle,
    description,
    keywords: buildKeywords(title, year, typeLabel),
    alternates: { canonical: pathname },
    robots: defaultRobots(),
    openGraph: {
      title: pageTitle,
      description,
      url: `${SITE_URL}${pathname}`,
      images: item.backdrop_path
        ? [{ url: `https://image.tmdb.org/t/p/original${item.backdrop_path}`, width: 1280, height: 720, alt: title }]
        : undefined,
    },
    twitter: { card: "summary_large_image", title: pageTitle, description },
  };
}

export function buildListingMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords: string[];
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: defaultRobots(),
    openGraph: { title, description, url: `${SITE_URL}${path}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function buildCollectionMetadata(collection: CollectionDetails): Metadata {
  const title = `${collection.name} Collection Movies `;
  const description = `${truncate(collection.overview || `${collection.name} is a featured collection on ${SITE_NAME}.`, 140)} Browse every film in the collection with fast posters, metadata, and internal watch pages.`;

  return {
    title,
    description,
    keywords: [
      `${collection.name} collection`,
      `${collection.name} movies in order`,
      `watch ${collection.name} collection online free`,
      `${collection.name} ${SITE_NAME}`,
    ],
    alternates: { canonical: `/collections/${collection.id}` },
    robots: defaultRobots(),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/collections/${collection.id}`,
      images: collection.backdrop_path
        ? [{ url: `https://image.tmdb.org/t/p/original${collection.backdrop_path}`, width: 1280, height: 720, alt: collection.name }]
        : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function mediaSchema(item: MediaResult, type: "Movie" | "TVSeries") {
  const name = getTitle(item);
  const year = getYear(item);
  const pathname = type === "Movie" ? "movie" : "tv";

  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    datePublished: year,
    description: truncate(item.overview || `${name} is trending on ${SITE_NAME}.`, 160),
    image: imageUrl(item.backdrop_path ?? item.poster_path, "original"),
    url: `${SITE_URL}/${pathname}/${buildMediaSlug(name, item.id)}`,
  };
}

export function faqSchema(title: string, year: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I watch ${title} (${year}) online?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${SITE_NAME} helps you discover ${title} (${year}) with cast, genre, trailer, and similar titles in one fast-loading page.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${title} (${year}) available in HD?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${SITE_NAME} surfaces HD-ready artwork, release details, and streaming discovery metadata for ${title} (${year}).`,
        },
      },
      {
        "@type": "Question",
        name: `What should I watch after ${title} (${year})?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Check the related recommendations and ranked rows on ${SITE_NAME} for similar movies and TV shows after ${title} (${year}).`,
        },
      },
    ],
  };
}

export function collectionSchema(collection: CollectionDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: truncate(collection.overview || `${collection.name} is a featured collection on ${SITE_NAME}.`, 160),
    url: `${SITE_URL}/collections/${collection.id}`,
    image: imageUrl(collection.backdrop_path ?? collection.poster_path, "original"),
  };
}