import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchMovie, SearchSeries } from '../../types/SearchType';

interface FilteredResultsState {
  filteredMovies: SearchMovie[];
  filteredSeries: SearchSeries[];
  filtersApplied: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: FilteredResultsState = {
  filteredMovies: [],
  filteredSeries: [],
  filtersApplied: false,
  isLoading: false,
  error: null,
};

const filteredResultsSlice = createSlice({
  name: 'filteredResults',
  initialState,
  reducers: {
    setFilteredMovies: (state, action: PayloadAction<SearchMovie[]>) => {
      state.filteredMovies = action.payload;
    },
    setFilteredSeries: (state, action: PayloadAction<SearchSeries[]>) => {
      state.filteredSeries = action.payload;
    },
    setFiltersApplied: (state, action: PayloadAction<boolean>) => {
      state.filtersApplied = action.payload;
    },
    clearFilteredResults: (state) => {
      state.filteredMovies = [];
      state.filteredSeries = [];
      state.filtersApplied = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFilteredMovies,
  setFilteredSeries,
  setFiltersApplied,
  clearFilteredResults,
  setLoading,
  setError,
} = filteredResultsSlice.actions;

export default filteredResultsSlice;