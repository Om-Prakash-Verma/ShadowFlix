import { WatchlistPage } from "@/components/watchlist-page";
import { buildListingMetadata } from "@/lib/seo";

export const metadata = buildListingMetadata({
  title: "Your Watchlist History",
  description: "Browse your locally saved FreeFlix watchlist, watched episodes, people profiles, company visits, and recently explored titles on this device.",
  path: "/watchlist",
  keywords: ["FreeFlix watchlist", "recently watched movies", "tv episode history", "local watch history"],
});

export default function WatchlistRoute() {
  return <WatchlistPage />;
}