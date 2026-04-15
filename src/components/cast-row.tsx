import Image from "next/image";

import { AppLink } from "@/components/app-link";
import { buildMediaSlug } from "@/lib/slug";
import { imageUrl, shimmerDataUrl, truncate } from "@/lib/utils";
import type { CastMember } from "@/types/tmdb";

export function CastRow({ cast }: { cast: CastMember[] }) {
  if (!cast.length) return null;

  return (
    <section className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#12081d,#0a0410)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition duration-300 hover:border-white/12 hover:shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:rounded-[28px] sm:p-6 lg:rounded-[32px] lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/44 sm:text-xs sm:tracking-[0.34em]">Cast</p>
          <h2 className="mt-2.5 text-2xl font-black text-white sm:mt-3 sm:text-3xl lg:text-4xl">Faces In The Story</h2>
        </div>
        <AppLink href="/search" className="text-sm font-medium text-[#a855f7] transition hover:text-white sm:text-base">
          Find more people
        </AppLink>
      </div>

      <div className="scrollbar-hide mt-5 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory sm:mt-6 sm:gap-4">
        {cast.map((member) => {
          const image = imageUrl(member.profile_path, "w300");
          return (
            <AppLink
              key={member.id}
              href={`/person/${buildMediaSlug(member.name, member.id)}`}
              className="group w-[132px] shrink-0 snap-start sm:w-[154px] lg:w-[172px]"
            >
              <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0314] shadow-[0_16px_45px_rgba(0,0,0,0.36)] transition duration-300 group-hover:-translate-y-1.5 group-hover:border-[#8400ff]/45 group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.4)] sm:rounded-[24px]">
                {image ? (
                  <Image
                    src={image}
                    alt={member.name}
                    title={member.name}
                    width={300}
                    height={450}
                    className="aspect-[0.75] h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={shimmerDataUrl(300, 450)}
                  />
                ) : (
                  <div className="aspect-[0.75] w-full bg-[#1a1a1a]" />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,0,255,0.2),transparent_40%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/82 to-transparent px-3 py-3 sm:px-4 sm:py-4">
                  <p className="line-clamp-2 text-xs font-semibold text-white transition duration-300 group-hover:text-[#e9d5ff] sm:text-sm">{member.name}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-white/62 sm:text-xs sm:leading-5">
                    {truncate(member.character || member.known_for_department || "Cast Member", 40)}
                  </p>
                </div>
              </div>
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}