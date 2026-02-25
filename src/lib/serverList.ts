
export interface Server {
  id: number;
  name: string;
  movieLink: (id: string) => string;
  episodeLink: (id: string, season: number, episode: number) => string;
  useImdb?: boolean;
}

export const serverList: Server[] = [
  {
    id: 1,
    name: "Best Server",
    movieLink: (tmdbId: string) => `https://rivestream.net/embed?type=movie&id=${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://rivestream.net/embed?type=tv&id=${tmdbId}&season=${season}&episode=${episode}`,
  },
  {
    id: 2,
    name: "VidKing",
    movieLink: (tmdbId: string) => `https://www.vidking.net/embed/movie/${tmdbId}?autoPlay=true`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true&nextEpisode=true&episodeSelector=true`,
  },
  {
    id: 3,
    name: "Fmovies+",
    movieLink: (tmdbId: string) => `https://www.fmovies.gd/watch/movie/${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://www.fmovies.gd/watch/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 4,
    name: "Russian ",
    movieLink: (imdbId: string) => `https://api.insertunit.ws/embed/imdb/${imdbId}`,
    episodeLink: (imdbId: string, season: number, episode: number) => `https://api.insertunit.ws/embed/imdb/${imdbId}?season=${season}&episode=${episode}`,
    useImdb: true,
  },
  {
    id: 5,
    name: "French ",
    movieLink: (tmdbId: string) => `https://frembed.my/api/film.php?id=${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://frembed.live/api/serie.php?id=${tmdbId}&sa=${season}&epi=${episode}`,
  },
  {
    id: 6,
    name: "Spanish",
    movieLink: (tmdbId: string) => `https://vidfast.pro/movie/${tmdbId}?server=pablo`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?nextButton=true&autoNext=true`,
  },
  {
    id: 7,
    name: "Portugues",
    movieLink: (tmdbId: string) => `https://vidfast.pro/movie/${tmdbId}?server=samba`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?nextButton=true&autoNext=true`,
  },
  {
    id: 8,
    name: "Hindi ",
    movieLink: (tmdbId: string) => `https://player.vidify.top/embed/movie/${tmdbId}?server=hindi`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://player.vidify.top/embed/tv/${tmdbId}/${season}/${episode}?server=multi`,
  },
  {
    id: 9,
    name: "Tamil",
    movieLink: (tmdbId: string) => `https://player.vidify.top/embed/movie/${tmdbId}?server=tamil`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://player.vidify.top/embed/tv/${tmdbId}/${season}/${episode}?server=multi`,
  },
  {
    id: 10,
    name: "Telugu",
    movieLink: (tmdbId: string) => `https://player.vidify.top/embed/movie/${tmdbId}?server=tekugu`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://player.vidify.top/embed/tv/${tmdbId}/${season}/${episode}?server=multi`,
  },
  {
    id: 11,
    name: "Vietnam Sub ",
    movieLink: (tmdbId: string) => `https://player.vidify.top/embed/movie/${tmdbId}?server=alpha`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://player.vidify.top/embed/tv/${tmdbId}/${season}/${episode}?server=multi`,
  },
  {
    id: 12,
    name: "Bangladesh ",
    movieLink: (tmdbId: string) => `https://player.vidify.top/embed/movie/${tmdbId}?server=cobra`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://player.vidify.top/embed/tv/${tmdbId}/${season}/${episode}?server=multi`,
  },
  {
    id: 13,
    name: "Videasy ",
    movieLink: (tmdbId: string) => `https://player.videasy.net/movie/${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&color=8B5CF6`,
  },
  {
    id: 14,
    name: "Vidzee ",
    movieLink: (tmdbId: string) => `https://player.vidzee.wtf/embed/movie/${tmdbId}?server=1`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://player.vidzee.wtf/embed/tv/${tmdbId}/${season}/${episode}?server=1`,
  },
  {
    id: 15,
    name: "VidLink",
    movieLink: (tmdbId: string) => `https://vidlink.pro/movie/${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) =>
      `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=true&nextbutton=true`,
  },
  {
    id: 16,
    name: "111Movies",
    movieLink: (tmdbId: string) => `https://111movies.com/movie/${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://111movies.com/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 17,
    name: "Vidfast",
    movieLink: (tmdbId: string) => `https://vidfast.pro/movie/${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?nextButton=true&autoNext=true`,
  },
  {
    id: 18,
    name: "VidSrc",
    movieLink: (tmdbId: string) => `https://vidsrc.xyz/embed/movie/${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 19,
    name: "FilmKu",
    movieLink: (tmdbId: string) => `https://filmku.stream/embed/movie?tmdb=${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://filmku.stream/embed/series?tmdb=${tmdbId}&sea=${season}&epi=${episode}`,
  },
  {
    id: 20,
    name: "Nontongo",
    movieLink: (tmdbId: string) => `https://nontongo.win/embed/movie/${tmdbId}`,
    episodeLink: (tmdbId: string, season: number, episode: number) => `https://nontongo.win/embed/tv/${tmdbId}/${season}/${episode}`,
  }
];
