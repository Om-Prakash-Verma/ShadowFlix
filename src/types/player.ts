export interface DemoServer {
  id: number;
  name: string;
  movieLink: (id: string) => string;
  episodeLink: (id: string, season: number, episode: number) => string;
  notes?: string;
  kind?: "embed" | "link";
  useImdb?: boolean;
}

export interface PlayerSource {
  id: string;
  name: string;
  src: string;
  label?: string;
  kind?: "embed" | "link";
}

export interface PlayerSourceSection {
  id: string;
  title: string;
  description?: string;
  sources: PlayerSource[];
}