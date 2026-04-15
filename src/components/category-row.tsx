import { MovieRow } from "@/components/movie-row";
import type { MediaResult } from "@/types/tmdb";

export function CategoryRow({
  title,
  href,
  items,
  rankNumbers = false,
}: {
  title: string;
  href: string;
  items: MediaResult[];
  rankNumbers?: boolean;
}) {
  return <MovieRow title={title} viewAllHref={href} items={items} rankNumbers={rankNumbers} />;
}