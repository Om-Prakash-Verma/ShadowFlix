import Image from "next/image";
import { AppLink } from "@/components/app-link";

import { getTitle, imageUrl, shimmerDataUrl } from "@/lib/utils";
import type { MediaResult } from "@/types/tmdb";

export function MoodGrid({ items }: { items: Array<{ title: string; href: string; item: MediaResult }>; }) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-white sm:text-2xl">Discover By Mood</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((mood) => {
          const image = imageUrl(mood.item?.backdrop_path ?? mood.item?.poster_path, "w500");
          return (
            <AppLink key={mood.title} href={mood.href} className="group relative overflow-hidden rounded-[26px] border border-white/8 bg-[#111111] transition hover:scale-[1.03]">
              {image ? <Image src={image} alt={getTitle(mood.item)} title={mood.title} width={500} height={281} className="aspect-[16/9] h-auto w-full object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" placeholder="blur" blurDataURL={shimmerDataUrl(500, 281)} /> : <div className="aspect-[16/9] w-full bg-[#1a1a1a]" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/38 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/58">Mood Match</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{mood.title}</h3>
              </div>
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}

