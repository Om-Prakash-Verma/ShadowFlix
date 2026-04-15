import Image from "next/image";

import { ActivityTracker } from "@/components/activity-tracker";
import { AppLink } from "@/components/app-link";
import { CastRow } from "@/components/cast-row";
import { JsonLd } from "@/components/json-ld";
import { LinkCluster } from "@/components/link-cluster";
import MagicBento, { MagicBentoItem } from "@/components/MagicBento";
import { MovieRow } from "@/components/movie-row";
import { PlayerModal } from "@/components/player-modal";
import { TvSeasonBrowser } from "@/components/tv-season-browser";
import { faqSchema, mediaSchema } from "@/lib/seo";
import { buildMediaSlug } from "@/lib/slug";
import { formatRating, getTitle, getYear, imageUrl, shimmerDataUrl, truncate } from "@/lib/utils";
import type { PlayerSourceSection } from "@/types/player";
import type { CastMember, Company, Genre, MediaResult, SeasonDetails } from "@/types/tmdb";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-3.5 backdrop-blur-sm sm:rounded-[22px] sm:p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/42 sm:text-[11px]">{label}</p>
      <p className="mt-2 text-xl font-bold text-white sm:mt-3 sm:text-2xl">{value}</p>
    </div>
  );
}

export function DetailPage({
  item,
  genres,
  recommendations,
  relatedLinks,
  type,
  playerSections,
  tvSeasons,
  cast = [],
  productionCompanies = [],
}: {
  item: MediaResult;
  genres: Genre[];
  recommendations: MediaResult[];
  relatedLinks: Array<{ label: string; href: string }>;
  type: "movie" | "tv";
  playerSections: PlayerSourceSection[];
  tvSeasons?: Array<{
    season: SeasonDetails;
    playerSectionsByEpisode: Array<{
      episodeNumber: number;
      sections: PlayerSourceSection[];
    }>;
  }>;
  cast?: CastMember[];
  productionCompanies?: Company[];
}) {
  const title = getTitle(item);
  const year = getYear(item);
  const slug = buildMediaSlug(title, item.id);
  const href = `/${type}/${slug}`;
  const image = imageUrl(item.backdrop_path ?? item.poster_path, "w1280");
  const poster = imageUrl(item.poster_path, "w500");
  const genreNames = (item.genres ?? genres).slice(0, 4).map((genre) => genre.name);
  const schemaType = type === "movie" ? "Movie" : "TVSeries";
  const sourceCount = playerSections.reduce((total, section) => total + section.sources.length, 0);
  const topCompanies = productionCompanies.slice(0, 10);

  return (
    <>
      <ActivityTracker
        entry={{
          id: `${type}-${item.id}`,
          kind: type,
          action: "visited",
          title,
          href,
          image: poster ?? image ?? null,
          subtitle: `${type === "movie" ? "Movie" : "TV Show"} · ${year}`,
          description: truncate(item.overview || `${title} is trending on FreeFlix.`, 180),
          meta: { tmdbId: item.id, year },
        }}
      />
      <JsonLd data={mediaSchema(item, schemaType)} />
      <JsonLd data={faqSchema(title, year)} />
      <main className="pb-14 sm:pb-18 md:pb-20">
        <section className="relative min-h-[58svh] overflow-hidden bg-black sm:min-h-[68svh] lg:min-h-[80svh]">
          {image ? (
            <Image
              src={image}
              alt={title}
              title={title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              placeholder="blur"
              blurDataURL={shimmerDataUrl(1280, 720)}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.52),rgba(0,0,0,0.92)_78%),linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.52)_45%,rgba(0,0,0,0.82))] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.94),rgba(0,0,0,0.68)_42%,rgba(0,0,0,0.88)),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.92)_88%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(132,0,255,0.2),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_22%)]" />

          <div className="relative flex min-h-[58svh] items-end px-3 pb-8 pt-16 sm:min-h-[68svh] sm:px-4 sm:pb-10 md:px-6 lg:min-h-[80svh] lg:px-8 lg:pb-12 lg:pt-20">
            <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1.1fr)_280px] xl:items-end xl:gap-8">
              <div className="max-w-4xl">
                <p className="text-[10px] uppercase tracking-[0.34em] text-white/56 sm:text-xs sm:tracking-[0.4em]">{type === "movie" ? "Movie Spotlight" : "Series Spotlight"}</p>
                <h1 className="mt-3 max-w-3xl text-[2.1rem] font-black leading-[0.92] text-white sm:mt-4 sm:text-5xl lg:text-6xl xl:text-7xl">{title}</h1>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/74 sm:mt-5 sm:gap-3 sm:text-sm">
                  <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 sm:px-4 sm:py-2">{year}</span>
                  <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 sm:px-4 sm:py-2">TMDB {formatRating(item.vote_average)}</span>
                  {genreNames.map((genre) => (
                    <AppLink
                      key={genre}
                      href={`/genre/${genre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 transition hover:bg-white/[0.11] sm:px-4 sm:py-2"
                    >
                      {genre}
                    </AppLink>
                  ))}
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
                  {truncate(
                    item.overview || `${title} is one of the most searched ${type === "movie" ? "movies" : "shows"} on FreeFlix right now.`,
                    240,
                  )}
                </p>
                <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
                  <PlayerModal title={title} sections={playerSections} />
                </div>
              </div>

              {poster ? (
                <div className="hidden xl:block">
                  <div className="relative ml-auto w-[280px] overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.04] shadow-[0_28px_70px_rgba(0,0,0,0.42)]">
                    <Image
                      src={poster}
                      alt={title}
              title={title}
                      width={500}
                      height={750}
                      className="aspect-[0.72] h-auto w-full object-cover"
                      placeholder="blur"
                      blurDataURL={shimmerDataUrl(500, 750)}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
                      <p className="text-xs uppercase tracking-[0.32em] text-white/48">Featured Title</p>
                      <p className="mt-2 text-xl font-bold text-white">{title}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="flex w-full flex-col gap-5 px-3 pt-6 sm:gap-6 sm:px-4 sm:pt-8 md:px-6 lg:gap-7 lg:px-8 lg:pt-10">
          <MagicBento
            className="w-full gap-5"
            textAutoHide
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
            clickEffect
            spotlightRadius={800}
            particleCount={12}
            glowColor="132, 0, 255"
          >
            <MagicBentoItem className="lg:col-span-7 xl:col-span-8">
              <section className="h-full">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/44 sm:text-xs sm:tracking-[0.34em]">Story Overview</p>
              <h2 className="mt-2.5 text-2xl font-black text-white sm:mt-3 sm:text-3xl lg:text-4xl">About {title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/72 sm:mt-5 sm:text-base sm:leading-8">
                {item.overview || `${title} (${year}) continues to trend thanks to its strong audience response and premium visual style.`}
              </p>
              <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
                {genreNames.map((genre) => (
                  <AppLink
                    key={genre}
                    href={`/genre/${genre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="rounded-[18px] border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm font-medium text-white/72 transition hover:border-[#8400ff]/45 hover:bg-[#8400ff]/10 hover:text-white sm:rounded-[20px] sm:px-4 sm:py-4"
                  >
                    {genre}
                  </AppLink>
                ))}
              </div>
              </section>
            </MagicBentoItem>

            <MagicBentoItem className="lg:col-span-5 xl:col-span-4">
              <section className="h-full">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/44 sm:text-xs sm:tracking-[0.34em]">Quick Facts</p>
                <h2 className="mt-2.5 text-2xl font-black text-white sm:mt-3 sm:text-3xl lg:text-4xl">Streaming Snapshot</h2>
                <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                  <StatCard label="Release Year" value={year} />
                  <StatCard label="TMDB Rating" value={formatRating(item.vote_average)} />
                  <div className="sm:col-span-2">
                    <StatCard label="Available Sources" value={String(sourceCount)} />
                  </div>
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-3.5 sm:col-span-2 sm:rounded-[22px] sm:p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/42 sm:text-[11px] sm:tracking-[0.24em]">Watch Path</p>
                    <p className="mt-2 break-all text-xs font-medium text-white/72 sm:mt-3 sm:text-sm">{href}</p>
                  </div>
                </div>
              </section>
            </MagicBentoItem>

            {type === "tv" && tvSeasons?.length ? (
              <MagicBentoItem className="lg:col-span-12" cardClassName="p-0">
                <TvSeasonBrowser title={title} seriesId={item.id} seriesArtwork={poster ?? image ?? null} tvSeasons={tvSeasons} fallbackSections={playerSections} />
              </MagicBentoItem>
            ) : null}
          </MagicBento>

          {topCompanies.length || cast.length ? (
            <MagicBento
              className="w-full gap-5"
              textAutoHide
              enableStars
              enableSpotlight
              enableBorderGlow
              enableTilt
              enableMagnetism
              clickEffect
              spotlightRadius={800}
              particleCount={12}
              glowColor="132, 0, 255"
            >
              {topCompanies.length ? (
                <MagicBentoItem className={cast.length ? "lg:col-span-7" : "lg:col-span-12"}>
                  <section className="h-full">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/44 sm:text-xs sm:tracking-[0.34em]">Production Companies</p>
                        <h2 className="mt-2.5 text-2xl font-black text-white sm:mt-3 sm:text-3xl lg:text-4xl">Studios Behind The Title</h2>
                      </div>
                      <p className="max-w-xl text-sm leading-6 text-white/56">
                        Jump straight into the studio pages and keep the discovery flow moving through linked catalogs and company profiles.
                      </p>
                    </div>
                    <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
                      {topCompanies.map((company) => {
                        const logo = imageUrl(company.logo_path, "w300");
                        return (
                          <AppLink
                            key={company.id}
                            href={`/company/${buildMediaSlug(company.name, company.id)}`}
                            className="group flex min-h-[92px] items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] px-3.5 py-3.5 transition hover:border-[#8400ff]/45 hover:bg-[#8400ff]/10 sm:min-h-[110px] sm:gap-4 sm:rounded-[24px] sm:px-4 sm:py-4"
                          >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[#14161d] p-2.5 sm:h-16 sm:w-16 sm:rounded-[18px] sm:p-3">
                              {logo ? (
                                <Image src={logo} alt={company.name} title={company.name} width={96} height={96} className="max-h-9 w-auto object-contain sm:max-h-10" />
                              ) : (
                                <span className="text-base font-black text-white/68 sm:text-lg">{company.name.slice(0, 2).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-[11px] sm:tracking-[0.22em]">Studio</p>
                              <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-white transition group-hover:text-[#c489ff] sm:mt-2 sm:text-base">{company.name}</p>
                            </div>
                          </AppLink>
                        );
                      })}
                    </div>
                  </section>
                </MagicBentoItem>
              ) : null}

              {cast.length ? (
                <MagicBentoItem className={topCompanies.length ? "lg:col-span-5" : "lg:col-span-12"} cardClassName="p-0">
                  <CastRow cast={cast.slice(0, 18)} />
                </MagicBentoItem>
              ) : null}
            </MagicBento>
          ) : null}

          <MagicBento
            className="w-full gap-5"
            textAutoHide
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
            clickEffect
            spotlightRadius={800}
            particleCount={12}
            glowColor="132, 0, 255"
          >
            <MagicBentoItem className="lg:col-span-4" cardClassName="p-0">
              <LinkCluster title="Explore More" links={relatedLinks} />
            </MagicBentoItem>
            <MagicBentoItem className="lg:col-span-8" cardClassName="p-0">
              <MovieRow title={`More Like ${title}`} items={recommendations.slice(0, 16)} rankNumbers />
            </MagicBentoItem>
          </MagicBento>
        </div>
      </main>
    </>
  );
}
