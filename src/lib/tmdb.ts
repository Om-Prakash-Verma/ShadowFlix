import { cache } from "react";

import { FEATURED_COLLECTION_IDS } from "@/lib/collections";
import { getDemoPlayerSources } from "@/lib/demo-servers";
import { MOVIE_GENRES, TV_GENRES } from "@/lib/site";
import { dedupeById } from "@/lib/utils";
import type { PlayerSource, PlayerSourceSection } from "@/types/player";
import type {
  CollectionDetails,
  Genre,
  MediaResult,
  MovieDetails,
  PersonDetails,
  SearchCollectionResult,
  SearchResult,
  SeasonDetails,
  TMDBListResponse,
  TVDetails,
  VideoResult,
  WatchProvider,
  WatchProvidersResponse,
} from "@/types/tmdb";

const API_BASE = "https://api.themoviedb.org/3";
const RAW_API_KEY = process.env.TMDB_API_KEY;
const API_KEY = RAW_API_KEY && !RAW_API_KEY.startsWith("your_") ? RAW_API_KEY : undefined;

async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
  revalidate = 3600,
): Promise<T> {
  if (!API_KEY) {
    throw new Error("Missing TMDB_API_KEY.");
  }

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate, tags: [path] },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const getMovieGenres = cache(async () => {
  const response = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list", { language: "en-US" }, 86400);
  return response.genres;
});

export const getTvGenres = cache(async () => {
  const response = await tmdbFetch<{ genres: Genre[] }>("/genre/tv/list", { language: "en-US" }, 86400);
  return response.genres;
});

export const getTrending = cache(async () =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/trending/all/week", { language: "en-US" }),
);

export const getNowPlaying = cache(async () =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/movie/now_playing", { language: "en-US", page: 1 }),
);

export const getTopMovies = cache(async () =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/movie/top_rated", { language: "en-US", page: 1 }),
);

export const getTopTVShows = cache(async () =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/tv/top_rated", { language: "en-US", page: 1 }),
);

export const getPopular = cache(async () =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/trending/all/day", { language: "en-US" }),
);

export const getMovieDetails = cache(async (id: number) =>
  tmdbFetch<MovieDetails>(`/movie/${id}`, {
    language: "en-US",
    append_to_response: "recommendations,credits,videos",
  }),
);

export const getTVDetails = cache(async (id: number) =>
  tmdbFetch<TVDetails>(`/tv/${id}`, {
    language: "en-US",
    append_to_response: "recommendations,credits,videos,external_ids",
  }),
);

export const getCollectionDetails = cache(async (id: number) =>
  tmdbFetch<CollectionDetails>(`/collection/${id}`, { language: "en-US" }, 86400),
);

export const getFeaturedCollections = cache(async () => {
  const items = await Promise.all(
    FEATURED_COLLECTION_IDS.map(async (seed) => {
      const collection = await getCollectionDetails(seed.id);
      return {
        id: collection.id,
        name: collection.name,
        overview: collection.overview,
        poster_path: collection.poster_path,
        backdrop_path: collection.backdrop_path,
        count: collection.parts.length,
        parts: collection.parts,
      };
    }),
  );

  return items;
});

export const getTvSeasonDetails = cache(async (id: number, seasonNumber: number) =>
  tmdbFetch<SeasonDetails>(`/tv/${id}/season/${seasonNumber}`, { language: "en-US" }, 86400),
);

export const getPersonDetails = cache(async (id: number) =>
  tmdbFetch<PersonDetails>(`/person/${id}`, { language: "en-US", append_to_response: "combined_credits" }),
);

export const getCompanyDetails = cache(async (id: number) =>
  tmdbFetch<{
    id: number;
    name: string;
    description: string;
    headquarters: string;
    origin_country: string;
    logo_path: string | null;
  }>(`/company/${id}`, { language: "en-US" }, 86400),
);

export const getCompanyTitles = cache(async (id: number, page = 1) =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/discover/movie", {
    language: "en-US",
    sort_by: "popularity.desc",
    with_companies: id,
    page,
  }),
);

export const getMoviesByGenre = cache(async (genreId: number, page = 1) =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/discover/movie", {
    language: "en-US",
    sort_by: "popularity.desc",
    with_genres: genreId,
    page,
  }),
);

export const getTvByGenre = cache(async (genreId: number, page = 1) =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/discover/tv", {
    language: "en-US",
    sort_by: "popularity.desc",
    with_genres: genreId,
    page,
  }),
);

export const getMoviesByYear = cache(async (year: number, page = 1) =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/discover/movie", {
    language: "en-US",
    primary_release_year: year,
    sort_by: "popularity.desc",
    page,
  }),
);

export const getTvByYear = cache(async (year: number, page = 1) =>
  tmdbFetch<TMDBListResponse<MediaResult>>("/discover/tv", {
    language: "en-US",
    first_air_date_year: year,
    sort_by: "popularity.desc",
    page,
  }),
);

export const getMovieWatchProviders = cache(async (id: number) =>
  tmdbFetch<WatchProvidersResponse>(`/movie/${id}/watch/providers`, undefined, 86400),
);

export const getTvWatchProviders = cache(async (id: number) =>
  tmdbFetch<WatchProvidersResponse>(`/tv/${id}/watch/providers`, undefined, 86400),
);

export const getStaticMovieIds = cache(async () => {
  const [top, nowPlaying] = await Promise.all([getTopMovies(), getNowPlaying()]);
  return dedupeById([...top.results, ...nowPlaying.results]).slice(0, 20);
});

export const getStaticTvIds = cache(async () => {
  const [top, popular] = await Promise.all([getTopTVShows(), getPopular()]);
  return dedupeById(
    top.results.concat(popular.results.filter((item) => (item.media_type ?? "tv") === "tv")),
  ).slice(0, 20);
});

function filterMovies(items: MediaResult[]) {
  return items.filter((item) => (item.media_type ?? "movie") !== "tv");
}

function filterTv(items: MediaResult[]) {
  return items.filter((item) => (item.media_type ?? "movie") === "tv");
}

export async function getHomepageData() {
  const genreMovieMap = Object.fromEntries(MOVIE_GENRES.map((genre) => [genre.name.toLowerCase(), genre.id]));
  const genreTvMap = Object.fromEntries(TV_GENRES.map((genre) => [genre.name.toLowerCase(), genre.id]));

  const [
    trending,
    nowPlaying,
    topMovies,
    topTVShows,
    popular,
    featuredCollections,
    netflixShows,
    comedyMovies,
    actionMovies,
    koreanMovies,
    romanceMovies,
    scaryMovies,
    adventureMovies,
    fantasyMovies,
    mysteryMovies,
    warMovies,
    popularTVShows,
  ] = await Promise.all([
    getTrending(),
    getNowPlaying(),
    getTopMovies(),
    getTopTVShows(),
    getPopular(),
    getFeaturedCollections(),
    tmdbFetch<TMDBListResponse<MediaResult>>("/discover/tv", {
      language: "en-US",
      with_networks: 213,
      sort_by: "popularity.desc",
    }),
    getMoviesByGenre(genreMovieMap.comedy),
    getMoviesByGenre(genreMovieMap.action),
    tmdbFetch<TMDBListResponse<MediaResult>>("/discover/movie", {
      language: "en-US",
      with_origin_country: "KR",
      sort_by: "popularity.desc",
    }),
    getMoviesByGenre(genreMovieMap.romance),
    getMoviesByGenre(genreMovieMap.horror),
    getMoviesByGenre(genreMovieMap.adventure),
    getMoviesByGenre(genreMovieMap.fantasy),
    getMoviesByGenre(genreMovieMap.mystery),
    getMoviesByGenre(genreMovieMap.war),
    getTvByGenre(genreTvMap.drama),
  ]);

  const hero = trending.results.find((item) => item.backdrop_path) ?? trending.results[0];

  return {
    hero,
    trending: trending.results,
    nowPlaying: nowPlaying.results,
    topMovies: topMovies.results,
    topTVShows: topTVShows.results,
    popular: popular.results,
    featuredCollections,
    categories: [
      { title: "Netflix TV Shows", href: "/genre/netflix-tv-shows", items: netflixShows.results },
      { title: "Popular TV Shows", href: "/top-tv-shows", items: popularTVShows.results },
      { title: "Comedy Movies", href: "/genre/comedy", items: comedyMovies.results },
      { title: "Action Movies", href: "/genre/action", items: actionMovies.results },
      { title: "Korean Movies", href: "/genre/korean", items: koreanMovies.results },
      { title: "Romance Movies", href: "/genre/romance", items: romanceMovies.results },
      { title: "Scary Movies", href: "/genre/horror", items: scaryMovies.results },
      { title: "Adventure Movies", href: "/genre/adventure", items: adventureMovies.results },
      { title: "Fantasy Movies", href: "/genre/fantasy", items: fantasyMovies.results },
      { title: "Mystery Movies", href: "/genre/mystery", items: mysteryMovies.results },
      { title: "War Movies", href: "/genre/war", items: warMovies.results },
    ],
  };
}

export async function getTopMoviesPageData() {
  const genreMovieMap = Object.fromEntries(MOVIE_GENRES.map((genre) => [genre.name.toLowerCase(), genre.id]));
  const [topMovies, nowPlaying, popular, actionMovies, comedyMovies, romanceMovies, fantasyMovies, mysteryMovies, warMovies, adventureMovies, koreanMovies] = await Promise.all([
    getTopMovies(),
    getNowPlaying(),
    getPopular(),
    getMoviesByGenre(genreMovieMap.action),
    getMoviesByGenre(genreMovieMap.comedy),
    getMoviesByGenre(genreMovieMap.romance),
    getMoviesByGenre(genreMovieMap.fantasy),
    getMoviesByGenre(genreMovieMap.mystery),
    getMoviesByGenre(genreMovieMap.war),
    getMoviesByGenre(genreMovieMap.adventure),
    tmdbFetch<TMDBListResponse<MediaResult>>("/discover/movie", {
      language: "en-US",
      with_origin_country: "KR",
      sort_by: "popularity.desc",
    }),
  ]);

  const popularMovies = filterMovies(popular.results);
  const hero = topMovies.results.find((item) => item.backdrop_path) ?? nowPlaying.results[0] ?? topMovies.results[0];

  return {
    hero,
    previews: dedupeById([...nowPlaying.results, ...popularMovies]).filter((item) => item.id !== hero?.id).slice(0, 5),
    nowPlaying: nowPlaying.results,
    topMovies: topMovies.results,
    popularMovies,
    categories: [
      { title: "Action Movies", href: "/genre/action", items: actionMovies.results },
      { title: "Comedy Movies", href: "/genre/comedy", items: comedyMovies.results },
      { title: "Korean Movies", href: "/genre/korean", items: koreanMovies.results },
      { title: "Romance Movies", href: "/genre/romance", items: romanceMovies.results },
      { title: "Adventure Movies", href: "/genre/adventure", items: adventureMovies.results },
      { title: "Fantasy Movies", href: "/genre/fantasy", items: fantasyMovies.results },
      { title: "Mystery Movies", href: "/genre/mystery", items: mysteryMovies.results },
      { title: "War Movies", href: "/genre/war", items: warMovies.results },
    ],
  };
}

export async function getTopTvShowsPageData() {
  const genreTvMap = Object.fromEntries(TV_GENRES.map((genre) => [genre.name.toLowerCase(), genre.id]));
  const [topTVShows, trending, popular, netflixShows, dramaShows, comedyShows, mysteryShows, sciFiShows, actionShows] = await Promise.all([
    getTopTVShows(),
    getTrending(),
    getPopular(),
    tmdbFetch<TMDBListResponse<MediaResult>>("/discover/tv", {
      language: "en-US",
      with_networks: 213,
      sort_by: "popularity.desc",
    }),
    getTvByGenre(genreTvMap.drama),
    getTvByGenre(genreTvMap.comedy),
    getTvByGenre(genreTvMap.mystery),
    getTvByGenre(genreTvMap["sci-fi & fantasy"]),
    getTvByGenre(genreTvMap["action & adventure"]),
  ]);

  const trendingTv = filterTv(trending.results);
  const popularTv = filterTv(popular.results);
  const hero = topTVShows.results.find((item) => item.backdrop_path) ?? trendingTv[0] ?? topTVShows.results[0];

  return {
    hero,
    previews: dedupeById([...trendingTv, ...popularTv]).filter((item) => item.id !== hero?.id).slice(0, 5),
    topTVShows: topTVShows.results,
    trendingTv,
    popularTv,
    categories: [
      { title: "Netflix TV Shows", href: "/genre/netflix-tv-shows", items: netflixShows.results },
      { title: "Drama TV Shows", href: "/genre/drama", items: dramaShows.results },
      { title: "Comedy TV Shows", href: "/genre/comedy", items: comedyShows.results },
      { title: "Mystery TV Shows", href: "/genre/mystery", items: mysteryShows.results },
      { title: "Sci-Fi & Fantasy Shows", href: "/genre/sci-fi-fantasy", items: sciFiShows.results },
      { title: "Action TV Shows", href: "/genre/action-adventure", items: actionShows.results },
    ],
  };
}

function buildEmbedUrl(video: VideoResult) {
  if (video.site === "YouTube") {
    return `https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  if (video.site === "Vimeo") {
    return `https://player.vimeo.com/video/${video.key}?autoplay=1`;
  }
  return null;
}

export function getTrailerSources(videos?: { results?: VideoResult[] }): PlayerSource[] {
  const preferred = (videos?.results ?? []).filter((video) => ["Trailer", "Teaser", "Clip"].includes(video.type));
  const fallback = (videos?.results ?? []).filter((video) => ["YouTube", "Vimeo"].includes(video.site));
  const selected = preferred.length ? preferred : fallback;

  return selected.reduce<PlayerSource[]>((sources, video, index) => {
    const src = buildEmbedUrl(video);
    if (!src) {
      return sources;
    }

    sources.push({
      id: `trailer-${video.site}-${video.key}-${index}`,
      name: video.name || `${video.type || "Video"} ${index + 1}`,
      src,
      label: `${video.site} ${video.type || "Video"}`,
      kind: "embed",
    });

    return sources;
  }, []).slice(0, 6);
}

function dedupeProviders(providers: WatchProvider[]) {
  return dedupeById(providers.map((provider) => ({ id: provider.provider_id, ...provider })));
}

export function getProviderLinks(watchProviders?: WatchProvidersResponse): PlayerSource[] {
  const regions = ["US", "IN", "GB"];

  return regions.flatMap((region) => {
    const entry = watchProviders?.results?.[region];
    if (!entry) {
      return [];
    }

    const providers = dedupeProviders([
      ...(entry.flatrate ?? []),
      ...(entry.free ?? []),
      ...(entry.ads ?? []),
      ...(entry.rent ?? []),
      ...(entry.buy ?? []),
    ]);

    return providers.map((provider) => ({
      id: `provider-${region}-${provider.provider_id}`,
      name: provider.provider_name,
      src: entry.link,
      label: `Official TMDB watch provider for ${region}`,
      kind: "link" as const,
    }));
  });
}

export function buildPlayerSources({
  tmdbId,
  imdbId,
  mediaType,
  videos,
  watchProviders,
  season = 1,
  episode = 1,
}: {
  tmdbId: number;
  imdbId?: string | null;
  mediaType: "movie" | "tv";
  videos?: { results?: VideoResult[] };
  watchProviders?: WatchProvidersResponse;
  season?: number;
  episode?: number;
}): PlayerSourceSection[] {
  const demoSources = getDemoPlayerSources({
    tmdbId: String(tmdbId),
    imdbId,
    mediaType,
    season,
    episode,
  });
  const trailerSources = getTrailerSources(videos);
  const providerSources = getProviderLinks(watchProviders);

  return [
    {
      id: "demo",
      title: "Third-Party",
      description: "We are not affiliated with any third-party servers. If you have any issues regarding content, please contact the respective third-party server owners directly.",
      sources: demoSources,
    },
    {
      id: "trailers",
      title: "Trailers",
      description: "Embedded promotional videos fetched from TMDB video records.",
      sources: trailerSources,
    },
  ].filter((section) => section.sources.length > 0);
}

export async function getGenreLanding(slug: string) {
  if (slug === "trending") {
    const trending = await getTrending();
    return {
      title: "Trending",
      description: "Stream the most talked-about movies and TV shows trending right now on FreeFlix.",
      movies: filterMovies(trending.results),
      tv: filterTv(trending.results),
    };
  }

  if (slug === "netflix-tv-shows") {
    const tv = await tmdbFetch<TMDBListResponse<MediaResult>>("/discover/tv", {
      language: "en-US",
      with_networks: 213,
      sort_by: "popularity.desc",
    });
    return {
      title: "Netflix TV Shows",
      description: "Discover high-interest Netflix TV shows and binge-worthy series with a premium streaming layout.",
      movies: [],
      tv: tv.results,
      movieTotalPages: 0,
      tvTotalPages: tv.total_pages,
    };
  }

  if (slug === "korean") {
    const movies = await tmdbFetch<TMDBListResponse<MediaResult>>("/discover/movie", {
      language: "en-US",
      with_origin_country: "KR",
      sort_by: "popularity.desc",
    });
    return {
      title: "Korean Movies",
      description: "Browse popular Korean movies with rich artwork, cast details, and instant internal links.",
      movies: movies.results,
      tv: [],
      movieTotalPages: movies.total_pages,
      tvTotalPages: 0,
    };
  }

  const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTvGenres()]);
  const movieGenre = movieGenres.find((genre) => genre.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
  const tvGenre = tvGenres.find((genre) => genre.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
  const emptyList = { page: 1, results: [], total_pages: 0, total_results: 0 } satisfies TMDBListResponse<MediaResult>;
  const [movies, tv] = await Promise.all([
    movieGenre ? getMoviesByGenre(movieGenre.id) : Promise.resolve(emptyList),
    tvGenre ? getTvByGenre(tvGenre.id) : Promise.resolve(emptyList),
  ]);

  return {
    title: movieGenre?.name ?? tvGenre?.name ?? "Genre",
    description: `Explore ${movieGenre?.name ?? tvGenre?.name ?? "genre"} movies and TV shows with fast-loading posters, metadata, and keyword-rich discovery pages.`,
    movies: movies.results,
    tv: tv.results,
    movieTotalPages: movies.total_pages,
    tvTotalPages: tv.total_pages,
  };
}

export async function getMoviesForSitemap() {
  const [movies, tvShows] = await Promise.all([getStaticMovieIds(), getStaticTvIds()]);
  return { movies, tvShows };
}

export function getGenreDirectory() {
  return dedupeById([...MOVIE_GENRES, ...TV_GENRES]);
}

function sortSearchResults(items: SearchResult[]) {
  return [...items].sort((left, right) => (right.popularity ?? 0) - (left.popularity ?? 0));
}

export async function getSearchResults(query: string, page = 1) {
  const [multi, collections] = await Promise.all([
    tmdbFetch<TMDBListResponse<SearchResult>>("/search/multi", {
      language: "en-US",
      query,
      include_adult: "false",
      page,
    }),
    tmdbFetch<TMDBListResponse<SearchCollectionResult>>("/search/collection", {
      language: "en-US",
      query,
      include_adult: "false",
      page,
    }),
  ]);

  const results = sortSearchResults(dedupeById([...multi.results, ...collections.results]));

  return {
    page,
    results,
    total_pages: Math.max(multi.total_pages, collections.total_pages),
    total_results: multi.total_results + collections.total_results,
  } satisfies TMDBListResponse<SearchResult>;
}

export async function getBrowseFeed({
  mode,
  slug,
  page = 1,
  type,
}: {
  mode: "genre" | "year" | "company";
  slug: string;
  page?: number;
  type: "movie" | "tv";
}) {
  if (mode === "year") {
    const year = Number(slug);
    if (!Number.isFinite(year)) {
      return { page, results: [], total_pages: 0, total_results: 0 } satisfies TMDBListResponse<MediaResult>;
    }

    return type === "movie" ? getMoviesByYear(year, page) : getTvByYear(year, page);
  }

  if (mode === "company") {
    const companyId = Number(slug);
    if (!Number.isFinite(companyId) || type !== "movie") {
      return { page, results: [], total_pages: 0, total_results: 0 } satisfies TMDBListResponse<MediaResult>;
    }

    return getCompanyTitles(companyId, page);
  }

  const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTvGenres()]);
  const genres = type === "movie" ? movieGenres : tvGenres;
  const genre = genres.find((entry) => entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
  if (!genre) {
    return { page, results: [], total_pages: 0, total_results: 0 } satisfies TMDBListResponse<MediaResult>;
  }

  return type === "movie" ? getMoviesByGenre(genre.id, page) : getTvByGenre(genre.id, page);
}