'use server';

import type {
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  SeasonDetails,
  PersonDetails,
  WatchProviders,
  SearchResult,
  CollectionDetails,
  CompanyDetails,
  Genre,
  Review,
  PagedResponse,
} from './tmdb-schemas';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/utils';

const API_KEY = process.env.TMDB_API_KEY || '67f72af3decc8346e0493120f89e5988';
const API_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTMDB<T>(path: string, params: Record<string, string | number | boolean> = {}): Promise<T | null> {
  if (!API_KEY) return null;

  const url = new URL(`${API_BASE_URL}/${path}`);
  url.searchParams.append('api_key', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return await res.json() as T;
  } catch (error) {
    return null;
  }
}

export async function fetchPagedData<T>(path: string, params: Record<string, string | number>) {
  const data = await fetchTMDB<PagedResponse<T>>(path, params);
  return data ?? { results: [], total_pages: 0, page: 1, total_results: 0 };
}

export async function getMovieDetails(id: string | number): Promise<MovieDetails | null> {
  return fetchTMDB<MovieDetails>(`movie/${id}`, { append_to_response: 'credits,external_ids,videos,watch/providers' });
}

export async function getTVShowDetails(id: string | number): Promise<TVShowDetails | null> {
  return fetchTMDB<TVShowDetails>(`tv/${id}`, { append_to_response: 'credits,external_ids,videos,watch/providers' });
}

export async function getPersonDetails(id: string | number): Promise<PersonDetails | null> {
  const data = await fetchTMDB<PersonDetails>(`person/${id}`, { append_to_response: 'combined_credits' });
  if (data?.combined_credits?.cast) {
    data.combined_credits.cast.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  }
  return data;
}

export async function getCollectionDetails(id: string | number): Promise<CollectionDetails | null> {
  return fetchTMDB<CollectionDetails>(`collection/${id}`);
}

export async function getCompanyDetails(id: string | number): Promise<CompanyDetails | null> {
  return fetchTMDB<CompanyDetails>(`company/${id}`);
}

export async function getSeasonDetails(tvId: string | number, seasonNumber: number): Promise<SeasonDetails | null> {
  return fetchTMDB<SeasonDetails>(`tv/${tvId}/season/${seasonNumber}`);
}

export const fetchAllHomepageData = async () => {
  const [
    popularMovies,
    topRatedMovies,
    trendingMovies,
    popularTVShows,
    topRatedTVShows,
    trendingTVShows,
  ] = await Promise.all([
    fetchPagedData<Movie>("movie/popular", { region: "US", language: "en-US" }),
    fetchPagedData<Movie>("movie/top_rated", { region: "US", language: "en-US" }),
    fetchPagedData<Movie>("trending/movie/week", { region: "US", language: "en-US" }),
    fetchPagedData<TVShow>("tv/popular", { language: "en-US" }),
    fetchPagedData<TVShow>("tv/top_rated", { language: "en-US" }),
    fetchPagedData<TVShow>("trending/tv/week", { language: "en-US" }),
  ]);

  return {
    popularMovies: popularMovies.results,
    topRatedMovies: topRatedMovies.results,
    trendingMovies: trendingMovies.results,
    popularTVShows: popularTVShows.results,
    topRatedTVShows: topRatedTVShows.results,
    trendingTVShows: trendingTVShows.results,
  };
};

export async function getRecentlyReleased(country?: string) {
  const today = new Date().toISOString().split('T')[0];
  const threeMonthsAgoDate = new Date();
  threeMonthsAgoDate.setMonth(threeMonthsAgoDate.getMonth() - 3);
  const threeMonthsAgo = threeMonthsAgoDate.toISOString().split('T')[0];

  const baseParams: Record<string, string | number> = {
    sort_by: 'popularity.desc',
    'vote_count.gte': 50,
  };

  if (country && country !== 'all') {
    baseParams.with_origin_country = country;
  }

  const [movies, tvShows] = await Promise.all([
    fetchPagedData<Movie>('discover/movie', { ...baseParams, 'primary_release_date.gte': threeMonthsAgo, 'primary_release_date.lte': today }),
    fetchPagedData<TVShow>('discover/tv', { ...baseParams, 'first_air_date.gte': threeMonthsAgo, 'first_air_date.lte': today }),
  ]);

  const combined = [...movies.results, ...tvShows.results];
  return combined.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

export async function getGenres(type: 'movie' | 'tv'): Promise<Record<number, string>> {
  const data = await fetchTMDB<{ genres: Genre[] }>(`genre/${type}/list`);
  if (!data) return {};
  return data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as Record<number, string>);
}

export async function getCountries(): Promise<Record<string, string>> {
  const data = await fetchTMDB<{ iso_3166_1: string, english_name: string }[]>('configuration/countries');
  if (!data) return {};
  return data.reduce((acc, country) => {
    acc[country.iso_3166_1] = country.english_name;
    return acc;
  }, {} as Record<string, string>);
}

export async function getCountryName(countryCode: string): Promise<string | null> {
  const countries = await getCountries();
  return countries[countryCode] || null;
}

export async function getMovieRecommendations(movieId: string | number, page = 1) {
  return fetchPagedData<Movie>(`movie/${movieId}/recommendations`, { page: String(page) });
}

export async function getTvRecommendations(tvId: string | number, page = 1) {
  return fetchPagedData<TVShow>(`tv/${tvId}/recommendations`, { page: String(page) });
}

export async function getMovieReviews(movieId: string | number, page = 1) {
  return fetchPagedData<Review>(`movie/${movieId}/reviews`, { page: String(page) });
}

export async function getTvReviews(tvId: string | number, page = 1) {
  return fetchPagedData<Review>(`tv/${tvId}/reviews`, { page: String(page) });
}

export async function fetchMediaByGenre({ genreId, page }: { genreId: string; page: number; }) {
    const [movieData, tvData] = await Promise.all([
      fetchPagedData<Movie>('discover/movie', { with_genres: genreId, page: String(page), sort_by: 'popularity.desc' }),
      fetchPagedData<TVShow>('discover/tv', { with_genres: genreId, page: String(page), sort_by: 'popularity.desc' })
    ]);
    const results = [...movieData.results, ...tvData.results].sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
    return { results, total_pages: Math.max(movieData.total_pages, tvData.total_pages) };
}

export async function fetchMediaByYear({ year, page }: { year: string; page: number; }) {
    const [movieData, tvData] = await Promise.all([
      fetchPagedData<Movie>('discover/movie', { primary_release_year: year, page: String(page), sort_by: 'popularity.desc' }),
      fetchPagedData<TVShow>('discover/tv', { first_air_date_year: year, page: String(page), sort_by: 'popularity.desc' })
    ]);
    const results = [...movieData.results, ...tvData.results].sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
    return { results, total_pages: Math.max(movieData.total_pages, tvData.total_pages) };
}

export async function fetchMediaByCountry({ countryCode, page }: { countryCode: string; page: number; }) {
    const [movieData, tvData] = await Promise.all([
      fetchPagedData<Movie>('discover/movie', { with_origin_country: countryCode, page: String(page), sort_by: 'popularity.desc' }),
      fetchPagedData<TVShow>('discover/tv', { with_origin_country: countryCode, page: String(page), sort_by: 'popularity.desc' })
    ]);
    const results = [...movieData.results, ...tvData.results].sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
    return { results, total_pages: Math.max(movieData.total_pages, tvData.total_pages) };
}

export async function fetchMediaByCompany({ companyId, page }: { companyId: string; page: number; }) {
    const [movieData, tvData] = await Promise.all([
      fetchPagedData<Movie>('discover/movie', { with_companies: companyId, page: String(page), sort_by: 'popularity.desc' }),
      fetchPagedData<TVShow>('discover/tv', { with_companies: companyId, page: String(page), sort_by: 'popularity.desc' })
    ]);
    const results = [...movieData.results, ...tvData.results].sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
    return { results, total_pages: Math.max(movieData.total_pages, tvData.total_pages) };
}

export async function getExternalIds(mediaType: 'movie' | 'tv', tmdbId: string | number) {
  return fetchTMDB<{ imdb_id: string | null }>(`${mediaType}/${tmdbId}/external_ids`);
}

export async function surpriseMeAction() {
  const type = Math.random() > 0.5 ? 'movie' : 'tv';
  const randomPage = Math.floor(Math.random() * 20) + 1;
  const popularItems = await fetchPagedData<Movie | TVShow>(`${type}/popular`, { page: String(randomPage), 'vote_average.gte': '7' });
  if (popularItems.results.length === 0) redirect('/');
  const randomIndex = Math.floor(Math.random() * popularItems.results.length);
  const media = popularItems.results[randomIndex];
  const title = 'title' in media ? media.title : media.name;
  redirect(`/${type}/${slugify(title!)}-${media.id}`);
}

export async function getEmbedFallback(input: any) {
  const currentIndex = input.servers.indexOf(input.currentServer);
  if (currentIndex >= 0 && currentIndex < input.servers.length - 1) {
    return { nextServer: input.servers[currentIndex + 1], reasoning: 'Suggesting next server.' };
  }
  return { reasoning: 'All servers tried.' };
}
