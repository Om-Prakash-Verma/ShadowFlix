"use client";

import { AppLink } from "@/components/app-link";

export function SiteHeader() {
  return (
    <header id="site-header" className="sticky top-0 z-50 transition-all duration-300 border-b border-white/6 bg-[linear-gradient(180deg,rgba(5,7,12,0.96),rgba(5,7,12,0.88))] backdrop-blur-lg lg:backdrop-blur-2xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(132,0,255,0.28),transparent)]" />

      <div className="flex w-full flex-col gap-3 px-3 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-6">
          <div className="flex min-w-0 items-center gap-3 lg:gap-8 xl:flex-1">
            <AppLink href="/" className="group flex shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-2 transition hover:border-[#8400ff]/40 hover:bg-[#8400ff]/10 sm:gap-3 sm:px-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#b066ff,#5800a8)] text-xs font-black text-white shadow-[0_0_24px_rgba(132,0,255,0.35)] sm:h-9 sm:w-9 sm:text-sm">
                F
              </span>
              <span className="hidden text-base font-black tracking-tight text-white min-[380px]:inline sm:text-[1.05rem]">
                <span className="text-white">Free</span>
                <span className="text-[#76adff] transition group-hover:text-white">Flix</span>
              </span>
            </AppLink>


          </div>

          <form
            action="/search"
            method="GET"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-2 text-sm text-white/62 shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition hover:border-[#8400ff]/35 hover:bg-white/[0.06] sm:gap-3 sm:px-3 xl:ml-auto xl:min-w-[420px] xl:max-w-[460px] xl:flex-none xl:text-[1rem]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/54 xl:h-10 xl:w-10">
              <span className="text-xs xl:text-sm">/</span>
            </div>
            <input
              type="search"
              name="q"
              placeholder="Search titles"
              aria-label="Search titles"
              className="min-w-0 flex-1 bg-transparent px-1 text-white outline-none placeholder:text-white/34"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] px-3 py-2 text-xs font-semibold text-white/78 transition hover:border-[#8400ff]/35 hover:bg-[#8400ff]/16 hover:text-white sm:px-4 sm:text-sm xl:px-5 xl:py-2.5"
            >
              <span className="xl:hidden">Search</span>
              <span className="hidden xl:inline">Search</span>
            </button>
          </form>
        </div>


      </div>
    </header>
  );
}