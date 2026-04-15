import Image from "next/image";
import { AppLink } from "@/components/app-link";

import { buildMediaSlug } from "@/lib/slug";
import { getTitle, imageUrl, shimmerDataUrl, truncate } from "@/lib/utils";
import type { MediaResult } from "@/types/tmdb";

export function FeaturedBanner({ item }: { item: MediaResult }) {
  const mediaType = item.media_type === "tv" || item.name ? "tv" : "movie";
  const href = `/${mediaType}/${buildMediaSlug(getTitle(item), item.id)}`;
  const image = imageUrl(item.backdrop_path ?? item.poster_path, "w1280");

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#111111] shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
      {image ? (
        <Image
          src={image}
          alt={getTitle(item)}
          title={getTitle(item)}
          width={1280}
          height={720}
          sizes="100vw"
          className="aspect-[21/8] h-auto w-full object-cover"
          placeholder="blur"
          blurDataURL={shimmerDataUrl(1280, 720)}
        />
      ) : (
        <div className="aspect-[21/8] w-full bg-[#1a1a1a]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.88))]" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-2xl px-6 py-8 sm:px-10 lg:px-14">
          <p className="text-xs uppercase tracking-[0.42em] text-white/62">Featured Banner</p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">{getTitle(item)}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">{truncate(item.overview || "Step into a bold cinematic centerpiece picked from today's most compelling releases.", 180)}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <AppLink href={href} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/88">Play Now</AppLink>
            <AppLink href={href} className="rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">Open details</AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}