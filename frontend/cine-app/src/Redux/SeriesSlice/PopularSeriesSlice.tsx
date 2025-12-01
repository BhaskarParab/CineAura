import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SeriesDataType {
  adult: boolean;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  media_type?: string; // "tv"
  name: string;
  origin_country: string[];
  original_language?: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count?: number;
}

interface DataStoreType {
  seriesData: SeriesDataType[];
}

const initialState: DataStoreType = {
  seriesData: [],
};

const seriesSlice = createSlice({
  name: "seriesData",
  initialState,
  reducers: {
    storeSeries: (state, action: PayloadAction<SeriesDataType[]>) => {
      state.seriesData = action.payload;
    },
  },
});

export const { storeSeries } = seriesSlice.actions;
export default seriesSlice;
