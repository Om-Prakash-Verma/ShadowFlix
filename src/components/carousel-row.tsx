"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppLink } from "@/components/app-link";

import { TitleCard } from "@/components/title-card";
import { cn, dedupeById } from "@/lib/utils";
import type { MediaResult } from "@/types/tmdb";

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function CarouselRow({
  title,
  items,
  viewAllHref,
  rankMode = false,
  rankNumbers = false,
  accentLabel,
  loadMore,
}: {
  title: string;
  items: MediaResult[];
  viewAllHref?: string;
  rankMode?: boolean;
  rankNumbers?: boolean;
  accentLabel?: string;
  loadMore?: {
    apiPath: string;
    totalPages: number;
    initialPage?: number;
  };
}) {
  const [page, setPage] = useState(0);
  const [loadedItems, setLoadedItems] = useState(items);
  const [loadedPage, setLoadedPage] = useState(loadMore?.initialPage ?? 1);
  const [totalPages, setTotalPages] = useState(loadMore?.totalPages ?? 1);
  const [loading, setLoading] = useState(false);
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  const mobileSentinelRef = useRef<HTMLDivElement | null>(null);
  const [desktopPageSize, setDesktopPageSize] = useState(rankMode ? 8 : 9);
  const pages = useMemo(() => chunkItems(loadedItems, desktopPageSize), [loadedItems, desktopPageSize]);
  const canLoadMore = Boolean(loadMore) && loadedPage < totalPages;
  const nextDisabled = !canLoadMore && page >= pages.length - 1;
  const density = desktopPageSize <= 5 ? "roomy" : desktopPageSize <= 7 ? "regular" : "compact";

  const loadNextPage = useCallback(async () => {
    if (!loadMore || !canLoadMore || loading) {
      return false;
    }

    setLoading(true);
    try {
      const nextPage = loadedPage + 1;
      const separator = loadMore.apiPath.includes("?") ? "&" : "?";
      const response = await fetch(`${loadMore.apiPath}${separator}page=${nextPage}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load more items for ${title}.`);
      }

      const payload = (await response.json()) as {
        page: number;
        total_pages: number;
        results: MediaResult[];
      };

      setLoadedItems((current) => dedupeById([...current, ...payload.results]));
      setLoadedPage(payload.page);
      setTotalPages(payload.total_pages);
      return true;
    } finally {
      setLoading(false);
    }
  }, [canLoadMore, loadMore, loadedPage, loading, title]);

  async function handleNext() {
    if (page < pages.length - 1) {
      setPage((value) => value + 1);
      return;
    }

    const loaded = await loadNextPage();
    if (loaded) {
      setPage((value) => value + 1);
    }
  }

  useEffect(() => {
    const scroller = mobileScrollerRef.current;
    const sentinel = mobileSentinelRef.current;

    if (!scroller || !sentinel || !loadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          void loadNextPage();
        }
      },
      {
        root: scroller,
        rootMargin: "0px 160px 0px 0px",
        threshold: 0.85,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loadNextPage]);

  useEffect(() => {
    const section = desktopSectionRef.current;
    if (!section) {
      return;
    }

    const updateDesktopColumns = () => {
      const width = section.getBoundingClientRect().width;
      const idealCardWidth = rankMode ? 116 : 108;
      const nextPageSize = Math.max(5, Math.min(rankMode ? 8 : 10, Math.floor(width / idealCardWidth)));
      setDesktopPageSize((current) => (current === nextPageSize ? current : nextPageSize));
    };

    updateDesktopColumns();

    const observer = new ResizeObserver(() => {
      updateDesktopColumns();
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, [rankMode]);

  return (
    <section ref={desktopSectionRef} className="content-auto flex h-full w-full flex-col justify-center space-y-5">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
          {accentLabel ? <span className="hidden shrink-0 text-[3.5rem] leading-none font-black tracking-[-0.08em] text-[#8400ff] lg:block">{accentLabel}</span> : null}
          <div className="flex min-w-0 flex-col">
            <h2 className="text-[1.6rem] font-black tracking-tight text-white sm:text-[2rem]">{title}</h2>
            {viewAllHref ? <AppLink href={viewAllHref} className="pointer-events-auto mt-0.5 text-sm font-medium text-[#8400ff] transition hover:text-white sm:text-base">View all<span className="hidden xl:inline"> {title}</span></AppLink> : null}
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <button
            type="button"
            aria-label={`Previous ${title}`}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/4 text-lg text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={page === 0}
          >
            {"<"}
          </button>
          <button
            type="button"
            aria-label={`Next ${title}`}
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/4 text-lg text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={nextDisabled}
          >
            {loading ? "..." : ">"}
          </button>
        </div>
      </div>

      <div ref={mobileScrollerRef} className="flex gap-3 overflow-x-auto pb-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
        {loadedItems.map((item, index) => (
          <TitleCard
            key={`${item.id}-mobile`}
            item={item}
            rank={rankMode || rankNumbers ? index + 1 : undefined}
            largeRank={rankMode}
            compact
            showBadge={!rankMode}
            density="regular"
            className={cn("snap-start shrink-0", rankMode ? "w-[176px] sm:w-[190px]" : "w-[142px] sm:w-[154px]")}
          />
        ))}
        {loadMore ? (
          <div ref={mobileSentinelRef} className="flex shrink-0 snap-start items-center pr-1">
            {canLoadMore || loading ? (
              <div className="flex h-full min-h-[220px] w-16 items-center justify-center rounded-[20px] border border-dashed border-white/12 bg-white/[0.03] px-2 text-center text-[11px] uppercase tracking-[0.18em] text-white/42 sm:min-h-[236px]">
                {loading ? "Loading" : "More"}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-hidden lg:block">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
        >
          {pages.map((itemsPage, pageIndex) => (
            <div key={`${title}-${pageIndex}`} className="w-full shrink-0">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${desktopPageSize}, minmax(0, 1fr))`,
                }}
              >
                {itemsPage.map((item, index) => (
                  <TitleCard
                    key={`${item.id}-${pageIndex}`}
                    item={item}
                    rank={rankMode || rankNumbers ? pageIndex * desktopPageSize + index + 1 : undefined}
                    largeRank={rankMode}
                    compact
                    showBadge={!rankMode}
                    density={density}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
