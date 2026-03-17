// Jikan API Types
export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AnimeBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface AnimeProducer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeCharacter {
  mal_id: number;
  url: string;
  images: {
    jpg: AnimeImage;
    webp: AnimeImage;
  };
  name: string;
}

export interface AnimeVoiceActor {
  person: {
    mal_id: number;
    url: string;
    images: {
      jpg: AnimeImage;
    };
    name: string;
  };
  language: string;
}

export interface AnimeCharacterStaff {
  character: AnimeCharacter;
  voice_actors: AnimeVoiceActor[];
}

export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: AnimeImage;
    webp: AnimeImage;
  };
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    string: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
  };
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: AnimeBroadcast;
  producers: AnimeProducer[];
  licensors: AnimeProducer[];
  studios: AnimeProducer[];
  genres: AnimeGenre[];
  explicit_genres: AnimeGenre[];
  themes: AnimeGenre[];
  demographics: AnimeGenre[];
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanMultipleResponse<T> {
  data: T[];
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// For search results
export interface AnimeSearchResult {
  mal_id: number;
  url: string;
  images: {
    jpg: AnimeImage;
    webp: AnimeImage;
  };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null;
  episodes: number | null;
  status: string | null;
  score: number | null;
  synopsis: string | null;
  season: string | null;
  year: number | null;
  genres: AnimeGenre[];
}

// Person/Character Types
export interface PersonAnime {
  position: string;
  anime: {
    mal_id: number;
    url: string;
    images: {
      jpg: AnimeImage;
    };
    title: string;
    type: string;
    role: string;
  };
}

export interface PersonManga {
  position: string;
  manga: {
    mal_id: number;
    url: string;
    images: {
      jpg: AnimeImage;
    };
    title: string;
    type: string;
    role: string;
  };
}

export interface PersonVoiceActing {
  role: string;
  anime: {
    mal_id: number;
    url: string;
    images: {
      jpg: AnimeImage;
    };
    title: string;
  };
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: AnimeImage;
    };
    name: string;
  };
}

export interface Person {
  mal_id: number;
  url: string;
  website_url: string | null;
  images: {
    jpg: AnimeImage;
  };
  name: string;
  given_name: string | null;
  family_name: string | null;
  alternate_names: string[];
  birthday: string | null;
  favorites: number;
  about: string | null;
  anime: PersonAnime[];
  manga: PersonManga[];
  voices: PersonVoiceActing[];
}
