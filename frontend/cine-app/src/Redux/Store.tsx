import { configureStore } from "@reduxjs/toolkit";
import darkThemeSlice from "./DarkThemeSlice/DarkTheme";
import popularMovies from "./MoviesSlice/PopularMovies";
import MovieId from "./MovieIdSlice/MovieId";
import loaderSlice from "./LoaderSlice/LoaderSlice";
import seriesSlice from "./SeriesSlice/PopularSeriesSlice";
import storeSeasonsSlice from "./SeriesSlice/StoreSeasonsSlice";

const store = configureStore({
  reducer: {
    darkTheme: darkThemeSlice.reducer,
    popularMovies: popularMovies.reducer,
    movieId: MovieId.reducer,
    loader: loaderSlice.reducer,
    seriesData: seriesSlice.reducer,
    storeSeasons: storeSeasonsSlice.reducer,
  },
  // devTools: process.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store