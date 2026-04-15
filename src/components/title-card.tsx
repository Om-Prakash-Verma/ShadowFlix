import Image from "next/image";
import { AppLink } from "@/components/app-link";

import { buildMediaSlug } from "@/lib/slug";
import { cn, formatRating, getTitle, imageUrl, shimmerDataUrl } from "@/lib/utils";
import type { MediaResult } from "@/types/tmdb";

export function TitleCard({
  item,
  rank,
  largeRank = false,
  compact = false,
  showBadge = false,
  density = "regular",
  className,
}: {
  item: MediaResult;
  rank?: number;
  largeRank?: boolean;
  compact?: boolean;
  showBadge?: boolean;
  density?: "compact" | "regular" | "roomy";
  className?: string;
}) {
  const mediaType = item.media_type === "tv" || item.name ? "tv" : "movie";
  const href = `/${mediaType}/${buildMediaSlug(getTitle(item), item.id)}`;
  const poster = imageUrl(item.poster_path, "w342");
  const rankClassName = largeRank
    ? density === "compact"
      ? "text-[3.2rem] leading-none xl:text-[3.8rem]"
      : density === "roomy"
        ? "text-[4.6rem] leading-none xl:text-[5.2rem]"
        : "text-[3.8rem] leading-none xl:text-[4.2rem]"
    : density === "compact"
      ? "text-[2.0rem] leading-none xl:text-[2.4rem]"
      : density === "roomy"
        ? "text-[3.4rem] leading-none xl:text-[3.8rem]"
        : "text-[2.6rem] leading-none xl:text-[3.0rem]";
  const badgeClassName =
    density === "compact"
      ? "left-1.5 top-1.5 h-9 w-9 border-[3px] text-[11px]"
      : density === "roomy"
        ? "left-2.5 top-2.5 h-11 w-11 border-4 text-sm"
        : "left-2 top-2 h-10 w-10 border-4 text-[13px]";
  const posterClassName =
    density === "compact"
      ? "mb-2 ml-2 mt-2 w-[calc(100%-0.5rem)] rounded-[12px]"
      : density === "roomy"
        ? "mb-3 ml-3 mt-3 w-[calc(100%-0.75rem)] rounded-[14px]"
        : "mb-2.5 ml-2.5 mt-2.5 w-[calc(100%-0.625rem)] rounded-[13px]";
  const titleClassName =
    density === "compact"
      ? "text-[0.82rem]"
      : density === "roomy"
        ? "text-[0.98rem]"
        : "text-[0.9rem]";

  return (
    <AppLink href={href} className={cn("group relative flex min-w-0 flex-col transition duration-300 hover:z-10", className)}>
      <div className="relative overflow-hidden rounded-[18px] border border-white/8 bg-[#0a0314] shadow-[0_16px_45px_rgba(0,0,0,0.36)] transition duration-300 lg:group-hover:-translate-y-1.5 lg:group-hover:border-[#8400ff]/35 lg:group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(132,0,255,0.16),transparent_38%)] opacity-0 transition duration-300 lg:group-hover:opacity-100" />
        {rank ? (
          <span
            className={cn(
              "pointer-events-none absolute bottom-0 left-1 z-40 select-none font-black tracking-[-0.08em] text-transparent [-webkit-text-stroke:2px_rgba(132,0,255,0.92)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.28)]",
              rankClassName,
            )}
          >
            {rank}
          </span>
        ) : null}
        {showBadge ? (
          <div
            className={cn(
              "absolute z-30 flex items-center justify-center rounded-full border-[#f0c22f] bg-black/76 font-bold text-white shadow-[0_8px_22px_rgba(0,0,0,0.32)] transition duration-300 lg:group-hover:scale-105",
              badgeClassName,
            )}
          >
            {formatRating(item.vote_average)}
          </div>
        ) : null}
        {poster ? (
          <Image
            src={poster}
            alt={getTitle(item)}
            title={getTitle(item)}
            width={342}
            height={513}
            sizes="(max-width: 640px) 142px, (max-width: 1024px) 154px, 12vw"
            className={cn(
              "aspect-[0.72] h-auto w-full object-cover transition duration-500 lg:group-hover:scale-107",
              Boolean(rank) && `relative z-10 ${posterClassName}`,
              compact && !largeRank && "aspect-[0.72]",
            )}
            placeholder="blur"
            blurDataURL={shimmerDataUrl(342, 513)}
          />
        ) : (
          <div className="aspect-[0.72] w-full bg-[#1a1a1a]" />
        )}
        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black via-black/76 to-transparent px-3 py-3">
          <p className={cn("line-clamp-2 font-semibold text-white transition duration-300 lg:group-hover:text-[#dbe8ff]", titleClassName)}>
            {getTitle(item)}
          </p>
        </div>
      </div>
    </AppLink>
  );
}
