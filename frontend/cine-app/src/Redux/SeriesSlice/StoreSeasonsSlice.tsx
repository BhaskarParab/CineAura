import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date?: string;
  still_path?: string;
  runtime?: number;
  vote_average?: number;
  vote_count?: number;
}

export interface SeasonData {
  _id?: string;
  id: number;
  name: string;
  season_number: number;
  air_date?: string;
  episode_count?: number;
  poster_path?: string;
  episodes: Episode[];
}

export interface SeasonWithEpisodes {
  season: number;
  episodes: Episode[];
}

export interface SeasonsState {
  seasonsData: SeasonWithEpisodes[];
}

const initialState: SeasonsState = {
  seasonsData: []
};

const storeSeasonsSlice = createSlice({
  name: 'storeSeasons',
  initialState,
  reducers: {
    storeSeasons: (state, action: PayloadAction<SeasonWithEpisodes []>) => {
      state.seasonsData = action.payload;
    }
  }
})

export const { storeSeasons } = storeSeasonsSlice.actions
export default storeSeasonsSlice