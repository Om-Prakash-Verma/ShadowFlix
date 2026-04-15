import { SearchResults } from "@/components/search-results";
import { buildListingMetadata } from "@/lib/seo";
import { getSearchResults } from "@/lib/tmdb";

export const runtime = "edge";
export const revalidate = 3600;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  return buildListingMetadata({
    title: query ? `Search Results for ${query}` : "Search Movies, Shows, Collections, and People",
    description: query
      ? `Browse FreeFlix search results for ${query}, including movies, TV shows, collections, and people.`
      : "Search movies, TV shows, collections, and people across FreeFlix.",
    path: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    keywords: ["FreeFlix search", "search movies", "search tv shows", "search collections", "search actors"],
  });
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await getSearchResults(query, 1) : null;

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden border-b border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(132,0,255,0.22),transparent_28%),linear-gradient(180deg,#0a0410,#05020a)] px-4 pb-10 pt-10 md:px-8 md:pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.07),transparent_18%)]" />
        <div className="relative flex w-full flex-col gap-8">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.38em] text-white/52">Search</p>
            <h1 className="mt-4 text-4xl font-black leading-[0.94] text-white sm:text-6xl">
              {query ? `Results for \"${query}\"` : "Search the entire FreeFlix catalog"}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              {query
                ? `Explore movies, TV shows, collections, and people related to ${query} through a richer discovery surface with featured matches and deep scrolling results.`
                : "Use search to jump across movies, TV shows, collections, actors, and studio-linked discovery pages without breaking the streaming flow."}
            </p>
          </div>

          <form action="/search" method="GET" className="grid gap-3 rounded-[28px] border border-white/10 bg-black/28 p-4 backdrop-blur-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search movies, shows, actors, collections"
              className="min-h-14 rounded-full border border-white/12 bg-white/[0.05] px-5 text-white outline-none transition placeholder:text-white/34 focus:border-[#8400ff]"
            />
            <button
              type="submit"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#8400ff] px-7 text-sm font-semibold text-white transition hover:bg-[#a855f7]"
            >
              Search Now
            </button>
          </form>
        </div>
      </section>

      <div className="flex w-full flex-col gap-8 px-4 pt-8 md:px-8">
        {query && results ? (
          <SearchResults
            query={query}
            initialResults={results.results}
            initialPage={results.page}
            totalPages={results.total_pages}
            totalResults={results.total_results}
          />
        ) : (
          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["Movies", "Find theatrical hits, franchise blockbusters, and deep library discoveries."],
              ["TV Shows", "Jump into serialized drama, anime, sitcoms, and bingeable prestige titles."],
              ["People & Collections", "Surface actors, creators, and franchise collections from one query."],
            ].map(([label, copy]) => (
              <div key={label} className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#111113,#0b0b0d)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
                <p className="text-xs uppercase tracking-[0.32em] text-white/42">Discover</p>
                <h2 className="mt-3 text-2xl font-black text-white">{label}</h2>
                <p className="mt-4 text-sm leading-7 text-white/64">{copy}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}