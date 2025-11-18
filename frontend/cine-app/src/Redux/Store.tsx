import { configureStore } from "@reduxjs/toolkit";
import darkThemeSlice from "./DarkThemeSlice/DarkTheme";
import popularMovies from "./PopularMoviesSlice/PopularMovies";


const store = configureStore({
  reducer: {
    darkTheme: darkThemeSlice.reducer,
    popularMovies: popularMovies.reducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store