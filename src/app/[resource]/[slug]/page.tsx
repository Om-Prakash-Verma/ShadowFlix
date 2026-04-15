import Image from "next/image";
import { notFound } from "next/navigation";

import { ActivityTracker } from "@/components/activity-tracker";
import { AppLink } from "@/components/app-link";
import { DetailPage } from "@/components/detail-page";
import { JsonLd } from "@/components/json-ld";
import { LinkCluster } from "@/components/link-cluster";
import { MovieRow } from "@/components/movie-row";
import { buildCollectionMetadata, buildListingMetadata, buildMediaMetadata, collectionSchema } from "@/lib/seo";
import { buildMediaSlug, extractIdFromSlug } from "@/lib/slug";
import { SITE_NAME } from "@/lib/site";
import {
  buildPlayerSources,
  getCollectionDetails,
  getCompanyDetails,
  getCompanyTitles,
  getGenreDirectory,
  getGenreLanding,
  getMovieDetails,
  getMovieWatchProviders,
  getMoviesByYear,
  getPersonDetails,
  getTVDetails,
  getTvByYear,
  getTvSeasonDetails,
  getTvWatchProviders,
} from "@/lib/tmdb";
import { getTitle, getYear, imageUrl, shimmerDataUrl, truncate } from "@/lib/utils";

export const runtime = "edge";
export const revalidate = 3600;

type RouteParams = Promise<{ resource: string; slug: string }>;

function normalizeResource(resource: string) {
  return resource.toLowerCase();
}

function isPersonResource(resource: string) {
  return resource === "person" || resource === "actor";
}

function sortByRelease(items: Awaited<ReturnType<typeof getCollectionDetails>>["parts"], direction: "asc" | "desc") {
  const sorted = [...items].sort((left, right) => {
    const leftDate = left.release_date ? new Date(left.release_date).getTime() : 0;
    const rightDate = right.release_date ? new Date(right.release_date).getTime() : 0;
    return direction === "asc" ? leftDate - rightDate : rightDate - leftDate;
  });
  return sorted;
}

function sortByRating(items: Awaited<ReturnType<typeof getCollectionDetails>>["parts"]) {
  return [...items].sort((left, right) => right.vote_average - left.vote_average);
}

async function buildMoviePage(slug: string) {
  const id = extractIdFromSlug(slug);
  if (!Number.isFinite(id)) notFound();

  const [movie, watchProviders] = await Promise.all([getMovieDetails(id), getMovieWatchProviders(id)]);
  if (!movie.id) notFound();

  return (
    <DetailPage
      item={movie}
      genres={getGenreDirectory()}
      recommendations={movie.recommendations?.results ?? []}
      relatedLinks={[
        { label: "Top Movies", href: "/top-movies" },
        { label: "Action Movies", href: "/genre/action" },
        { label: `Year ${new Date(movie.release_date).getFullYear()}`, href: `/year/${new Date(movie.release_date).getFullYear()}` },
      ]}
      type="movie"
      playerSections={buildPlayerSources({
        tmdbId: movie.id,
        imdbId: movie.imdb_id,
        mediaType: "movie",
        videos: movie.videos,
        watchProviders,
      })}
      cast={movie.credits?.cast ?? []}
      productionCompanies={movie.production_companies ?? []}
    />
  );
}

async function buildTvPage(slug: string) {
  const id = extractIdFromSlug(slug);
  if (!Number.isFinite(id)) notFound();

  const [show, watchProviders] = await Promise.all([getTVDetails(id), getTvWatchProviders(id)]);
  if (!show.id) notFound();

  const seasonsToFetch = (show.seasons ?? []).filter((season) => season.season_number > 0);

  const tvSeasons = await Promise.all(
    seasonsToFetch.map(async (season) => {
      const seasonDetails = await getTvSeasonDetails(show.id, season.season_number);
      return {
        season: seasonDetails,
        playerSectionsByEpisode: seasonDetails.episodes.map((episode) => ({
          episodeNumber: episode.episode_number,
          sections: buildPlayerSources({
            tmdbId: show.id,
            imdbId: show.external_ids?.imdb_id,
            mediaType: "tv",
            videos: show.videos,
            watchProviders,
            season: seasonDetails.season_number,
            episode: episode.episode_number,
          }),
        })),
      };
    }),
  );

  return (
    <DetailPage
      item={show}
      genres={getGenreDirectory()}
      recommendations={show.recommendations?.results ?? []}
      relatedLinks={[
        { label: "Top TV Shows", href: "/top-tv-shows" },
        { label: "Netflix TV Shows", href: "/genre/netflix-tv-shows" },
        { label: `Year ${new Date(show.first_air_date).getFullYear()}`, href: `/year/${new Date(show.first_air_date).getFullYear()}` },
      ]}
      type="tv"
      playerSections={buildPlayerSources({
        tmdbId: show.id,
        imdbId: show.external_ids?.imdb_id,
        mediaType: "tv",
        videos: show.videos,
        watchProviders,
      })}
      tvSeasons={tvSeasons}
      cast={show.credits?.cast ?? []}
      productionCompanies={show.production_companies ?? []}
    />
  );
}

async function buildPersonPage(resource: string, slug: string) {
  const id = extractIdFromSlug(slug);
  if (!Number.isFinite(id)) notFound();

  const person = await getPersonDetails(id);
  if (!person.id) notFound();

  const credits = person.combined_credits?.cast ?? [];

  return (
    <>
      <ActivityTracker
        entry={{
          id: `person-${person.id}`,
          kind: "person",
          action: "visited",
          title: person.name,
          href: `/${resource}/${slug}`,
          image: imageUrl(person.profile_path, "w500") ?? null,
          subtitle: person.known_for_department || "Talent profile",
          description: truncate(person.biography || `${person.name} is one of the most searched entertainment figures on FreeFlix.`, 180),
          meta: { tmdbId: person.id },
        }}
      />
      <main className="flex w-full flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 rounded-[32px] border border-white/8 bg-[#0d0d0d] p-6 md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-[24px] bg-[#111111]">
            {person.profile_path ? (
              <Image
                src={imageUrl(person.profile_path, "w500")!}
                alt={person.name}
                width={500}
                height={750}
                className="aspect-[2/3] h-auto w-full object-cover"
                placeholder="blur"
                blurDataURL={shimmerDataUrl(500, 750)}
              />
            ) : (
              <div className="aspect-[2/3] w-full bg-[#1a1a1a]" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-white/56">Talent Profile</p>
            <h1 className="mt-4 text-4xl font-black text-white">{person.name}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
              <span>{person.known_for_department}</span>
              {person.birthday ? <span>{person.birthday}</span> : null}
              {person.place_of_birth ? <span>{person.place_of_birth}</span> : null}
            </div>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/72">
              {truncate(person.biography || `${person.name} is one of the most searched entertainment figures on FreeFlix.`, 600)}
            </p>
          </div>
        </section>
        <LinkCluster
          title="Explore More"
          links={[
            { label: "Top Movies", href: "/top-movies" },
            { label: "Top TV Shows", href: "/top-tv-shows" },
            { label: "Trending", href: "/genre/trending" },
          ]}
        />
        <MovieRow title={`${person.name} Filmography`} items={credits.slice(0, 18)} rankNumbers />
      </main>
    </>
  );
}

async function buildCompanyPage(slug: string) {
  const id = extractIdFromSlug(slug);
  if (!Number.isFinite(id)) notFound();

  const [company, titles] = await Promise.all([getCompanyDetails(id), getCompanyTitles(id)]);
  if (!company.id) notFound();

  return (
    <>
      <ActivityTracker
        entry={{
          id: `company-${company.id}`,
          kind: "company",
          action: "visited",
          title: company.name,
          href: `/company/${slug}`,
          image: imageUrl(company.logo_path, "w500") ?? null,
          subtitle: company.headquarters || company.origin_country || "Studio profile",
          description: truncate(company.description || `${company.name} is linked to a strong catalog of titles on FreeFlix.`, 180),
          meta: { tmdbId: company.id },
        }}
      />
      <main className="flex w-full flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 rounded-[32px] border border-white/8 bg-[#0d0d0d] p-6 md:grid-cols-[180px_minmax(0,1fr)]">
          <div className="relative flex items-center justify-center overflow-hidden rounded-[24px] bg-[#111111] p-8">
            {company.logo_path ? (
              <Image
                src={imageUrl(company.logo_path, "w500")!}
                alt={company.name}
                            title={company.name}
                width={320}
                height={320}
                className="max-h-28 w-auto object-contain"
                placeholder="blur"
                blurDataURL={shimmerDataUrl(320, 320)}
              />
            ) : (
              <div className="h-24 w-full rounded-2xl bg-[#1a1a1a]" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-white/56">Studio Profile</p>
            <h1 className="mt-4 text-4xl font-black text-white">{company.name}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
              {company.headquarters ? <span>{company.headquarters}</span> : null}
              {company.origin_country ? <span>{company.origin_country}</span> : null}
            </div>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/72">
              {truncate(company.description || `${company.name} is linked to a strong catalog of titles on FreeFlix.`, 500)}
            </p>
          </div>
        </section>
        <LinkCluster
          title="Explore More"
          links={[
            { label: "Top Movies", href: "/top-movies" },
            { label: "Action Movies", href: "/genre/action" },
            { label: "Trending", href: "/genre/trending" },
          ]}
        />
        <MovieRow
          title={`Popular From ${company.name}`}
          items={titles.results.slice(0, 18)}
          loadMore={{ apiPath: `/api/browse?mode=company&slug=${company.id}&type=movie`, totalPages: titles.total_pages }}
          rankNumbers
        />
      </main>
    </>
  );
}

async function buildGenrePage(slug: string) {
  const landing = await getGenreLanding(slug);
  const heroImage = landing.movies[0]?.backdrop_path
    ? imageUrl(landing.movies[0].backdrop_path, "w500")
    : landing.movies[0]?.poster_path
      ? imageUrl(landing.movies[0].poster_path, "w342")
      : null;

  return (
    <>
      <ActivityTracker
        entry={{
          id: `genre-${slug}`,
          kind: "genre",
          action: "visited",
          title: landing.title,
          href: `/genre/${slug}`,
          image: heroImage,
          subtitle: "Genre hub",
          description: landing.description,
          meta: { slug },
        }}
      />
      <main className="flex w-full flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/8 bg-[#0d0d0d] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-white/56">Genre Hub</p>
          <h1 className="mt-4 text-4xl font-black text-white">{landing.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">{landing.description}</p>
        </section>
        {landing.movies.length ? (
          <MovieRow
            title={`${landing.title} Movies`}
            items={landing.movies.slice(0, 18)}
            loadMore={{ apiPath: `/api/browse?mode=genre&slug=${slug}&type=movie`, totalPages: landing.movieTotalPages ?? 1 }}
            rankNumbers
          />
        ) : null}
        {landing.tv.length ? (
          <MovieRow
            title={`${landing.title} TV Shows`}
            items={landing.tv.slice(0, 18)}
            loadMore={{ apiPath: `/api/browse?mode=genre&slug=${slug}&type=tv`, totalPages: landing.tvTotalPages ?? 1 }}
            rankNumbers
          />
        ) : null}
      </main>
    </>
  );
}

async function buildYearPage(slug: string) {
  const numericYear = Number(slug);
  if (!Number.isFinite(numericYear)) notFound();

  const [movies, tv] = await Promise.all([getMoviesByYear(numericYear), getTvByYear(numericYear)]);
  const heroImage = movies.results[0]?.backdrop_path
    ? imageUrl(movies.results[0].backdrop_path, "w500")
    : movies.results[0]?.poster_path
      ? imageUrl(movies.results[0].poster_path, "w342")
      : null;

  return (
    <>
      <ActivityTracker
        entry={{
          id: `year-${slug}`,
          kind: "year",
          action: "visited",
          title: `${slug} Archive`,
          href: `/year/${slug}`,
          image: heroImage,
          subtitle: "Year archive",
          description: `Browse the strongest movie and TV releases from ${slug}`,
          meta: { year: numericYear },
        }}
      />
      <main className="flex w-full flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/8 bg-[#0d0d0d] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-white/56">Year Archive</p>
          <h1 className="mt-4 text-4xl font-black text-white">{slug}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">
            Browse the strongest movie and TV releases from {slug}
          </p>
        </section>
        <MovieRow
          title={`Movies From ${slug}`}
          items={movies.results.slice(0, 18)}
          loadMore={{ apiPath: `/api/browse?mode=year&slug=${slug}&type=movie`, totalPages: movies.total_pages }}
          rankNumbers
        />
        <MovieRow
          title={`TV Shows From ${slug}`}
          items={tv.results.slice(0, 18)}
          loadMore={{ apiPath: `/api/browse?mode=year&slug=${slug}&type=tv`, totalPages: tv.total_pages }}
          rankNumbers
        />
      </main>
    </>
  );
}

async function buildCollectionPage(slug: string) {
  const numericId = Number(slug);
  if (!Number.isFinite(numericId)) notFound();

  const collection = await getCollectionDetails(numericId);
  if (!collection.id) notFound();

  const heroImage = imageUrl(collection.backdrop_path ?? collection.poster_path, "w1280");
  const collectionOrder = sortByRelease(collection.parts, "asc");
  const recentlyReleased = sortByRelease(collection.parts, "desc");
  const topRated = sortByRating(collection.parts);
  const firstMovie = collectionOrder[0];
  const latestMovie = recentlyReleased[0];

  return (
    <>
      <ActivityTracker
        entry={{
          id: `collection-${collection.id}`,
          kind: "collection",
          action: "visited",
          title: collection.name,
          href: `/collections/${collection.id}`,
          image: imageUrl(collection.poster_path ?? collection.backdrop_path, "w500") ?? null,
          subtitle: `${collection.parts.length} movies`,
          description: truncate(collection.overview || `${collection.name} is a featured movie collection on FreeFlix.`, 180),
          meta: { tmdbId: collection.id },
        }}
      />
      <JsonLd data={collectionSchema(collection)} />
      <main className="pb-20">
        <section className="relative min-h-[66svh] overflow-hidden bg-black">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={collection.name}
                    title={collection.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              placeholder="blur"
              blurDataURL={shimmerDataUrl(1280, 720)}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.58)_45%,rgba(0,0,0,0.92)),linear-gradient(0deg,rgba(0,0,0,1),transparent_36%)]" />
          <div className="relative flex min-h-[66svh] items-end px-4 pb-12 pt-16 md:px-8">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.38em] text-white/58">Featured Collection</p>
              <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">{collection.name}</h1>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/76">
                <span>{collection.parts.length} Movies</span>
                {firstMovie ? <span>Starts {getYear(firstMovie)}</span> : null}
                {latestMovie ? <span>Latest {getYear(latestMovie)}</span> : null}
              </div>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/76 sm:text-lg">
                {truncate(collection.overview || `${collection.name} brings together a full movie saga for streamlined discovery on ${SITE_NAME}.`, 240)}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {firstMovie ? (
                  <AppLink
                    href={`/movie/${buildMediaSlug(getTitle(firstMovie), firstMovie.id)}`}
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/88"
                  >
                    Start Collection
                  </AppLink>
                ) : null}
                <a
                  href={`https://www.themoviedb.org/collection/${collection.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  TMDB Source
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="flex w-full flex-col gap-10 px-4 pt-10 md:px-8">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_380px]">
            <div className="space-y-6 rounded-[28px] border border-white/8 bg-[#0d0d0d] p-6">
              <h2 className="text-2xl font-bold text-white">Overview</h2>
              <p className="text-base leading-8 text-white/72">
                {collection.overview || `${collection.name} is a featured movie collection with linked detail pages for every entry.`}
              </p>
            </div>
            <div className="space-y-6 rounded-[28px] border border-white/8 bg-[#0d0d0d] p-6">
              <h2 className="text-2xl font-bold text-white">Collection Facts</h2>
              <div className="space-y-3 text-sm text-white/70">
                <p>Total Titles: {collection.parts.length}</p>
                {firstMovie ? (
                  <p>
                    First Release: {getTitle(firstMovie)} ({getYear(firstMovie)})
                  </p>
                ) : null}
                {latestMovie ? (
                  <p>
                    Latest Release: {getTitle(latestMovie)} ({getYear(latestMovie)})
                  </p>
                ) : null}
                <p>Collection Path: /collections/{collection.id}</p>
              </div>
            </div>
          </section>

          <MovieRow title="Collection Order" items={collectionOrder} rankNumbers />
          <MovieRow title="Recently Released" items={recentlyReleased} rankNumbers />
          <MovieRow title="Top Rated In This Collection" items={topRated} rankNumbers />

          <LinkCluster
            title="Explore More"
            links={[
              { label: "Top Movies", href: "/top-movies" },
              { label: "Trending", href: "/genre/trending" },
              ...(firstMovie ? [{ label: `Start With ${getTitle(firstMovie)}`, href: `/movie/${buildMediaSlug(getTitle(firstMovie), firstMovie.id)}` }] : []),
            ]}
          />
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }: { params: RouteParams }) {
  const { resource, slug } = await params;
  const normalized = normalizeResource(resource);

  if (normalized === "movie") {
    const id = extractIdFromSlug(slug);
    if (!Number.isFinite(id)) return {};
    const movie = await getMovieDetails(id);
    return buildMediaMetadata(movie, "movie");
  }

  if (normalized === "tv") {
    const id = extractIdFromSlug(slug);
    if (!Number.isFinite(id)) return {};
    const show = await getTVDetails(id);
    return buildMediaMetadata(show, "tv");
  }

  if (isPersonResource(normalized)) {
    const id = extractIdFromSlug(slug);
    if (!Number.isFinite(id)) return {};
    const person = await getPersonDetails(id);
    return buildListingMetadata({
      title: `${person.name} Movies and TV Shows`,
      description: truncate(person.biography || `Browse ${person.name}'s filmography, cast credits, and trending titles on FreeFlix.`, 160),
      path: `/${normalized}/${slug}`,
      keywords: [`${person.name} movies`, `${person.name} tv shows`, `${person.name} biography`, `${person.name} FreeFlix`],
    });
  }

  if (normalized === "company") {
    const id = extractIdFromSlug(slug);
    if (!Number.isFinite(id)) return {};
    const company = await getCompanyDetails(id);
    return buildListingMetadata({
      title: `${company.name} Movies and Shows`,
      description: truncate(company.description || `Explore movies connected to ${company.name} on FreeFlix.`, 160),
      path: `/company/${slug}`,
      keywords: [`${company.name} movies`, `${company.name} studio`, `${company.name} productions`, `${company.name} FreeFlix`],
    });
  }

  if (normalized === "genre") {
    const landing = await getGenreLanding(slug);
    return buildListingMetadata({
      title: `${landing.title} Movies and TV Shows`,
      description: landing.description,
      path: `/genre/${slug}`,
      keywords: [`${landing.title} movies`, `${landing.title} tv shows`, `watch ${landing.title} online free`, `${landing.title} FreeFlix`],
    });
  }

  if (normalized === "year") {
    return buildListingMetadata({
      title: `Best Movies and TV Shows From ${slug}`,
      description: `Discover the most popular movies and TV shows released in ${slug} with cinematic artwork, ranked rows, and keyword-rich watch pages.`,
      path: `/year/${slug}`,
      keywords: [`best movies ${slug}`, `best tv shows ${slug}`, `watch ${slug} movies online free`, `${slug} FreeFlix`],
    });
  }

  if (normalized === "collections") {
    const numericId = Number(slug);
    if (!Number.isFinite(numericId)) return {};
    const collection = await getCollectionDetails(numericId);
    return buildCollectionMetadata(collection);
  }

  return {};
}

export default async function ResourcePage({ params }: { params: RouteParams }) {
  const { resource, slug } = await params;
  const normalized = normalizeResource(resource);

  switch (normalized) {
    case "movie":
      return buildMoviePage(slug);
    case "tv":
      return buildTvPage(slug);
    case "person":
    case "actor":
      return buildPersonPage(normalized, slug);
    case "company":
      return buildCompanyPage(slug);
    case "genre":
      return buildGenrePage(slug);
    case "year":
      return buildYearPage(slug);
    case "collections":
      return buildCollectionPage(slug);
    default:
      notFound();
  }
}