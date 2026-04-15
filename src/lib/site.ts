import type { Genre } from "@/types/tmdb";

export const SITE_NAME = "FreeFlix";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://FreeFlix.example.com";
export const SITE_DESCRIPTION =
  "FreeFlix is the ultimate destination to discover and watch your favorite movies and TV shows online for free in stunning 4K quality. No ads, no subscriptions, just pure entertainment.";
export const IMAGE_BASE = "https://image.tmdb.org/t/p/";
export const DECADES = [2020, 2010, 2000, 1990, 1980] as const;

export const MOVIE_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" }
];

export const TV_GENRES: Genre[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi & Fantasy" }
];

