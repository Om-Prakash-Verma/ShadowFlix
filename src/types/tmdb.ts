export type MediaType = "movie" | "tv" | "person" | "collection";

export interface Genre {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface MediaResult {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: Genre[];
  popularity?: number;
  origin_country?: string[];
}

export interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  known_for_department?: string;
  order?: number;
  popularity?: number;
}

export interface SearchPersonResult {
  id: number;
  media_type: "person";
  name: string;
  overview: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity?: number;
}

export interface SearchCollectionResult {
  id: number;
  media_type: "collection";
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity?: number;
}

export type SearchResult = MediaResult | SearchPersonResult | SearchCollectionResult;

export interface TMDBListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface VideoResult {
  id?: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

export interface VideoResultsResponse {
  results: VideoResult[];
}

export interface SeasonSummary {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  episode_count: number;
  season_number: number;
}

export interface EpisodeDetails {
  id: number;
  name: string;
  overview: string;
  air_date: string | null;
  runtime?: number | null;
  episode_number: number;
  still_path: string | null;
  vote_average: number;
}

export interface SeasonDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  season_number: number;
  episodes: EpisodeDetails[];
}

export interface MovieDetails extends MediaResult {
  title: string;
  release_date: string;
  runtime: number | null;
  imdb_id?: string | null;
  genres: Genre[];
  production_companies: Company[];
  recommendations?: TMDBListResponse<MediaResult>;
  videos?: VideoResultsResponse;
  credits?: {
    cast: CastMember[];
  };
}

export interface TVDetails extends MediaResult {
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Genre[];
  production_companies: Company[];
  seasons?: SeasonSummary[];
  recommendations?: TMDBListResponse<MediaResult>;
  videos?: VideoResultsResponse;
  credits?: {
    cast: CastMember[];
  };
  external_ids?: {
    imdb_id?: string | null;
  };
}

export interface CollectionDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MediaResult[];
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  combined_credits?: {
    cast: MediaResult[];
  };
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
}

export interface WatchProviderRegion {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProvidersResponse {
  results: Record<string, WatchProviderRegion>;
}