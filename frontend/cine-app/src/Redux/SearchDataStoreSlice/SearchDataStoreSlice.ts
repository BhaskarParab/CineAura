import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchItem } from "../../types/SearchType";

interface SearchResponse {
  results: SearchItem[];
}

const initialState: SearchResponse = {
  results: [],
};


const SearchDataSlice = createSlice({
  name: 'searchStoreData',
  initialState,
  reducers: {
    storeSearch: (state, action:PayloadAction<SearchItem[]>) => {
      state.results = action.payload
    }
  }
})


export const { storeSearch } = SearchDataSlice.actions
export default SearchDataSlice