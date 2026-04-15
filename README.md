# FreeFlix

FreeFlix is a Next.js App Router streaming discovery platform built around TMDB data, OTT-style presentation, and programmatic SEO.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add your TMDB API key to `TMDB_API_KEY`.
3. Set `NEXT_PUBLIC_SITE_URL` to your custom production domain.
4. Run `npm run dev`.

## Third-Party registry

A presentation-safe Third-Party registry lives in `src/lib/demo-servers.ts`.
It mirrors the kind of provider interface you would use for a player system, but only includes safe placeholder and trailer-style examples.

## Cloudflare Pages

The project is configured for Cloudflare Pages using `@cloudflare/next-on-pages`.

Pages settings:
- Build command: `npm run build:cf`
- Build output directory: `.vercel/output/static`

Required environment variables:
- `TMDB_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

Important:
- `NEXT_PUBLIC_SITE_URL` is used as the canonical production host.
- Any non-static page request reaching a `*.pages.dev` deployment URL is redirected to the host defined by `NEXT_PUBLIC_SITE_URL` through `proxy.ts`.

## Key routes

- `/`
- `/collections/[id]`
- `/movie/[slug]`
- `/tv/[slug]`
- `/person/[slug]`
- `/company/[slug]`
- `/actor/[slug]`
- `/genre/[genre]`
- `/year/[year]`
- `/top-movies`
- `/top-tv-shows`
- `/watchlist`