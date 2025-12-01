import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme");

interface DarkType{
  value: "light" | "dark"
}

const initialState: DarkType = {
  value: savedTheme === "dark" ? "dark" : "light",
}

const darkThemeSlice = createSlice({
  name: 'darkTheme',
  initialState,
  reducers: {
    darkToggle: (state) => {
      state.value = state.value === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.value)
    }
  }
})

export const {darkToggle} = darkThemeSlice.actions
export default darkThemeSlice