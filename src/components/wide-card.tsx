import Image from "next/image";
import { AppLink } from "@/components/app-link";

import { buildMediaSlug } from "@/lib/slug";
import { getTitle, imageUrl, shimmerDataUrl } from "@/lib/utils";
import type { MediaResult } from "@/types/tmdb";

export function WideCard({ item, title, href }: { item: MediaResult; title: string; href: string; }) {
  const mediaType = item.media_type === "tv" || item.name ? "tv" : "movie";
  const detailHref = `/${mediaType}/${buildMediaSlug(getTitle(item), item.id)}`;
  const backdrop = imageUrl(item.backdrop_path ?? item.poster_path, "w500");

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      {backdrop ? <Image src={backdrop} alt={title}
              title={title} width={500} height={281} className="aspect-[16/9] h-auto w-full object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={shimmerDataUrl(500, 281)} /> : <div className="aspect-[16/9] w-full bg-[#1a1a1a]" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/55">Collection</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
        </div>
        <div className="flex gap-3">
          <AppLink href={href} className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/14">View all titles</AppLink>
          <AppLink href={detailHref} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/88">Open title</AppLink>
        </div>
      </div>
    </article>
  );
}

