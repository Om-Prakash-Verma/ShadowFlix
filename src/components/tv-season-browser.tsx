"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { PlayerModal } from "@/components/player-modal";
import { saveActivity } from "@/lib/watchlist-db";
import { formatRating, imageUrl, shimmerDataUrl, truncate } from "@/lib/utils";
import type { PlayerSourceSection } from "@/types/player";
import type { SeasonDetails } from "@/types/tmdb";

export function TvSeasonBrowser({
  title,
  seriesId,
  seriesArtwork,
  tvSeasons,
  fallbackSections,
}: {
  title: string;
  seriesId: number;
  seriesArtwork?: string | null;
  tvSeasons: Array<{
    season: SeasonDetails;
    playerSectionsByEpisode: Array<{
      episodeNumber: number;
      sections: PlayerSourceSection[];
    }>;
  }>;
  fallbackSections: PlayerSourceSection[];
}) {
  const pathname = usePathname();
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);
  const activeSeason = tvSeasons[activeSeasonIndex] ?? tvSeasons[0];

  const seasonButtons = useMemo(
    () =>
      tvSeasons.map(({ season }, index) => {
        const active = activeSeasonIndex === index;
        const poster = imageUrl(season.poster_path, "w185");

        return (
          <button
            key={season.id}
            type="button"
            onClick={() => setActiveSeasonIndex(index)}
            className={
              active
                ? "group relative min-w-[160px] overflow-hidden rounded-[20px] border border-[#8400ff] bg-[linear-gradient(180deg,rgba(132,0,255,0.2),rgba(132,0,255,0.08))] p-3 text-left text-white transition sm:min-w-[185px] sm:rounded-[22px] sm:p-4 lg:min-w-[210px] lg:rounded-[24px]"
                : "group relative min-w-[160px] overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] p-3 text-left text-white/74 transition hover:bg-white/[0.07] sm:min-w-[185px] sm:rounded-[22px] sm:p-4 lg:min-w-[210px] lg:rounded-[24px]"
            }
          >
            <div className="absolute inset-0 opacity-20">
              {poster ? <Image src={poster} alt={season.name} title={season.name} fill className="object-cover" sizes="210px" /> : null}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.74))]" />
            <div className="relative">
              <p className="text-base font-semibold text-white sm:text-lg">{season.name}</p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-white/55 sm:mt-2 sm:text-xs sm:tracking-[0.24em]">{season.episodes.length} Episodes</p>
              <p className="mt-3 text-[11px] text-white/62 sm:mt-4 sm:text-xs">{season.air_date ? `Premiered ${season.air_date}` : "Air date unavailable"}</p>
            </div>
          </button>
        );
      }),
    [activeSeasonIndex, tvSeasons],
  );

  if (!activeSeason) {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-white/8 bg-[#0a0314] p-4 sm:rounded-[26px] sm:p-5 lg:rounded-[28px] lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-[#8400ff] sm:h-7" />
            <h2 className="text-xl font-bold text-white sm:text-2xl">Seasons & Episodes</h2>
          </div>
          <p className="mt-2.5 max-w-2xl text-sm leading-6 text-white/58 sm:mt-3">
            Pick a season from the carousel, then browse its episodes inside a focused scroll container built for mobile, tablet, and desktop viewing.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white/62 sm:px-4 sm:text-sm">
          {tvSeasons.length} seasons available
        </div>
      </div>

      <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
        <div className="scrollbar-hide flex gap-2.5 overflow-x-auto pb-2 sm:gap-3">
          {seasonButtons}
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#0c0418] p-4 sm:rounded-[24px] sm:p-5 lg:p-6">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">{activeSeason.season.name}</h3>
              <p className="mt-1.5 text-xs text-white/58 sm:mt-2 sm:text-sm">
                {activeSeason.season.episodes.length} episodes
                {activeSeason.season.air_date ? ` | ${activeSeason.season.air_date}` : ""}
              </p>
              {activeSeason.season.overview ? (
                <p className="mt-2.5 max-w-3xl text-sm leading-6 text-white/58 sm:mt-3">
                  {truncate(activeSeason.season.overview, 240)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 max-h-[68svh] space-y-3 overflow-y-auto pr-1 sm:max-h-[72svh] md:max-h-[760px]">
            {activeSeason.season.episodes.map((episode) => {
              const episodeSections =
                activeSeason.playerSectionsByEpisode.find((entry) => entry.episodeNumber === episode.episode_number)
                  ?.sections ?? fallbackSections;
              const still = imageUrl(episode.still_path, "w300");
              const episodeTitle = episode.name?.trim() || `Episode ${episode.episode_number}`;

              return (
                <div
                  key={episode.id}
                  className="grid gap-3 rounded-[18px] border border-white/10 bg-[#0a0314] p-3 sm:rounded-[20px] sm:p-4 xl:grid-cols-[200px_minmax(0,1fr)_auto] xl:items-center"
                >
                  <div className="relative aspect-video overflow-hidden rounded-[16px] bg-white/5 sm:rounded-2xl">
                    {still ? (
                      <Image
                        src={still}
                        alt={`${activeSeason.season.name} ${episodeTitle}`}
                        title={`${activeSeason.season.name} ${episodeTitle}`}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={shimmerDataUrl(300, 169)}
                      />
                    ) : (
                      <div className="flex h-full items-end bg-[linear-gradient(160deg,#1d1d1d,rgba(255,255,255,0.02))] p-3 text-xs font-semibold text-white/70">
                        {episodeTitle}
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/78 px-2 py-1 text-[10px] font-semibold text-white sm:px-2.5 sm:text-[11px]">
                      E{episode.episode_number}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-white sm:text-xl lg:text-2xl">{episodeTitle}</p>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/56 sm:px-2.5 sm:text-[11px] sm:tracking-[0.18em]">
                        Episode {episode.episode_number}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/56 sm:text-sm">
                      <span>{episode.runtime ? `${episode.runtime} min` : "Runtime TBA"}</span>
                      {episode.air_date ? <span>{episode.air_date}</span> : null}
                      <span>TMDB {formatRating(episode.vote_average)}</span>
                    </div>
                    <p className="mt-2.5 text-sm leading-6 text-white/66 sm:mt-3 sm:leading-7">
                      {episode.overview || "Overview not available for this episode yet."}
                    </p>
                  </div>

                  <div className="xl:self-center">
                    <PlayerModal
                      title={`${title} - ${episodeTitle}`}
                      sections={episodeSections}
                      triggerLabel="Play Episode"
                      onOpen={() => {
                        void saveActivity({
                          id: `episode-${seriesId}-${activeSeason.season.season_number}-${episode.episode_number}`,
                          kind: "episode",
                          action: "played",
                          title: episodeTitle,
                          href: `${pathname}?season=${activeSeason.season.season_number}&episode=${episode.episode_number}`,
                          image: still ?? seriesArtwork ?? null,
                          subtitle: `${title} · ${activeSeason.season.name}`,
                          description: episode.overview || null,
                          meta: {
                            seriesId,
                            seasonNumber: activeSeason.season.season_number,
                            episodeNumber: episode.episode_number,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}