export interface Episode {
  id: string;
  number: number;
  title: string;
  image: string;
  duration: string;
}

export interface Anime {
  id: string;
  title: string;
  coverImage: string;
  bannerImage: string;
  rating: number;
  episodes: number;
  genres: string[];
  description: string;
  year: number;
  status: string;
  episodeList?: Episode[];
}