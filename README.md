# 🚀 ShadowFlix

> A streaming-style movie and TV discovery app built with Next.js, TMDB data, animated UI components, and local watch-history tracking.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![TMDB](https://img.shields.io/badge/Data-TMDB-01B4E4?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Learning%20Project-orange?style=for-the-badge)

---

## 📌 Executive Summary

- This project is a media discovery website that lets users browse movies, TV shows, people, studios, collections, genres, and years.
- It pulls content data from TMDB and turns it into a polished, streaming-style browsing experience.
- It also stores local activity on the device so a user can revisit watched titles, played episodes, and explored pages.
- Real-world use case:
  A user wants a Netflix-like browsing interface for discovering entertainment quickly, without building a full backend or content database from scratch.
- Why it exists:
  It appears to be a learning project focused on modern frontend development, API integration, UI composition, and SEO-friendly page generation.

---

## 🧠 Learning Note

This project was built with AI assistance while learning development.

- Learning-focused project
- Code is being actively understood and improved
- Not all parts were necessarily written manually
- The strongest value here is learning how the pieces fit together

---

## ✨ Features

- 🎬 Homepage with hero banners, ranked rows, category shelves, collection grids, and decade browsing
  Reference: `src/app/page.tsx`, `src/components/hero-banner.tsx`, `src/components/MagicBento.tsx`
- 🔎 Search across movies, TV shows, people, and collections with infinite loading
  Reference: `src/app/search/page.tsx`, `src/app/api/search/route.ts`, `src/components/search-results.tsx`
- 🏆 Dedicated top movies and top TV pages with curated category sections
  Reference: `src/app/top-movies/page.tsx`, `src/app/top-tv-shows/page.tsx`
- 📄 Dynamic detail pages for movies, TV shows, people, companies, collections, genres, and years
  Reference: `src/app/[resource]/[slug]/page.tsx`
- ▶️ Player modal for embedded playback sources and trailers
  Reference: `src/components/player-modal.tsx`, `src/lib/demo-servers.ts`, `src/lib/tmdb.ts`
- 📺 TV season and episode browser with per-episode play actions
  Reference: `src/components/tv-season-browser.tsx`
- 🧾 SEO metadata, Open Graph tags, structured data, robots, and sitemap generation
  Reference: `src/lib/seo.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`
- 💾 Local watch/activity history stored in IndexedDB
  Reference: `src/lib/watchlist-db.ts`, `src/components/watchlist-page.tsx`, `src/components/activity-tracker.tsx`
- ⚡ Edge API routes for search and browse pagination
  Reference: `src/app/api/search/route.ts`, `src/app/api/browse/route.ts`
- ☁️ Cloudflare-oriented build setup is present
  Inferred from: `package.json`, `_routes.json`, `wrangler` dependency

---

## 🛠️ Tech Stack

| Category | Tools |
|----------|------|
| Language | TypeScript |
| Framework | Next.js 16, React 19 |
| Styling | Tailwind CSS v4, custom CSS gradients, animated UI components |
| Animation | GSAP, `@gsap/react`, `motion` |
| Data Source | TMDB API |
| State / Storage | React state, browser IndexedDB |
| Runtime | Next.js App Router, Edge Route Handlers |
| Tooling | ESLint, PostCSS, TypeScript, npm |
| Deployment | Cloudflare Pages setup appears intended, inferred from `build:cf`, `_routes.json`, and `wrangler` |

---

## 📁 Project Structure

```bash
ShadowFlix/
├── public/
│   ├── favicon.ico
│   └── og-image.jpg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── browse/route.ts
│   │   │   └── search/route.ts
│   │   ├── search/page.tsx
│   │   ├── top-movies/page.tsx
│   │   ├── top-tv-shows/page.tsx
│   │   ├── watchlist/page.tsx
│   │   ├── [resource]/[slug]/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   ├── lib/
│   └── types/
├── .env
├── next.config.ts
├── package.json
├── tsconfig.json
└── _routes.json
```

### Folder guide

- `src/app/`
  Route files, page entry points, metadata files, and API handlers.
- `src/components/`
  Reusable UI pieces like banners, cards, carousels, the player modal, and the watchlist screen.
- `src/lib/`
  Core logic for TMDB fetching, SEO builders, slug helpers, utility functions, and IndexedDB storage.
- `src/types/`
  Shared TypeScript models for TMDB data and player configuration.
- `public/`
  Static assets used by the app.

---

## ⚙️ How It Works

1. The app starts in `src/app/layout.tsx`.
   It loads global styles, metadata, structured data, the sticky header, dock navigation, and analytics/ad scripts.
2. A page route renders.
   Example:
   `src/app/page.tsx` for home, `src/app/search/page.tsx` for search, or `src/app/[resource]/[slug]/page.tsx` for detail pages.
3. Server-side page code calls TMDB helpers from `src/lib/tmdb.ts`.
   These functions fetch trending titles, genres, top-rated content, details, seasons, people, and more.
4. The data is passed into UI components.
   Components like `HeroBanner`, `MovieRow`, `CollectionGrid`, and `DetailPage` turn raw API data into browseable sections.
5. Some client components fetch more data later.
   `CarouselRow` and `SearchResults` use `/api/browse` and `/api/search` to load more results without a full page reload.
6. When users open titles or episodes, local activity is saved.
   `ActivityTracker` and `TvSeasonBrowser` write to IndexedDB through `src/lib/watchlist-db.ts`.
7. The watchlist page reads that local history back.
   `src/components/watchlist-page.tsx` builds a personalized on-device history dashboard from stored activity.

### Simple flow

`User opens page` → `Next.js route loads` → `TMDB data fetched` → `UI sections rendered` → `User clicks a title or episode` → `activity saved locally` → `watchlist page can replay that history`

---

## 🔑 Key Files You Should Understand

- `src/app/layout.tsx` → global shell of the app
- `src/app/page.tsx` → homepage composition
- `src/app/[resource]/[slug]/page.tsx` → main dynamic route that powers many page types
- `src/lib/tmdb.ts` → the most important data layer in the project
- `src/lib/watchlist-db.ts` → local persistence logic using IndexedDB
- `src/lib/seo.ts` → metadata and structured-data generation
- `src/components/detail-page.tsx` → shared detail-page layout for movies and TV shows
- `src/components/player-modal.tsx` → fullscreen playback UI
- `src/components/watchlist-page.tsx` → local activity dashboard
- `src/components/MagicBento.tsx` → custom animated layout system used heavily across pages

---

## 🧩 Important Code Explained

### `src/lib/tmdb.ts`

- This is the app's data engine.
- It centralizes TMDB API requests so page components do not need to manually build fetch URLs.
- It also builds higher-level page data like homepage sections, top movie pages, genre landings, search results, and player source groups.

### `src/app/[resource]/[slug]/page.tsx`

- This single dynamic route handles many page types:
  movies, TV shows, people, actors, companies, genres, years, and collections.
- That makes routing powerful, but also a little harder for beginners to follow.
- The route checks the `resource` value, then calls the correct builder function.

### `src/lib/watchlist-db.ts`

- This file stores activity in the browser using IndexedDB.
- There is no backend database for watch history here.
- That means activity is device-local, which is simpler and cheaper, but not synced between users or devices.

### `src/components/player-modal.tsx`

- This renders a fullscreen modal with embedded iframes or external links.
- The player sources come from `buildPlayerSources()` in `src/lib/tmdb.ts`.
- It supports sandbox toggling and source switching.

### `src/components/MagicBento.tsx`

- This is a custom animated layout wrapper used to give cards glow, tilt, spotlight, particle, and ripple effects.
- It makes the interface look more premium.
- It also adds complexity, especially for debugging and performance.

---

## ⚙️ Configuration

### Key config files

- `package.json` → scripts and dependencies
- `next.config.ts` → image configuration and remote TMDB image support
- `tsconfig.json` → TypeScript config and `@/*` path alias
- `eslint.config.mjs` → lint rules using Next.js presets
- `postcss.config.mjs` → Tailwind PostCSS plugin
- `_routes.json` → Cloudflare-style route include/exclude rules

### Notable configuration choices

- TMDB images are allowed through `image.tmdb.org`
- Images are set to `unoptimized: true`
- Edge runtime is used in search, browse, and dynamic detail routes
- Revalidation is used in many routes to cache TMDB-backed pages for 1 hour

---

## 🔐 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `TMDB_API_KEY` | Used to fetch movie and TV data from TMDB | Yes |
| `NEXT_PUBLIC_SITE_URL` | Used for canonical URLs, sitemap, robots, and metadata | Recommended |
| `NEXT_PUBLIC_GA_ID` | Enables Google Analytics script injection | Optional |

### Example

```bash
TMDB_API_KEY=your_tmdb_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## 🚀 Installation & Setup

```bash
# clone the repository
git clone <your-repo-url>

# enter the project
cd ShadowFlix

# install dependencies
npm install

# create environment file
# add TMDB_API_KEY and optional public variables
```

---

## ▶️ How to Run

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production build

```bash
npm run build
npm run start
```

### Cloudflare-oriented build

```bash
npm run build:cf
```

This Cloudflare flow is inferred from the repository setup and may need deployment-specific environment configuration.

---

## 🌐 API / Interfaces

### Internal API routes

| Route | Method | Purpose |
|------|--------|---------|
| `/api/search?q=...&page=...` | `GET` | Returns merged TMDB search results for movies, TV, people, and collections |
| `/api/browse?mode=genre|year|company&slug=...&type=movie|tv&page=...` | `GET` | Returns paginated browse data for rows and infinite loading |

### Main UI routes

- `/` → homepage
- `/search` → search page
- `/top-movies` → top movie lists
- `/top-tv-shows` → top TV lists
- `/watchlist` → local activity history
- `/movie/[slug]` → movie detail
- `/tv/[slug]` → TV detail
- `/person/[slug]` and `/actor/[slug]` → person profile
- `/company/[slug]` → studio/company page
- `/genre/[slug]` → genre landing page
- `/year/[slug]` → year archive page
- `/collections/[id]` → collection page

---

## 💾 Data Handling

- TMDB is the main external data source
- Data fetching is centralized in `src/lib/tmdb.ts`
- Many pages use server-side data fetching with Next.js caching and revalidation
- Search and browse pagination are loaded on the client through API routes
- Watch/activity history is stored in browser IndexedDB
- No custom backend database is present in this repository
- No authentication system is present

### Important implication

The watchlist is not a true user account watchlist.
It is a local device history feature.

---

## 🔌 External Integrations

- 🎞️ TMDB API for media metadata, credits, videos, genres, collections, and watch providers
- 🖼️ TMDB image CDN via `image.tmdb.org`
- 📊 Google Analytics via `NEXT_PUBLIC_GA_ID`
- 📢 External ad script loaded in `src/components/ad-scripts.tsx`
- ▶️ Multiple third-party embed sources defined in `src/lib/demo-servers.ts`
- ☁️ Cloudflare build tooling appears intended through `@cloudflare/next-on-pages` usage in scripts and `wrangler`

### Important note

The project includes third-party embedded playback sources.
That is part of the actual codebase and should be explained honestly if you present this project.

---

## 🧪 Testing

- No test files were found in this repository
- No Jest, Vitest, Playwright, or Cypress setup was found
- Current quality checks are mainly linting and TypeScript compilation through the Next.js build process

### Available validation command

```bash
npm run lint
```

---

# 🧠 Understanding This Project

## 🎯 What You MUST Understand for Interviews

- How Next.js App Router pages are structured
- How server components fetch data before render
- How client components handle interaction and infinite scrolling
- How a single dynamic route can support many resource types
- How IndexedDB is used for local persistence
- How SEO metadata and JSON-LD are generated
- How UI abstraction can help reuse code but also increase complexity

## 🔄 Core Logic Explained Simply

When a user opens the app, the page fetches media data from TMDB, turns it into rows/cards/banners, and renders a streaming-style interface.

When the user clicks a title, the app opens a detail route, loads more details from TMDB, builds playback/trailer sources, and records that visit in local storage.

When the user visits the watchlist page, the app reads that local history from IndexedDB and shows it as a personalized activity dashboard.

## ⚠️ Confusing Parts

- `src/app/[resource]/[slug]/page.tsx` does a lot.
  It handles many different page types in one file.
- `src/lib/tmdb.ts` mixes low-level fetch helpers and high-level page-building functions.
  That is practical, but large.
- `MagicBento`, `SplitText`, and animated UI layers make the interface feel premium, but they also make the codebase harder to reason about.
- The app branding is `FreeFlix`, while the repository name is `ShadowFlix`.
  That should be explained clearly in an interview or portfolio entry.

## 🤖 AI-Generated Patterns

- Some sections are more visually ambitious than functionally necessary
- Several components contain a lot of styling and animation logic in one file
- Some abstractions are thin wrappers, for example `MovieRow` over `CarouselRow`
- The player source builder computes provider links, but the current returned sections only expose third-party and trailer sections
- There are traces of copy that are marketing-heavy and could be simplified for maintainability

---

## 🎤 How to Explain This Project in Interview

You should describe it as a frontend-heavy media discovery platform that uses TMDB as the content source and focuses on UI composition, routing, client interaction, and local persistence.

Do not claim you built a full streaming backend.
Do not claim this is a production-grade licensed streaming platform.
Be clear that it is a learning project and that some parts were built with AI assistance and then studied/improved.

### 🗣️ Example Answer

> I built a media discovery web app called ShadowFlix, branded in the UI as FreeFlix. It uses Next.js App Router, React, and TypeScript, and pulls movie and TV metadata from TMDB. I created pages for home discovery, search, top movies, top TV shows, and dynamic detail pages for titles, people, studios, genres, years, and collections. I also added a local watch-history system using IndexedDB and built reusable UI components like carousels, banners, and a fullscreen player modal. It was a learning project built with AI assistance, so part of my work was not just generating code but understanding it, cleaning it up, and learning how the data flow and routing work end to end.

---

# 💼 For Hiring Managers

## 👨‍💻 Candidate Summary

- Learns by building real interfaces, not only tutorials
- Uses AI as a productivity tool, but still needs to understand and refine generated code
- Comfortable working with modern frontend tooling and API-driven UI
- Shows initiative in combining design, routing, SEO, and client-side persistence

## 🚀 What This Project Shows

- Ability to integrate an external API into a polished UI
- Ability to work with Next.js App Router and React component composition
- Ability to model and render multiple content types
- Ability to build a richer frontend without needing a custom backend

## ⚡ Key Highlights

- Multi-page Next.js application with dynamic routing
- TMDB integration abstracted into a reusable data layer
- Strong visual presentation with custom interactive components
- Local persistence using IndexedDB
- Search and browse pagination through internal API routes
- SEO-oriented metadata and structured data support

## 🧰 Skills Demonstrated

- TypeScript
- React
- Next.js App Router
- API integration
- UI composition
- Client-side state management
- IndexedDB basics
- SEO metadata generation
- Responsive layout work
- Animation integration with GSAP and Motion

## 📊 Complexity Level

- Honest level: `Intermediate`

Why:

- The app has real routing, API usage, caching, and local persistence
- But it does not include authentication, authorization, backend services, tests, or a full production architecture

## ✅ Strengths

- Strong visual ambition
- Good use of reusable components
- Clear separation between routes, components, library helpers, and types
- Practical use of external API data
- Good portfolio value for frontend-focused roles

## ⚠️ Improvements

- Add automated tests
- Split large files like `src/lib/tmdb.ts` and `src/app/[resource]/[slug]/page.tsx`
- Reduce styling/animation density in some components
- Improve naming consistency between repo name and product name
- Clarify legal/product positioning around third-party playback sources
- Add error boundaries and better user-facing empty/error states

## ❓ Interview Questions

- Why did you choose IndexedDB instead of localStorage for watch history?
- How does the dynamic `[resource]/[slug]` route decide which page to render?
- What data is fetched on the server versus on the client?
- How would you refactor `src/lib/tmdb.ts` as the app grows?
- How would you add user accounts and sync watch history across devices?
- What would you change before calling this production-ready?

## 🧾 Recruiter TL;DR

This is a solid frontend learning project with real engineering substance.
It demonstrates modern React/Next.js usage, external API integration, dynamic routing, local persistence, and UI implementation skill.
It is not a complete production streaming platform, but it is strong evidence of practical hands-on learning and execution.

---

# 📈 How to Improve This Project

- Add unit tests for helpers like `slug.ts`, `utils.ts`, and player-source builders
- Add integration or end-to-end tests for search, browse, and detail pages
- Split `src/lib/tmdb.ts` into smaller modules such as `fetch.ts`, `home.ts`, `search.ts`, `player.ts`, and `browse.ts`
- Split the dynamic route file by moving each page builder into separate files
- Add proper error UI for missing TMDB data or bad API responses
- Add loading skeletons more consistently across routes
- Expose official watch providers in the player UI if that is a product goal
- Add a real backend and authentication if cross-device sync is needed
- Review accessibility for keyboard navigation, focus states, and modal behavior
- Replace hardcoded marketing-heavy copy with simpler, reusable content constants

### Good next learning steps

- Learn Next.js App Router patterns deeply
- Learn testing with Vitest or Playwright
- Learn backend basics with a real database and auth provider
- Learn performance profiling for animation-heavy interfaces
- Learn how to structure feature-based folders as projects grow

---

# 📦 Appendix

## Useful scripts

```bash
npm run dev
npm run build
npm run build:cf
npm run start
npm run lint
```

## Important dependencies

| Package | Why it is used |
|--------|-----------------|
| `next` | App framework and routing |
| `react` / `react-dom` | UI rendering |
| `typescript` | Type safety |
| `tailwindcss` | Utility-first styling |
| `gsap` / `@gsap/react` | Advanced animation effects |
| `motion` | Motion-based UI interactions |
| `wrangler` | Cloudflare-related tooling |

## Honest project summary

- Beginner-friendly to explain: `Yes`
- Good portfolio piece: `Yes`
- Production-ready as-is: `No`
- Strong learning value: `Yes`
- Best fit: frontend developer learning project with visible practical effort
