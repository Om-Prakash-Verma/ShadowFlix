import { NextResponse } from "next/server";

import { getBrowseFeed } from "@/lib/tmdb";

export const runtime = 'edge';
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");
  const page = Number(searchParams.get("page") ?? "1");

  if (!mode || !slug || !type || !["genre", "year", "company"].includes(mode) || !["movie", "tv"].includes(type)) {
    return NextResponse.json({ error: "Invalid browse request." }, { status: 400 });
  }

  const feed = await getBrowseFeed({
    mode: mode as "genre" | "year" | "company",
    slug,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    type: type as "movie" | "tv",
  });

  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}