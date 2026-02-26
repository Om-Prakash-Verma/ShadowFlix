
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/layout';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Streaming Guides & Watch Lists',
  description: 'Expert guides on where to watch the latest movies and TV shows for free in 4K. Stay updated with FlixWatch streaming tips.',
};

const guides = [
  {
    title: "How to Watch Movies in 4K for Free",
    description: "A complete guide on utilizing FlixWatch for the best viewing experience without subscriptions.",
    slug: "how-to-watch-4k-free",
    category: "Tutorial"
  },
  {
    title: "Best Action Movies of 2024",
    description: "Our hand-picked list of the highest-rated action films available to stream right now.",
    slug: "best-action-movies-2024",
    category: "Top Lists"
  },
  {
    title: "Understanding Streaming Quality: 720p vs 4K",
    description: "Why bitrate matters more than resolution when you are streaming online.",
    slug: "streaming-quality-explained",
    category: "Tech"
  }
];

export default function GuidesPage() {
  return (
    <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
          Streaming <span className="text-primary">Guides</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Master the art of free streaming with our expert-curated lists and technical tutorials.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group">
            <Card className="h-full border-primary/10 hover:border-primary/40 transition-all duration-300">
              <CardHeader>
                <Badge className="w-fit mb-2">{guide.category}</Badge>
                <CardTitle className="group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-bold text-primary">Read Guide →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
