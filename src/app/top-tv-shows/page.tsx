import { AppLink } from "@/components/app-link";
import { CategoryRow } from "@/components/category-row";
import { DecadeRow } from "@/components/decade-row";
import { HeroBanner } from "@/components/hero-banner";
import MagicBento, { MagicBentoItem } from "@/components/MagicBento";
import { MovieRow } from "@/components/movie-row";
import { SupportPanel } from "@/components/support-panel";
import { TopRankingRow } from "@/components/top-ranking-row";
import { buildListingMetadata } from "@/lib/seo";
import { DECADES } from "@/lib/site";
import { getMovieGenres, getTopTvShowsPageData, getTvGenres } from "@/lib/tmdb";

export const revalidate = 3600;

export const metadata = buildListingMetadata({
  title: "Top TV Shows Online Free",
  description: "Explore the highest-rated TV shows on FreeFlix with ranked visuals, fast page loads, trending series rows, and detailed watch pages.",
  path: "/top-tv-shows",
  keywords: [
    "top tv shows",
    "best tv shows online free",
    "top rated tv shows",
    "tv shows today",
    "popular tv shows",
    "watch tv shows online free",
    "free tv discovery",
    "tv show ranking site",
    "top drama shows",
    "top crime shows",
    "trending tv shows",
    "FreeFlix top tv shows",
  ],
});

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export default async function TopTVShowsPage() {
  const [data, movieGenres, tvGenres] = await Promise.all([getTopTvShowsPageData(), getMovieGenres(), getTvGenres()]);
  const categoryGroups = chunkItems(data.categories, 2);

  return (
    <main className="pb-20">
      <HeroBanner item={data.hero} previews={data.previews} genres={[...movieGenres, ...tvGenres]} />
      <div className="flex w-full flex-col gap-12 px-4 pt-8 md:px-8">
        <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
          <MagicBentoItem className="lg:col-span-6 xl:col-span-3" cardClassName="p-0">
            <TopRankingRow title="Top TV Shows Today" items={data.topTVShows} href="/top-tv-shows" />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12 xl:col-span-6" cardClassName="p-0">
            <MovieRow title="Trending TV Shows" items={data.trendingTv.slice(0, 18)} viewAllHref="/top-tv-shows" rankNumbers />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12 xl:col-span-3">
            <SupportPanel
              eyebrow="Series Command"
              title="Jump Across The Strongest TV Lanes"
              description="Start with the top-rated TV ranking, flow into trending series, then use these quick links to branch into Netflix-heavy, genre-driven, or decade-based TV discovery."
              links={[
                { eyebrow: "Platform", label: "Netflix TV Shows", href: "/genre/netflix-tv-shows" },
                { eyebrow: "Mood Route", label: "Drama TV Shows", href: "/genre/drama" },
                { eyebrow: "Archive", label: `${DECADES[0]}s Shows`, href: `/year/${DECADES[0]}` },
                { eyebrow: "Personal", label: "Watchlist", href: "/watchlist" },
              ]}
            />
          </MagicBentoItem>
        </MagicBento>

        <MagicBento className="w-full gap-5" enableStars enableSpotlight enableBorderGlow enableTilt enableMagnetism clickEffect spotlightRadius={800} particleCount={12} glowColor="132, 0, 255">
          <MagicBentoItem className="lg:col-span-12 xl:col-span-9" cardClassName="p-0">
            <MovieRow title="Popular TV Shows" items={data.popularTv.slice(0, 18)} viewAllHref="/genre/netflix-tv-shows" rankNumbers />
          </MagicBentoItem>
          <MagicBentoItem className="lg:col-span-12 xl:col-span-3">
            <SupportPanel
              eyebrow="Browse Architecture"
              title="Choose Your TV Route"
              description="Switch between broad TV popularity, decade browsing, and genre-specific show shelves depending on whether you want familiar hits or a narrower binge path."
              links={[
                { eyebrow: "Hit Lists", label: "Top TV Shows", href: "/top-tv-shows" },
                { eyebrow: "Mood Route", label: "Mystery TV Shows", href: "/genre/mystery" },
                { eyebrow: "Momentum", label: "Action TV Shows", href: "/genre/action-adventure" },
              ]}
            />
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
                    description="Use the atlas to pivot between TV themes without leaving the ranked browsing flow. The shelf stays primary while the side card handles the routing."
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
