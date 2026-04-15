"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { AppLink } from "@/components/app-link";
import { buildMediaSlug } from "@/lib/slug";
import { getTitle, imageUrl, shimmerDataUrl, truncate } from "@/lib/utils";
import type { SearchCollectionResult, SearchPersonResult, SearchResult } from "@/types/tmdb";

function isPersonResult(result: SearchResult): result is SearchPersonResult {
  return result.media_type === "person";
}

function isCollectionResult(result: SearchResult): result is SearchCollectionResult {
  return result.media_type === "collection";
}

function getResultHref(result: SearchResult) {
  if (isPersonResult(result)) {
    return `/person/${buildMediaSlug(result.name ?? "person", result.id)}`;
  }

  if (isCollectionResult(result)) {
    return `/collections/${result.id}`;
  }

  const mediaType = result.media_type === "tv" || result.name ? "tv" : "movie";
  return `/${mediaType}/${buildMediaSlug(getTitle(result), result.id)}`;
}

function getResultImage(result: SearchResult) {
  if (isPersonResult(result)) {
    return imageUrl(result.profile_path, "w342");
  }

  return imageUrl(result.poster_path ?? result.backdrop_path, "w500");
}

function getResultTypeLabel(result: SearchResult) {
  if (isPersonResult(result)) return "person";
  if (isCollectionResult(result)) return "collection";
  return result.media_type === "tv" || result.name ? "tv" : "movie";
}

export function SearchResults({
  initialResults,
  initialPage,
  totalPages,
  totalResults,
  query,
}: {
  initialResults: SearchResult[];
  initialPage: number;
  totalPages: number;
  totalResults: number;
  query: string;
}) {
  const [results, setResults] = useState(initialResults);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setResults(initialResults);
    setPage(initialPage);
    setHasMore(initialPage < totalPages);
  }, [initialPage, initialResults, totalPages, query]);

  const featuredResult = results[0] ?? null;
  const restResults = results.slice(1);

  const breakdown = useMemo(() => {
    const counts = { movie: 0, tv: 0, person: 0, collection: 0 };
    results.forEach((result) => {
      const type = getResultTypeLabel(result) as keyof typeof counts;
      counts[type] += 1;
    });
    return counts;
  }, [results]);

  const loadMore = useMemo(
    () => async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const nextPage = page + 1;
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${nextPage}`);
        if (!response.ok) {
          throw new Error("Failed to load more search results");
        }

        const payload = (await response.json()) as {
          page: number;
          total_pages: number;
          results: SearchResult[];
        };

        setResults((current) => {
          const merged = [...current, ...payload.results];
          return merged.filter(
            (item, index) => index === merged.findIndex((entry) => entry.id === item.id && entry.media_type === item.media_type),
          );
        });
        setPage(payload.page);
        setHasMore(payload.page < payload.total_pages);
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore, isLoading, page, query],
  );

  useEffect(() => {
    if (!hasMore || !observerRef.current) return;

    const node = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-white/44">Discovery Feed</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Search Results</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-white/64">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">{totalResults} matches</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">{breakdown.movie} Movies</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">{breakdown.tv} TV</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">{breakdown.collection} Collections</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">{breakdown.person} People</span>
        </div>
      </div>

      {featuredResult ? (
        <AppLink href={getResultHref(featuredResult)} className="group block">
          <div className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,#111113,#09090b)] shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
            <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="relative min-h-[360px] overflow-hidden xl:min-h-[440px]">
                {getResultImage(featuredResult) ? (
                  <Image
                    src={getResultImage(featuredResult)!}
                    alt={isPersonResult(featuredResult) || isCollectionResult(featuredResult) ? featuredResult.name : getTitle(featuredResult)}
                    title={isPersonResult(featuredResult) || isCollectionResult(featuredResult) ? featuredResult.name : getTitle(featuredResult)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105" sizes="100vw"
                    placeholder="blur"
                    blurDataURL={shimmerDataUrl(1200, 700)}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.54)_52%,rgba(0,0,0,0.88)),linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]" />
                <div className="relative flex h-full items-end p-6 sm:p-8">
                  <div className="max-w-2xl">
                    <span className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/72">
                      Featured {getResultTypeLabel(featuredResult)}
                    </span>
                    <h3 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl">
                      {isPersonResult(featuredResult) || isCollectionResult(featuredResult) ? featuredResult.name : getTitle(featuredResult)}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                      {truncate(
                        isPersonResult(featuredResult)
                          ? featuredResult.known_for_department || "Explore this person profile and connected credits."
                          : featuredResult.overview || "Open the detail page to continue browsing this title.",
                        220,
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 border-t border-white/8 p-6 sm:grid-cols-3 xl:border-l xl:border-t-0 xl:grid-cols-1 xl:p-8">
                {[
                  ["Type", getResultTypeLabel(featuredResult)],
                  ["Route", getResultHref(featuredResult)],
                  ["Discovery", isPersonResult(featuredResult) ? "Person page" : isCollectionResult(featuredResult) ? "Collection page" : "Watch page"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">{label}</p>
                    <p className="mt-3 break-all text-sm font-medium text-white/72">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppLink>
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
        {restResults.map((result) => {
          const image = getResultImage(result);
          return (
            <AppLink key={`${result.media_type}-${result.id}`} href={getResultHref(result)} className="group block">
              <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[#0a0314] shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
                {image ? (
                  <Image
                    src={image}
                    alt={isPersonResult(result) ? result.name ?? "Person" : isCollectionResult(result) ? result.name : getTitle(result)}
                    title={isPersonResult(result) ? result.name ?? "Person" : isCollectionResult(result) ? result.name : getTitle(result)}
                    width={342}
                    height={513}
                    className="aspect-[0.72] h-auto w-full object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 45vw, (max-width: 1280px) 28vw, 18vw"
                    placeholder="blur"
                    blurDataURL={shimmerDataUrl(342, 513)}
                  />
                ) : (
                  <div className="aspect-[0.72] w-full bg-[#1a1a1a]" />
                )}
                <div className="absolute inset-x-0 top-3 flex justify-start px-3">
                  <span className="rounded-full border border-white/10 bg-black/72 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/72">
                    {getResultTypeLabel(result)}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/82 to-transparent px-4 py-4">
                  <p className="line-clamp-2 text-[0.98rem] font-semibold text-white">
                    {isPersonResult(result) || isCollectionResult(result) ? result.name : getTitle(result)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/60">
                    {isPersonResult(result)
                      ? truncate(result.known_for_department || "Person", 40)
                      : isCollectionResult(result)
                        ? truncate(result.overview || "Open collection page", 50)
                        : truncate(result.overview || "Open detail page", 50)}
                  </p>
                </div>
              </div>
            </AppLink>
          );
        })}
      </div>

      {hasMore ? (
        <div ref={observerRef} className="flex items-center justify-center py-6">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={isLoading}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-7 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? "Loading more..." : "Load more results"}
          </button>
        </div>
      ) : null}
    </section>
  );
}