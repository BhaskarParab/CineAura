import { createSlice } from "@reduxjs/toolkit";

interface DarkType{
  value: boolean
}

const initialState: DarkType = {
  value: false,
}

const darkThemeSlice = createSlice({
  name: 'darkTheme',
  initialState,
  reducers: {
    darkToggle: (state) => {
      state.value = !state.value
    }
  }
})

export const {darkToggle} = darkThemeSlice.actions
export default darkThemeSlice