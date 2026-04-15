export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function buildMediaSlug(name: string, id: number) {
  return `${slugify(name)}-${id}`;
}

export function extractIdFromSlug(slug: string) {
  const match = slug.match(/-(\d+)$/);
  return match ? Number(match[1]) : Number.NaN;
}

