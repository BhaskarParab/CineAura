// Minimal Movie type for search results
export interface SearchMovie {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: "movie";

  overview: string;
  release_date?: string;
  vote_average?: number;
  adult?: boolean;
  backdrop_path?: string | null;
  genre_ids?: number[];
  popularity?: number | null;
}

// Minimal Series type for search results
export interface SearchSeries {
  id: number;
  name: string;
  poster_path: string | null;
  media_type: "tv";

  overview: string;
  first_air_date?: string;
  vote_average?: number;
  adult?: boolean;
  backdrop_path?: string | null;
  genre_ids?: number[];
  popularity?: number | null;
}

// Person type
export interface PersonResult {
  id: number;
  name: string;
  original_name?: string;
  profile_path: string | null;
  media_type: "person";
  adult?: boolean;

  // Person does NOT have fixed movie fields but your component reads them
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  popularity?: number | null;

  known_for?: Array<SearchMovie | SearchSeries>;
}

// Union type for search items
export type SearchItem = SearchMovie | SearchSeries | PersonResult;
