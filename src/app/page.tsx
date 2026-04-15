import { AppLink } from "@/components/app-link";
import { CategoryRow } from "@/components/category-row";
import { CollectionGrid } from "@/components/collection-grid";
import { DecadeRow } from "@/components/decade-row";
import { HeroBanner } from "@/components/hero-banner";
import MagicBento, { MagicBentoItem } from "@/components/MagicBento";
import { MovieRow } from "@/components/movie-row";
import { SupportPanel } from "@/components/support-panel";
import { TopRankingRow } from "@/components/top-ranking-row";
import { DECADES } from "@/lib/site";
import { getHomepageData, getMovieGenres, getTvGenres } from "@/lib/tmdb";

export const revalidate = 3600;

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export default async function Home() {
  const [data, movieGenres, tvGenres] = await Promise.all([getHomepageData(), getMovieGenres(), getTvGenres()]);
  const categoryGroups = chunkItems(data.categories, 2);

  return (
    <main className="pb-20">
      <HeroBanner item={data.hero} previews={data.trending.slice(1, 6)} genres={[...movieGenres, ...tvGenres]} />
      <div className="flex w-full flex-col gap-12 px-4 pt-8 md:px-8">
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
          <MagicBentoItem className="lg:col-span-12 xl:col-span-8" cardClassName="p-0">
            <MovieRow title="Now Playing" items={data.nowPlaying.slice(0, 18)} viewAllHref="/top-movies" rankNumbers />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-6 xl:col-span-4" cardClassName="p-0">
            <TopRankingRow title="Movies Today" items={data.topMovies} href="/top-movies" />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-6 xl:col-span-4" cardClassName="p-0">
            <TopRankingRow title="TV Shows Today" items={data.topTVShows} href="/top-tv-shows" />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12 xl:col-span-8">
            <SupportPanel
              eyebrow="Quick Discovery"
              title="Jump Into The Best Parts Of FreeFlix"
              description="Move from live popularity to curated archives without losing the streaming rhythm. Use this block to jump into the strongest browse paths instead of scrolling shelf by shelf."
              links={[
                { eyebrow: "Live Pulse", label: "Trending Now", href: "/genre/trending" },
                { eyebrow: "Personal", label: "Your Watchlist", href: "/watchlist" },
                { eyebrow: "Archive", label: `${DECADES[0]}s Picks`, href: `/year/${DECADES[0]}` },
                { eyebrow: "Ranked", label: "Top TV Shows", href: "/top-tv-shows" },
              ]}
            />
          </MagicBentoItem>
        </MagicBento>

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
          <MagicBentoItem className="lg:col-span-12 xl:col-span-9" cardClassName="p-0">
            <MovieRow title="Popular" items={data.popular.slice(0, 18)} viewAllHref="/genre/trending" rankNumbers />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12 xl:col-span-3">
            <SupportPanel
              eyebrow="Browse Architecture"
              title="Choose How You Want To Explore"
              description="This section shifts the homepage from pure popularity into deeper discovery. Move between current hits, curated collections, and decade archives depending on whether you want instant picks or a slower browse."
              links={[
                { eyebrow: "Hit Lists", label: "Top Movies", href: "/top-movies" },
                { eyebrow: "Series Radar", label: "Top TV Shows", href: "/top-tv-shows" },
                { eyebrow: "Time Travel", label: "Browse By Year", href: `/year/${DECADES[Math.floor(DECADES.length / 2)]}` },
              ]}
            />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12" cardClassName="p-0">
            <CollectionGrid items={data.featuredCollections} />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12" cardClassName="p-0">
            <DecadeRow decades={DECADES} />
          </MagicBentoItem>
        </MagicBento>

        <section className="content-auto space-y-8">
          {categoryGroups.map((group, index) => {
            const primary = group[0];
            const secondary = group[1];

            return (
              <MagicBento
                key={primary.title}
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
                <MagicBentoItem className="lg:col-span-9" cardClassName="p-0">
                  <CategoryRow title={primary.title} href={primary.href} items={primary.items.slice(0, 18)} rankNumbers />
                </MagicBentoItem>

                <MagicBentoItem className="lg:col-span-3">
                  <SupportPanel
                    eyebrow="Category Atlas"
                    title={primary.title}
                    description="Use this lane when you want a narrower mood than the homepage hero. It keeps the scroll focused on one theme while still linking you back into broader FreeFlix discovery paths."
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
