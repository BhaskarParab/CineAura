// types/MovieDetail.ts

export interface CastMember {
  adult: boolean;
  cast_id?: number;          
  character: string;
  credit_id: string;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  order?: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface CrewMember {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number | null;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Review {
  author: string;
  author_details: {
    name: string | null;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at?: string;
  id?: string;
  updated_at?: string;
  url?: string;
}

export interface Video {
  iso_639_1?: string;
  iso_3166_1?: string;
  name: string;
  key: string;
  site?: string; // YouTube
  size?: number;
  type: string; // Trailer, Teaser, Featurette, etc.
  official?: boolean;
  published_at?: string;
  id?: string;
}

// Basic movie type returned by list endpoints
export interface MovieType {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[]; // Array of genre IDs, not full genre objects
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Full movie detail type returned by detail endpoint
export interface MovieDetailType {
  adult?: boolean;
  backdrop_path: string | null;
  belongs_to_collection?: null;
  budget: number;

  credits: Credits;

  genres: Genre[]; // Array of full genre objects
  homepage: string | null;
  id: number;
  imdb_id: string | null;

  origin_country: string[];
  original_language: string;
  original_title: string;

  overview: string;
  popularity: number;
  poster_path: string | null;

  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];

  release_date: string;
  revenue: number;

  reviews: {
    page: number;
    results: Review[];
    total_pages: number;
    total_results: number;
  };

  runtime: number | null;
  spoken_languages?: null;

  status: string;
  tagline: string | null;
  title: string;
  video: boolean;

  videos: {
    results: Video[];
  };

  vote_average: number;
  vote_count: number;
}

// API response types
export interface MovieApiResponse {
  page: number;
  results: MovieType[]; // Use MovieType for list endpoints
  total_pages: number;
  total_results: number;
}

export interface GenreApiResponse {
  genres: Genre[];
}

// Union type for both movie types
export type Movie = MovieType | MovieDetailType;