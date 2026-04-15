"use client";

import { useMemo, useState } from "react";

import { AppLink } from "@/components/app-link";

function chunkItems<T>(items: readonly T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push([...items.slice(index, index + size)]);
  }
  return chunks;
}

export function DecadeRow({ decades }: { decades: readonly number[] }) {
  const [page, setPage] = useState(0);
  const pages = useMemo(() => chunkItems(decades, 5), [decades]);

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Explore By Decade</h2>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            aria-label="Previous decades"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/4 text-lg text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={page === 0}
          >
            {'<'}
          </button>
          <button
            type="button"
            aria-label="Next decades"
            onClick={() => setPage((value) => Math.min(pages.length - 1, value + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/4 text-lg text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={page >= pages.length - 1}
          >
            {'>'}
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
        {decades.map((decade) => (
          <AppLink
            key={`${decade}-mobile`}
            href={`/year/${decade}`}
            className="flex min-h-[132px] w-[190px] shrink-0 snap-start items-end rounded-[28px] border border-white/8 bg-[linear-gradient(160deg,#111111,rgba(255,255,255,0.05))] px-5 py-6 text-3xl font-black text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:scale-[1.03] sm:min-h-[152px] sm:w-[220px] sm:px-6 sm:py-8 sm:text-4xl"
          >
            {decade}s
          </AppLink>
        ))}
      </div>

      <div className="hidden overflow-hidden lg:block">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translate3d(-${page * 100}%, 0, 0)` }}
        >
          {pages.map((decadesPage, pageIndex) => (
            <div key={`decades-${pageIndex}`} className="w-full shrink-0">
              <div className="grid gap-4 xl:grid-cols-5">
                {decadesPage.map((decade) => (
                  <AppLink
                    key={`${decade}-${pageIndex}`}
                    href={`/year/${decade}`}
                    className="flex min-h-[156px] items-end rounded-[28px] border border-white/8 bg-[linear-gradient(160deg,#111111,rgba(255,255,255,0.05))] px-6 py-8 text-4xl font-black text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:scale-[1.03]"
                  >
                    {decade}s
                  </AppLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}