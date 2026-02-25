
'use client';
import { z } from 'zod';

// =========================================================================
// CORE FETCHING LOGIC (CLIENT-SIDE)
// =========================================================================

/**
 * Fetches data from the TMDB API via the Next.js proxy route.
 * This function is intended to be used on the client-side.
 */
export async function fetchTMDB<T>(
  path: string,
  params: Record<string, string | number | boolean> = {},
  schema: z.ZodSchema<T>
): Promise<T | null> {
  const url = new URL(`/api/tmdb/${path}`, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      console.error(`Client-side TMDB API error for path ${path}:`, await res.text());
      return null;
    }
    const data = await res.json();
    const parsed = schema.safeParse(data);
    if (parsed.success) {
      return parsed.data;
    }
    console.error(`Failed to parse client-side TMDB data for path ${path}:`, parsed.error);
    return null;
  } catch (error) {
    console.error(`Client-side network error when fetching TMDB path ${path}:`, error);
    return null;
  }
}
