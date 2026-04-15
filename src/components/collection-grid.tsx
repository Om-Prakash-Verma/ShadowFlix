"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AppLink } from "@/components/app-link";

import { imageUrl } from "@/lib/utils";

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function CollectionGrid({
  items,
}: {
  items: Array<{
    id: number;
    name: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    count: number;
  }>;
}) {
  const [page, setPage] = useState(0);
  const pages = useMemo(() => chunkItems(items, 5), [items]);

  return (
    <section className="content-auto space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-[1.6rem] font-black tracking-tight text-white sm:text-[2rem]">Featured Collections</h2>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            aria-label="Previous collections"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/4 text-lg text-white/80 transition hover:scale-105 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={page === 0}
          >
            {"<"}
          </button>
          <button
            type="button"
            aria-label="Next collections"
            onClick={() => setPage((value) => Math.min(pages.length - 1, value + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/4 text-lg text-white/80 transition hover:scale-105 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={page >= pages.length - 1}
          >
            {">"}
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
        {items.map((collection) => {
          const image = imageUrl(collection.backdrop_path ?? collection.poster_path, "w500");
          return (
            <AppLink
              key={`${collection.id}-mobile`}
              href={`/collections/${collection.id}`}
              className="group block w-[280px] shrink-0 snap-start sm:w-[340px]"
            >
              <div className="relative aspect-[1.35] overflow-hidden rounded-[22px] border border-white/8 bg-[#0a0314] shadow-[0_16px_45px_rgba(0,0,0,0.36)] transition duration-300 lg:group-hover:-translate-y-1.5 lg:group-hover:border-[#8400ff]/35 lg:group-hover:shadow-[0_26px_58px_rgba(0,0,0,0.4)]">
                {image ? (
                  <Image
                    src={image}
                    alt={collection.name}
                    title={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 lg:group-hover:scale-108"
                    sizes="(max-width: 768px) 78vw, 340px"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,0,255,0.18),transparent_38%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="line-clamp-2 text-[1.05rem] font-black text-white transition duration-300 group-hover:text-[#dbe8ff]">{collection.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-white/70">{collection.count} Movies</p>
                </div>
              </div>
            </AppLink>
          );
        })}
      </div>

      <div className="hidden overflow-hidden lg:block">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
        >
          {pages.map((collectionsPage, pageIndex) => (
            <div key={`collections-${pageIndex}`} className="w-full shrink-0">
              <div className="grid gap-4 xl:grid-cols-5">
                {collectionsPage.map((collection) => {
                  const image = imageUrl(collection.backdrop_path ?? collection.poster_path, "w500");
                  return (
                    <AppLink
                      key={`${collection.id}-${pageIndex}`}
                      href={`/collections/${collection.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-[1.35] overflow-hidden rounded-[22px] border border-white/8 bg-[#0a0314] shadow-[0_16px_45px_rgba(0,0,0,0.36)] transition duration-300 lg:group-hover:-translate-y-1.5 lg:group-hover:border-[#8400ff]/35 lg:group-hover:shadow-[0_26px_58px_rgba(0,0,0,0.4)]">
                        {image ? (
                          <Image
                            src={image}
                            alt={collection.name}
                    title={collection.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-108"
                            sizes="20vw"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,0,255,0.18),transparent_38%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <h3 className="line-clamp-2 text-[1.05rem] font-black text-white transition duration-300 group-hover:text-[#dbe8ff]">{collection.name}</h3>
                          <p className="mt-1 text-sm font-semibold text-white/70">{collection.count} Movies</p>
                        </div>
                      </div>
                    </AppLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}