'use client';

/**
 * Lightweight client-side TMDB fetcher without Zod.
 */
export async function fetchTMDB<T>(
  path: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T | null> {
  const url = new URL(`/api/tmdb/${path}`, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return await res.json() as T;
  } catch (error) {
    return null;
  }
}
