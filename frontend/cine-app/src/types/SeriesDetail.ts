// src/types/SeriesDetail.ts

// Represents a single genre, like "Action" or "Comedy".
export interface Genre {
  id: number;
  name: string;
}

// Represents a production company or a network.
export interface Company {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// Represents a single video (Trailer, Teaser, etc.).
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string; // e.g., "Trailer", "Teaser", "Clip"
  official: boolean;
  published_at: string;
}

// Represents a cast member.
export interface CastMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

// Represents a crew member (Director, Writer, etc.).
export interface CrewMember {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

// The combined credits object from the API.
export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// Details for the author of a review.
export interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

// Represents a single user review.
export interface Review {
  id: string;
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

// The combined reviews object from the API.
export interface Reviews {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

// The main interface for the entire Series Detail data structure.
// This combines the base series info with the appended data (videos, credits, reviews).
export interface SeriesDetailType {
  // Base Series Information
  adult: boolean;
  backdrop_path: string | null;
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  networks: Company[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Company[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string; // e.g., "Returning Series", "Ended"
  tagline: string;
  type: string; // e.g., "Scripted", "Reality", "Documentary"
  vote_average: number;
  vote_count: number;

  // Appended Data from API
  videos: {
    id: number;
    results: Video[];
  };
  credits: Credits;
  reviews: Reviews;
}