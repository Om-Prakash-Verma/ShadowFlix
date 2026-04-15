import { CarouselRow } from "@/components/carousel-row";
import type { MediaResult } from "@/types/tmdb";

export function MovieRow({
  title,
  items,
  viewAllHref,
  loadMore,
  rankNumbers = false,
}: {
  title: string;
  items: MediaResult[];
  viewAllHref?: string;
  loadMore?: {
    apiPath: string;
    totalPages: number;
    initialPage?: number;
  };
  rankNumbers?: boolean;
}) {
  return <CarouselRow title={title} items={items} viewAllHref={viewAllHref} loadMore={loadMore} rankNumbers={rankNumbers} />;
}