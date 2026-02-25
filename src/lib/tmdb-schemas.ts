// Lightweight TypeScript interfaces to replace Zod and ensure < 3MiB bundle size

export interface MediaBase {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  popularity?: number;
}

export interface Movie extends MediaBase {
  title: string;
  release_date: string;
}

export interface TVShow extends MediaBase {
  name: string;
  first_air_date: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  media_type?: 'person';
}

export interface SearchResult extends MediaBase {
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  profile_path?: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  job?: string;
  credit_id: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CastMember[];
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: 'YouTube';
  type: string;
  official: boolean;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface WatchProviders {
  results: Record<string, {
    link: string;
    free?: WatchProvider[];
  }>;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  credits: Credits;
  production_companies: ProductionCompany[];
  status: string;
  tagline: string | null;
  videos?: { results: Video[] };
  'watch/providers'?: WatchProviders;
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  episode_run_time: number[];
  seasons: Season[];
  credits: Credits;
  production_companies: ProductionCompany[];
  status: string;
  videos?: { results: Video[] };
  'watch/providers'?: WatchProviders;
}

export interface Season {
  air_date: string | null;
  episode_count?: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
}

export interface PersonCombinedCreditsCast extends MediaBase {
  media_type: 'movie' | 'tv';
  character?: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  credit_id: string;
}

export interface PersonDetails extends Person {
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  combined_credits?: {
    cast?: PersonCombinedCreditsCast[];
  };
}

export interface CollectionDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export interface CompanyDetails {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
  headquarters: string;
  homepage: string;
  description: string;
}

export interface PagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
