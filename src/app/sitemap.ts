import type { MetadataRoute } from "next";

import { FEATURED_COLLECTION_IDS } from "@/lib/collections";
import { buildMediaSlug } from "@/lib/slug";
import { DECADES, SITE_URL } from "@/lib/site";
import { getGenreDirectory, getMoviesForSitemap } from "@/lib/tmdb";
import { getTitle } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [media, genres] = await Promise.all([getMoviesForSitemap(), Promise.resolve(getGenreDirectory())]);

  const staticRoutes = [
    "",
    "/top-movies",
    "/top-tv-shows",
    ...DECADES.map((decade) => `/year/${decade}`),
    ...genres.map((genre) => `/genre/${genre.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
    ...FEATURED_COLLECTION_IDS.map((collection) => `/collections/${collection.id}`),
  ].map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));

  const movieRoutes = media.movies.map((movie) => ({
    url: `${SITE_URL}/movie/${buildMediaSlug(getTitle(movie), movie.id)}`,
    lastModified: new Date(),
  }));

  const tvRoutes = media.tvShows.map((show) => ({
    url: `${SITE_URL}/tv/${buildMediaSlug(getTitle(show), show.id)}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...movieRoutes, ...tvRoutes];
}