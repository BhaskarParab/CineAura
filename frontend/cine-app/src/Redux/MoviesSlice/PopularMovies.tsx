import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface MovieType {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number;
  original_language?: string;
  overview: string;
  popularity?: number;
  poster_path: string;
  release_date: string;
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count?: number;
}

export interface PopularMoviesType{
  page: number;
  results: MovieType[];
  total_pages: number;
  total_results: number;
}

interface DataStoreType {
  data: MovieType[];
}

const initialState: DataStoreType = {
  data: [],
};

const popularMoviesSlice = createSlice({
  name: "popularMovies",
  initialState,
  reducers: {
    storeData: (state, action: PayloadAction<MovieType[]>) => {
      state.data = action.payload;
    },
  },
});

export const { storeData } = popularMoviesSlice.actions;
export default popularMoviesSlice;
