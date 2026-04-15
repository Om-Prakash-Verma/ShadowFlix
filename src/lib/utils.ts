import { IMAGE_BASE } from "@/lib/site";
import type { MediaResult } from "@/types/tmdb";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getTitle(item: MediaResult) {
  return item.title ?? item.name ?? "Untitled";
}

export function getYear(item: Pick<MediaResult, "release_date" | "first_air_date">) {
  const raw = item.release_date ?? item.first_air_date;
  return raw ? new Date(raw).getFullYear().toString() : "2026";
}

export function formatRating(value: number) {
  return value ? value.toFixed(1) : "N/A";
}

export function imageUrl(
  path: string | null | undefined,
  size: "w154" | "w185" | "w300" | "w342" | "w500" | "w780" | "w1280" | "original" = "w780",
) {
  if (!path) return undefined;
  return `${IMAGE_BASE}${size}${path}`;
}

export function shimmerDataUrl(width = 1200, height = 675) {
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#111111"/><rect width="${width}" height="${height}" fill="url(#a)"/><defs><linearGradient id="a" x1="0" y1="0" x2="${width}" y2="0"><stop stop-color="#111111"/><stop offset="0.5" stop-color="#1a1a1a"/><stop offset="1" stop-color="#111111"/></linearGradient></defs></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function truncate(text: string, max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}

export function dedupeById<T extends { id: number }>(items: T[]) {
  return items.filter((item, index) => index === items.findIndex((entry) => entry.id === item.id));
}