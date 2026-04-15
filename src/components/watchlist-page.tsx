"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { AppLink } from "@/components/app-link";
import MagicBento, { MagicBentoItem } from "@/components/MagicBento";
import { SupportPanel } from "@/components/support-panel";
import { clearActivity, listActivity, watchlistUpdatedEventName, type ActivityEntry, type ActivityKind } from "@/lib/watchlist-db";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ key: ActivityKind | "all"; label: string }> = [
  { key: "all", label: "All Activity" },
  { key: "movie", label: "Movies" },
  { key: "tv", label: "TV Shows" },
  { key: "episode", label: "Episodes" },
  { key: "person", label: "People" },
  { key: "company", label: "Companies" },
  { key: "collection", label: "Collections" },
];

function formatUpdatedAt(timestamp: number) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}

function activityLabel(entry: ActivityEntry) {
  if (entry.kind === "episode") return "Episode";
  if (entry.kind === "tv") return "TV Show";
  if (entry.kind === "person") return "Person";
  if (entry.kind === "company") return "Company";
  if (entry.kind === "collection") return "Collection";
  if (entry.kind === "genre") return "Genre";
  if (entry.kind === "year") return "Year";
  return "Movie";
}

function actionLabel(entry: ActivityEntry) {
  return entry.action === "played" ? "Played" : "Visited";
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 shadow-[0_16px_38px_rgba(0,0,0,0.2)] sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/46 sm:text-[11px]">{label}</p>
        <span className={cn("h-2.5 w-2.5 rounded-full", accent)} />
      </div>
      <p className="mt-3 text-3xl font-black text-white sm:text-4xl">{value}</p>
    </div>
  );
}

function HistoryCard({ entry, compact = false }: { entry: ActivityEntry; compact?: boolean }) {
  return (
    <AppLink
      href={entry.href}
      className={cn(
        "group relative block shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0314] shadow-[0_20px_48px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-[#8400ff]/35 hover:shadow-[0_28px_60px_rgba(0,0,0,0.34)]",
        compact ? "w-[260px] sm:w-[300px]" : "w-[300px] sm:w-[340px] xl:w-auto",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(160deg,#151922,rgba(255,255,255,0.02))]">
        {entry.image ? <Image src={entry.image} alt={entry.title} title={entry.title} fill unoptimized className="object-cover transition duration-700 group-hover:scale-105" /> : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.86))]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/12 bg-black/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/84">{activityLabel(entry)}</span>
          <span className="rounded-full border border-white/12 bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">{actionLabel(entry)}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="line-clamp-2 text-xl font-black leading-tight text-white">{entry.title}</p>
          {entry.subtitle ? <p className="mt-1 line-clamp-1 text-sm text-white/68">{entry.subtitle}</p> : null}
        </div>
      </div>
      <div className="space-y-3 p-4">
        {entry.description ? <p className="line-clamp-3 text-sm leading-6 text-white/62">{entry.description}</p> : null}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/48">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">Seen {entry.seenCount}x</span>
          <span>{formatUpdatedAt(entry.updatedAt)}</span>
        </div>
      </div>
    </AppLink>
  );
}

function HistoryRail({
  title,
  eyebrow,
  entries,
}: {
  title: string;
  eyebrow: string;
  entries: ActivityEntry[];
}) {
  const [page, setPage] = useState(0);
  const pages = useMemo(() => chunkItems(entries, 4), [entries]);

  if (!entries.length) return null;

  const currentPage = Math.min(page, Math.max(pages.length - 1, 0));

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/44 sm:text-xs sm:tracking-[0.34em]">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-[2rem]">{title}</h2>
        </div>
        {pages.length > 1 ? (
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              aria-label={`Previous ${title}`}
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/76 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
              disabled={currentPage === 0}
            >
              {"<"}
            </button>
            <button
              type="button"
              aria-label={`Next ${title}`}
              onClick={() => setPage((value) => Math.min(pages.length - 1, value + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/76 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
              disabled={currentPage >= pages.length - 1}
            >
              {">"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2 lg:hidden snap-x snap-mandatory">
        {entries.map((entry) => (
          <div key={entry.id} className="snap-start">
            <HistoryCard entry={entry} compact />
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden lg:block">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translate3d(-${currentPage * 100}%, 0, 0)` }}
        >
          {pages.map((group, index) => (
            <div key={`${title}-${index}`} className="w-full shrink-0">
              <div className="grid gap-4 xl:grid-cols-4">
                {group.map((entry) => (
                  <HistoryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WatchlistPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const nextEntries = await listActivity();
      if (active) {
        setEntries(nextEntries);
        setLoading(false);
      }
    };

    void load();

    const handleUpdate = () => {
      void load();
    };

    window.addEventListener(watchlistUpdatedEventName(), handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(watchlistUpdatedEventName(), handleUpdate);
    };
  }, []);

  const filteredEntries = useMemo(() => {
    if (activeFilter === "all") return entries;
    return entries.filter((entry) => entry.kind === activeFilter);
  }, [activeFilter, entries]);

  const feed = filteredEntries.length ? filteredEntries : entries;
  const featuredEntry = feed[0] ?? null;

  const stats = useMemo(() => {
    const titles = entries.filter((entry) => entry.kind === "movie" || entry.kind === "tv").length;
    const episodes = entries.filter((entry) => entry.kind === "episode").length;
    const peopleStudios = entries.filter((entry) => ["person", "company", "collection"].includes(entry.kind)).length;
    const discovery = entries.filter((entry) => ["genre", "year"].includes(entry.kind)).length;
    return { titles, episodes, peopleStudios, discovery };
  }, [entries]);

  const recentEntries = feed.slice(0, 12);
  const movieEntries = feed.filter((entry) => entry.kind === "movie").slice(0, 12);
  const tvEntries = feed.filter((entry) => entry.kind === "tv").slice(0, 12);
  const episodeEntries = feed.filter((entry) => entry.kind === "episode").slice(0, 12);
  const peopleStudioEntries = feed.filter((entry) => entry.kind === "person" || entry.kind === "company" || entry.kind === "collection").slice(0, 12);
  const discoveryEntries = feed.filter((entry) => entry.kind === "genre" || entry.kind === "year").slice(0, 12);
  const upperRails = [
    { title: "Continue Watching", eyebrow: "Resume", entries: recentEntries },
    { title: "Movies You Opened", eyebrow: "Movies", entries: movieEntries },
  ].filter((section) => section.entries.length > 0);
  const middleRails = [
    { title: "Series You Opened", eyebrow: "TV Shows", entries: tvEntries },
    { title: "Played Episodes", eyebrow: "Episodes", entries: episodeEntries },
  ].filter((section) => section.entries.length > 0);
  const lowerRails = [
    { title: "People, Studios & Collections", eyebrow: "Connections", entries: peopleStudioEntries },
    { title: "Discovery Trails", eyebrow: "Genre & Year", entries: discoveryEntries },
  ].filter((section) => section.entries.length > 0);

  return (
    <main className="flex w-full flex-col gap-8 px-3 py-6 sm:px-4 sm:py-8 md:px-6 lg:gap-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(132,0,255,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,153,0,0.1),transparent_20%),linear-gradient(180deg,#12081d,#0a0410)] shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03),transparent_38%)]" />
        <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-end lg:p-8">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/48 sm:text-xs sm:tracking-[0.4em]">On Device Memory Lane</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.92] text-white sm:text-5xl lg:text-6xl">Watchlist Reimagined</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
              Your local FreeFlix history now behaves like a streaming home screen: resume points up front, recent trails in motion, and every person, studio, episode, and title grouped into fast browsing rails.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <AppLink
                href={featuredEntry?.href ?? "/"}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#8400ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a855f7]"
              >
                {featuredEntry ? "Resume Latest Visit" : "Start Browsing"}
              </AppLink>
              <button
                type="button"
                onClick={() => void clearActivity()}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/76 transition hover:border-[#ff6b6b]/35 hover:bg-[#ff6b6b]/12 hover:text-white"
              >
                Clear History
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatPill label="Titles" value={String(stats.titles)} accent="bg-[#8400ff]" />
            <StatPill label="Episodes" value={String(stats.episodes)} accent="bg-[#ffb020]" />
            <StatPill label="People & Studios" value={String(stats.peopleStudios)} accent="bg-[#9f7aea]" />
            <StatPill label="Discovery Trails" value={String(stats.discovery)} accent="bg-[#00d48f]" />
          </div>
        </div>
      </section>

      <section className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => {
          const active = filter.key === activeFilter;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                active
                  ? "border-[#8400ff] bg-[#8400ff]/16 text-white shadow-[0_10px_24px_rgba(132,0,255,0.18)]"
                  : "border-white/10 bg-white/[0.03] text-white/68 hover:border-white/18 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </section>

      {loading ? (
        <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
          {[0, 1, 2].map((index) => (
            <MagicBentoItem key={index} className="lg:col-span-4">
              <div className="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03]">
                <div className="aspect-[16/10] animate-pulse bg-white/[0.05]" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/[0.05]" />
                  <div className="h-16 animate-pulse rounded-[18px] bg-white/[0.04]" />
                </div>
              </div>
            </MagicBentoItem>
          ))}
        </MagicBento>
      ) : feed.length ? (
        <>
          {featuredEntry ? (
            <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
              <MagicBentoItem className="self-start lg:col-span-9" cardClassName="p-0">
                <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0e1015] shadow-[0_26px_72px_rgba(0,0,0,0.34)]">
                  <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px]">
                    {featuredEntry.image ? <Image src={featuredEntry.image} alt={featuredEntry.title} title={featuredEntry.title} fill unoptimized className="object-cover" /> : null}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94),rgba(0,0,0,0.48)_50%,rgba(0,0,0,0.88)),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.88))]" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-5 lg:p-6">
                      <div className="rounded-full border border-white/12 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/82 sm:text-[11px]">
                        {activityLabel(featuredEntry)}
                      </div>
                      <div className="rounded-full border border-white/12 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/70 sm:text-[11px]">
                        {actionLabel(featuredEntry)}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 max-w-3xl p-4 sm:p-6 lg:p-8">
                      <p className="text-[10px] uppercase tracking-[0.34em] text-white/48 sm:text-xs sm:tracking-[0.4em]">Featured From Your Device</p>
                      <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl lg:text-6xl">{featuredEntry.title}</h2>
                      {featuredEntry.subtitle ? <p className="mt-2 text-sm text-white/68 sm:text-base">{featuredEntry.subtitle}</p> : null}
                      {featuredEntry.description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">{featuredEntry.description}</p> : null}
                      <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/56">
                        <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5">Seen {featuredEntry.seenCount}x</span>
                        <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5">{formatUpdatedAt(featuredEntry.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </MagicBentoItem>
              <MagicBentoItem className="self-start lg:col-span-3">
                <SupportPanel
                  eyebrow="Browse Memory"
                  title="Control Your History Flow"
                  description="Pivot between titles, episodes, people, and discovery trails. This side panel keeps the memory lane structured while the featured card handles the visual focus."
                  links={[
                    { eyebrow: "Resume", label: "Latest Entry", href: featuredEntry.href },
                    { eyebrow: "Movies", label: "Top Movies", href: "/top-movies" },
                    { eyebrow: "TV", label: "Top TV Shows", href: "/top-tv-shows" },
                  ]}
                />
              </MagicBentoItem>
            </MagicBento>
          ) : null}

          {upperRails.length ? (
            <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
              {upperRails.map((section) => (
                <MagicBentoItem key={section.title} className={upperRails.length === 1 ? "self-start lg:col-span-12" : "self-start lg:col-span-6"} cardClassName="p-0">
                  <HistoryRail title={section.title} eyebrow={section.eyebrow} entries={section.entries} />
                </MagicBentoItem>
              ))}
            </MagicBento>
          ) : null}

          {middleRails.length ? (
            <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
              {middleRails.map((section) => (
                <MagicBentoItem key={section.title} className={middleRails.length === 1 ? "self-start lg:col-span-12" : "self-start lg:col-span-6"} cardClassName="p-0">
                  <HistoryRail title={section.title} eyebrow={section.eyebrow} entries={section.entries} />
                </MagicBentoItem>
              ))}
            </MagicBento>
          ) : null}

          {lowerRails.length ? (
            <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
              {lowerRails.map((section) => (
                <MagicBentoItem key={section.title} className={lowerRails.length === 1 ? "self-start lg:col-span-12" : "self-start lg:col-span-6"} cardClassName="p-0">
                  <HistoryRail title={section.title} eyebrow={section.eyebrow} entries={section.entries} />
                </MagicBentoItem>
              ))}
            </MagicBento>
          ) : null}
        </>
      ) : (
        <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
          <MagicBentoItem className="lg:col-span-12">
            <section className="overflow-hidden rounded-[30px] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(132,0,255,0.12),transparent_32%),linear-gradient(180deg,#0c0418,#09090b)] px-6 py-16 text-center sm:px-8">
              <p className="text-3xl font-black text-white sm:text-4xl">No local activity yet</p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base sm:leading-8">
                Start opening titles, episodes, people, companies, genres, or collections and this page will turn into a carousel-driven playback memory lane.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <AppLink
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#8400ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
                >
                  Explore Home
                </AppLink>
                <AppLink
                  href="/top-movies"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  Browse Movies
                </AppLink>
              </div>
            </section>
          </MagicBentoItem>
        </MagicBento>
      )}
    </main>
  );
}
