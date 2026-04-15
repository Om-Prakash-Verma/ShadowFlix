import { NextResponse } from "next/server";

import { getSearchResults } from "@/lib/tmdb";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? "1");

  if (!query) {
    return NextResponse.json({ page: 1, total_pages: 0, total_results: 0, results: [] });
  }

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const results = await getSearchResults(query, safePage);

  return NextResponse.json(results);
}