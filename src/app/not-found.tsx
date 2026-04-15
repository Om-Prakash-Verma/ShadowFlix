import { AppLink } from "@/components/app-link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.38em] text-white/55">404</p>
      <h1 className="mt-4 text-4xl font-black text-white">This title drifted off the marquee.</h1>
      <p className="mt-4 text-white/70">The page could not be found, but the homepage still has plenty of films, shows, genres, and ranked lists to explore.</p>
      <AppLink href="/" className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/88">Return Home</AppLink>
    </main>
  );
}

