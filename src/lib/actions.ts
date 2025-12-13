
'use server';

import {
    movieSchema,
    tvSchema,
    pagedResponseSchema,
    searchResultSchema,
    type Movie,
    type TVShow,
    type SearchResult,
} from './tmdb-schemas';
import { fetchTMDB, fetchPagedData } from './tmdb';
import { z } from 'zod';

// This file is now safe to be removed or have its contents reduced,
// as the client-side fetching logic has been moved to use the API proxy directly.
// For now, we will keep the search action as it might be used differently.

// --- From actions/search.ts ---

type SearchMultiParams = {
    query: string;
    page: number;
};

export async function searchMulti({ query, page }: SearchMultiParams): Promise<{ results: SearchResult[], total_pages: number }> {
    const searchSchema = pagedResponseSchema(searchResultSchema);
    const params = {
        query,
        page,
        include_adult: 'false',
    };
    const data = await fetchTMDB(search_multi_path, params, searchSchema);

    if (!data) {
        return { results: [], total_pages: 0 };
    }

    // Filter out results that don't have a poster or profile path
    const filteredResults = data.results.filter(item => {
        if (item.media_type === 'person') {
            return item.profile_path;
        }
        return item.poster_path;
    });

    return { results: filteredResults, total_pages: data.total_pages };
}

// Define the search path, which was missing.
const search_multi_path = 'search/multi';
