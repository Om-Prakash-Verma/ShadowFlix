"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AppLink } from "@/components/app-link";

import { buildMediaSlug } from "@/lib/slug";
import { formatRating, getTitle, getYear, imageUrl, shimmerDataUrl, truncate } from "@/lib/utils";
import type { Genre, MediaResult } from "@/types/tmdb";

export function HeroBanner({ item, previews, genres }: { item: MediaResult; previews: MediaResult[]; genres: Genre[] }) {
  const featuredItems = useMemo(
    () => [item, ...previews].filter((entry, index, list) => index === list.findIndex((candidate) => candidate.id === entry.id)),
    [item, previews],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const safeIndex = featuredItems.length ? activeIndex % featuredItems.length : 0;
  const activeItem = featuredItems[safeIndex] ?? item;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (featuredItems.length < 2) return;

    const interval = isMobile ? 12000 : 7000;
    const timer = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % featuredItems.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [featuredItems.length, isMobile]);

  const mediaType = activeItem.media_type === "tv" || activeItem.name ? "tv" : "movie";
  const href = `/${mediaType}/${buildMediaSlug(getTitle(activeItem), activeItem.id)}`;
  const genreLabels = (activeItem.genre_ids ?? [])
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(" / ");

  return (
    <section className="relative min-h-[58svh] overflow-hidden bg-black">
      {featuredItems.map((entry, index) => {
        const entryBackdrop = imageUrl(entry.backdrop_path ?? entry.poster_path, "w1280");
        if (!entryBackdrop) return null;

        const isVisible = index === safeIndex;
        if (isMobile && !isVisible) return null;

        const isPrimaryLcp = index === 0 && safeIndex === 0;

        return (
          <Image
            key={entry.id}
            src={entryBackdrop}
            alt={getTitle(entry)}
            title={getTitle(entry)}
            fill
            preload={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="100vw"
            className={`object-cover object-center ${isPrimaryLcp ? "opacity-100" : `transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}`}
            placeholder="blur"
            blurDataURL={shimmerDataUrl(1280, 720)}
          />
        );
      })}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,14,0.96),rgba(2,6,14,0.52)_42%,rgba(2,6,14,0.82)),radial-gradient(circle_at_top_right,rgba(132,0,255,0.16),transparent_26%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05070c] via-[#05070c]/72 to-transparent" />
      <div className="relative grid min-h-[58svh] w-full gap-8 px-4 pb-10 pt-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_210px]">
        <div className="flex max-w-2xl flex-col justify-end">
          <p className="mb-3 text-[0.72rem] uppercase tracking-[0.42em] text-white/58">Featured Tonight</p>
          <h1 className="max-w-xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">{getTitle(activeItem)}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/72">
            <span>{getYear(activeItem)}</span>
            <span>TMDB {formatRating(activeItem.vote_average)}</span>
            {genreLabels ? <span>{genreLabels}</span> : null}
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/74 sm:text-base">{truncate(activeItem.overview || "Explore the most talked-about new release with a premium streaming-style detail view.", 170)}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <AppLink href={href} className="rounded-full bg-[#8400ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c489ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]">Play Now</AppLink>
            <AppLink href={href} className="rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12">Open details</AppLink>
          </div>
          {featuredItems.length > 1 ? (
            <div className="mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {featuredItems.map((entry, index) => {
                const active = index === safeIndex;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${getTitle(entry)}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c489ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
                  >
                    <span className={`block rounded-full transition-all ${active ? "h-3 w-8 bg-[#4f8fff]" : "h-3 w-3 bg-white/55 hover:bg-white/78"}`} />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
        <aside className="hidden flex-col justify-end gap-3 lg:flex">
          <p className="text-[0.72rem] uppercase tracking-[0.3em] text-white/56">Up Next</p>
          {featuredItems.slice(1, 5).map((preview) => {
            const previewImage = imageUrl(preview.backdrop_path ?? preview.poster_path, "w185");
            const previewIndex = featuredItems.findIndex((entry) => entry.id === preview.id);
            return (
              <button
                key={preview.id}
                type="button"
                onClick={() => setActiveIndex(previewIndex)}
                className="group flex w-full max-w-[210px] gap-3 overflow-hidden rounded-2xl border border-white/10 bg-black/34 p-2 text-left backdrop-blur-md transition hover:scale-[1.02] hover:bg-black/58 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c489ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c]"
              >
                <div className="relative h-14 w-20 overflow-hidden rounded-xl bg-[#111111]">
                  {previewImage ? <Image src={previewImage} alt={getTitle(preview)} title={getTitle(preview)} fill sizes="80px" className="object-cover transition duration-500 group-hover:scale-105" placeholder="blur" blurDataURL={shimmerDataUrl(185, 104)} /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-white">{getTitle(preview)}</p>
                  <p className="mt-1 text-xs text-white/56">{getYear(preview)}</p>
                </div>
              </button>
            );
          })}
        </aside>
      </div>
    </section>
  );
}