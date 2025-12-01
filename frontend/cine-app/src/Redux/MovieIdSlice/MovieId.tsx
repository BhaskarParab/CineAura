import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MovieIdType{
  movie_ID: number | null
}

const initialState: MovieIdType = {
  movie_ID: null
}

const movieIdSlice = createSlice({
  name: 'MovieId',
  initialState,
  reducers:{
    storeMovieId: (state, action: PayloadAction<number>) => {
      state.movie_ID = action.payload
    },
    clearMovieId: (state) => {
      state.movie_ID = null
    }
  }
});

export const {storeMovieId, clearMovieId} = movieIdSlice.actions;

export default movieIdSlice