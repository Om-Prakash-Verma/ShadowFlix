'use server';

import {
    type SearchResult,
    type PagedResponse,
} from './tmdb-schemas';
import { fetchTMDB } from './tmdb';

type SearchMultiParams = {
    query: string;
    page: number;
};

const search_multi_path = 'search/multi';

export async function searchMulti({ query, page }: SearchMultiParams): Promise<{ results: SearchResult[], total_pages: number }> {
    const params = {
        query,
        page,
        include_adult: 'false',
    };
    
    const data = await fetchTMDB<PagedResponse<SearchResult>>(search_multi_path, params);

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
