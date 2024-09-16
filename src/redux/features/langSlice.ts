import { createSlice } from "@reduxjs/toolkit";
import { ILangState } from "../../Types";

const initialState: ILangState = { lang: "ja" };

export const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;
