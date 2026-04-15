import { AppLink } from "@/components/app-link";
import { CategoryRow } from "@/components/category-row";
import { CollectionGrid } from "@/components/collection-grid";
import { DecadeRow } from "@/components/decade-row";
import { HeroBanner } from "@/components/hero-banner";
import MagicBento, { MagicBentoItem } from "@/components/MagicBento";
import { MovieRow } from "@/components/movie-row";
import { SupportPanel } from "@/components/support-panel";
import { TopRankingRow } from "@/components/top-ranking-row";
import { buildListingMetadata } from "@/lib/seo";
import { DECADES } from "@/lib/site";
import { getFeaturedCollections, getMovieGenres, getTopMoviesPageData, getTvGenres } from "@/lib/tmdb";

export const revalidate = 3600;

export const metadata = buildListingMetadata({
  title: "Top Movies Online Free",
  description: "Explore the highest-rated movies on FreeFlix with ranked visuals, fast page loads, trending collections, and detailed watch pages.",
  path: "/top-movies",
  keywords: [
    "top movies",
    "best movies online free",
    "top rated movies",
    "movies today",
    "popular movies",
    "watch movies online free",
    "free movie discovery",
    "movie ranking site",
    "top action movies",
    "top thriller movies",
    "trending movies",
    "FreeFlix top movies",
  ],
});

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export default async function TopMoviesPage() {
  const [data, featuredCollections, movieGenres, tvGenres] = await Promise.all([
    getTopMoviesPageData(),
    getFeaturedCollections(),
    getMovieGenres(),
    getTvGenres(),
  ]);
  const categoryGroups = chunkItems(data.categories, 2);

  return (
    <main className="pb-20">
      <HeroBanner item={data.hero} previews={data.previews} genres={[...movieGenres, ...tvGenres]} />
      <div className="flex w-full flex-col gap-12 px-4 pt-8 md:px-8">
        <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
          <MagicBentoItem className="lg:col-span-12 xl:col-span-6" cardClassName="p-0">
            <MovieRow title="Now Playing Movies" items={data.nowPlaying.slice(0, 18)} viewAllHref="/top-movies" rankNumbers />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-6 xl:col-span-3" cardClassName="p-0">
            <TopRankingRow title="Top Movies Today" items={data.topMovies} href="/top-movies" />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-6 xl:col-span-3">
            <SupportPanel
              eyebrow="Movie Command"
              title="Move Through The Strongest Movie Lanes"
              description="Start from the daily movie ranking, branch into now playing releases, then use the direct links below to jump into archives and genre-heavy discovery without leaving the top movies flow."
              links={[
                { eyebrow: "Fast Lane", label: "Action Movies", href: "/genre/action" },
                { eyebrow: "Regional", label: "Korean Movies", href: "/genre/korean" },
                { eyebrow: "Archive", label: `${DECADES[0]}s Movies`, href: `/year/${DECADES[0]}` },
                { eyebrow: "Pulse", label: "Trending Hub", href: "/genre/trending" },
              ]}
            />
          </MagicBentoItem>
        </MagicBento>

        <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
          <MagicBentoItem className="lg:col-span-12 xl:col-span-9" cardClassName="p-0">
            <MovieRow title="Popular Movies" items={data.popularMovies.slice(0, 18)} viewAllHref="/genre/trending" rankNumbers />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12 xl:col-span-3">
            <SupportPanel
              eyebrow="Browse Architecture"
              title="Choose Your Movie Route"
              description="Use this band to move from broad popularity into collections and decade archives depending on whether you want a blockbuster path or a deeper movie catalog crawl."
              links={[
                { eyebrow: "Hit Lists", label: "Top Movies", href: "/top-movies" },
                { eyebrow: "Mood Route", label: "War Movies", href: "/genre/war" },
                { eyebrow: "Personal", label: "Watchlist", href: "/watchlist" },
              ]}
            />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12" cardClassName="p-0">
            <CollectionGrid items={featuredCollections} />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12" cardClassName="p-0">
            <DecadeRow decades={DECADES} />
          </MagicBentoItem>
        </MagicBento>

        <section className="space-y-8">
          {categoryGroups.map((group, index) => {
            const primary = group[0];
            const secondary = group[1];

            return (
              <MagicBento key={primary.title} className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
                <MagicBentoItem className="lg:col-span-9" cardClassName="p-0">
                  <CategoryRow title={primary.title} href={primary.href} items={primary.items.slice(0, 18)} rankNumbers />
                </MagicBentoItem>
                <MagicBentoItem className="lg:col-span-3">
                  <SupportPanel
                    eyebrow="Category Atlas"
                    title={primary.title}
                    description="Stay inside one movie mood while keeping direct routes into the next strongest lane. This panel exists to support the shelf, not compete with it."
                    links={[
                      { eyebrow: "Primary Lane", label: primary.title, href: primary.href },
                      { eyebrow: secondary ? "Next Lane" : "Fallback Lane", label: secondary?.title ?? "Trending Hub", href: secondary?.href ?? "/genre/trending" },
                    ]}
                    tags={["Curated shelf", "Fast browse", "Direct links"]}
                  />
                </MagicBentoItem>
                {secondary ? (
                  <MagicBentoItem className="lg:col-span-12" cardClassName="p-0">
                    <CategoryRow title={secondary.title} href={secondary.href} items={secondary.items.slice(0, 18)} rankNumbers />
                  </MagicBentoItem>
                ) : null}
              </MagicBento>
            );
          })}
        </section>
      </div>
    </main>
  );
}
