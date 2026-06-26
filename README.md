# ShadowFlix (FreeFlix)

A premium, high-performance, and immersive movie & series discovery and streaming web application. Built using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **GSAP**, and **Framer Motion**, the application is optimized for edge-network deployments like Cloudflare Pages.

This repository demonstrates advanced expertise in client-side telemetry, custom interactive animation physics, edge-caching architectures, and performance-minded front-end systems.

---

## 🚀 Key Features & Architectural Highlights

### 1. High-Fidelity UI/UX & Custom Animations
*   **Interactive Bento Grid (`MagicBento`)**: Engineered custom components leveraging **GSAP** to create fluid, mouse-tracked spotlight gradients, 3D card tilt transformations, magnetic pull properties, dynamic boundary border glows, and click-triggered canvas particle ripples.
*   **Performance-Minded Typography (`SiteTextAnimator` & `SplitText`)**: Automatically splits viewport headings and paragraphs into letters or words using GSAP SplitText. Features automated performance fallbacks: checks user-reduced motion settings, touch capabilities, and system capabilities (e.g., `navigator.hardwareConcurrency`) to disable or simplify text animations on low-power devices.
*   **macOS-style Navigation Dock (`DockNavigation`)**: A floating navigation bar utilizing spring mechanics (`motion/react`) to interpolate item magnification based on cursor hover proximity.

### 2. Client-Side Telemetry & Personalized Dashboard
*   **IndexedDB Activity Store (`watchlist-db.ts` & `activity-tracker.tsx`)**: Crafted a serverless tracking framework that logs visited titles, watch sessions, and clicks using native HTML5 IndexedDB. This updates a personal watchlist dashboard with real-time watch counters, detailed timestamps, and filterable metrics (all media, movie-only, series-only, genres) without requiring a backend database or user registration.

### 3. Multi-Source Streaming & Security
*   **Dynamic Mirroring Engine (`demo-servers.ts`)**: Integrates international streaming mirrors that dynamically resolve links using TMDB and IMDB identifiers, including localized dub/sub streams (English, Hindi, Tamil, Telugu, Spanish, French, Portuguese, Bengali, and Vietnamese).
*   **Secure Player Sandbox (`player-modal.tsx`)**: Employs a custom portal-rendered player modal containing an iframe sandboxing toggle, letting users isolate third-party servers and block intrusive redirects or scripts on demand.

### 4. Enterprise-Grade SEO & Edge Deployment
*   **Schema JSON-LD Injection (`seo.ts`)**: Automated rich snippet schemas (`websiteSchema`, `organizationSchema`, `faqSchema`, `mediaSchema`, `collectionSchema`) to optimize crawler discovery.
*   **Edge Runtime Configuration**: Configured pages for runtime edge compatibility (`export const runtime = "edge"`), minimizing Time to First Byte (TTFB) and ensuring zero-cold-start performance on Cloudflare Pages.
*   **Next.js Server Caching**: Utilizes advanced Next.js caching with background revalidation (`revalidate = 3600`) to query TMDB API resources efficiently.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16 (App Router, React 19, TypeScript)
*   **Styling**: Tailwind CSS v4, Vanilla CSS Custom Variables
*   **Animations**: GSAP 3 (ScrollTrigger, SplitText), Framer Motion (`motion/react`)
*   **Database**: HTML5 IndexedDB API
*   **Deployment Target**: Cloudflare Pages / Edge Runtime (via Wrangler and `@cloudflare/next-on-pages`)
*   **Third-Party APIs**: The Movie Database (TMDB)

---

## 📁 Repository Structure

```text
├── public/                 # Static assets (Favicons, OpenGraph images)
├── src/
│   ├── app/                # Next.js App Router Page hierarchy
│   │   ├── [resource]/     # Dynamic edge routes (movie, tv, person, collection, genre, year)
│   │   ├── search/         # Search page and multi-query handler
│   │   ├── top-movies/     # Curated top-rated movies page
│   │   ├── top-tv-shows/   # Curated top-rated series page
│   │   ├── watchlist/      # Watchlist dashboard rendering IndexedDB records
│   │   └── globals.css     # Global styles & Tailwind v4 configuration
│   ├── components/         # Reusable React UI Components
│   │   ├── MagicBento.tsx  # Dynamic interactive GSAP Bento Grid
│   │   ├── SplitText.tsx   # GSAP Scroll-Triggered text animations
│   │   ├── dock-navigation.tsx # Floating Spring Dock navigation
│   │   ├── tv-season-browser.tsx # Interactive season/episode switcher
│   │   ├── player-modal.tsx # Video player portal with sandbox features
│   │   └── ...
│   ├── lib/                # Utility modules & API Clients
│   │   ├── tmdb.ts         # Cached TMDB API client wrapper
│   │   ├── watchlist-db.ts # IndexedDB database adapter
│   │   ├── seo.ts          # JSON-LD Schema generators
│   │   └── ...
│   └── types/              # TypeScript typings
└── package.json            # Configuration and dependencies
```

---

## 💼 Resume Profile Section

Below is professional copy describing the development of this project. You can copy and paste this directly into your resume under **Projects** or **Work Experience**:

### **Lead Frontend / Full-Stack Engineer** | **ShadowFlix Streaming & Discovery Platform**
*   **High-Fidelity Animations**: Designed custom, interactive UI layouts including a macOS-style floating dock with spring-magnification physics and a 3D Bento Grid featuring mouse-tracked spotlight gradients, gravity, and particle emission physics using **GSAP (ScrollTrigger, SplitText)** and **Framer Motion**.
*   **Client-Side Telemetry**: Built a serverless user telemetry system using the **HTML5 IndexedDB API** to track user watch sessions, page visits, and click rates locally without backend database dependencies, updating a personalized metrics dashboard in real time.
*   **Performance Optimization**: Implemented hardware concurrency checks (`navigator.hardwareConcurrency`), reduced-motion queries, and device capability detection to dynamically disable or scale down rendering loads, maintaining a 60 FPS performance standard on low-power devices.
*   **SEO & Crawler Optimization**: Structured **JSON-LD Schema tags** (Movie, TVSeries, FAQ, Collection, and Person schemas) and custom OpenGraph/Twitter card metadata templates, resulting in optimized crawlability and search visibility.
*   **Edge Architecture**: Configured routes for **Edge-runtime execution** (`runtime = 'edge'`) and deployed the platform onto **Cloudflare Pages**, integrating background caching and revalidation strategies for third-party TMDB API wrappers.
*   **Security Integration**: Developed a custom fullscreen video player portal with a toggleable iframe sandbox control to block unauthorized third-party redirects, protecting clients while streaming from multiple mirror locations.

---

## ⚙️ Getting Started

### 1. Environment Configuration
Create a `.env` file in the root directory and add your credentials:
```env
TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 2. Local Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Running Locally
Start the local development server:
```bash
npm run dev
```

### 4. Build and Edge Preview
To bundle and preview the application for Cloudflare Pages locally:
```bash
npm run build:cf
npm run preview
```
