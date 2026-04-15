import { AppLink } from "@/components/app-link";

export function LinkCluster({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  if (!links.length) return null;

  return (
    <section className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#12081d,#0a0410)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:border-white/12 hover:shadow-[0_30px_70px_rgba(0,0,0,0.28)] sm:rounded-[28px] sm:p-6 lg:rounded-[30px] lg:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/44 sm:text-xs sm:tracking-[0.34em]">Keep Exploring</p>
          <h2 className="mt-2.5 text-2xl font-black text-white sm:mt-3 sm:text-3xl">{title}</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-white/56">Jump into related discovery hubs, ranked catalogs, and linked detail pages without leaving the OTT browsing flow.</p>
      </div>
      <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {links.map((link) => (
          <AppLink
            key={link.href}
            href={link.href}
            className="group rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3.5 transition duration-300 hover:-translate-y-1 hover:border-[#8400ff]/45 hover:bg-[#8400ff]/10 hover:shadow-[0_16px_38px_rgba(0,0,0,0.2)] sm:rounded-[22px] sm:px-5 sm:py-4"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 transition duration-300 group-hover:text-white/58 sm:text-sm sm:tracking-[0.26em]">Explore</p>
            <p className="mt-2.5 text-base font-semibold text-white transition duration-300 group-hover:text-[#c489ff] sm:mt-3 sm:text-lg">{link.label}</p>
          </AppLink>
        ))}
      </div>
    </section>
  );
}