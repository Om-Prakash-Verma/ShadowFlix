import { CarouselRow } from "@/components/carousel-row";
import type { MediaResult } from "@/types/tmdb";

export function TopRankingRow({ title, items, href }: { title: string; items: MediaResult[]; href: string; }) {
  return <CarouselRow title={title} items={items.slice(0, 16)} viewAllHref={href} rankMode accentLabel="TOP" />;
}
