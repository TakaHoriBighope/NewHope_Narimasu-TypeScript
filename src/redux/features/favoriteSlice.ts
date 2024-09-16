import { createSlice } from "@reduxjs/toolkit";
import { IFavoriteState } from "../../Types";

const initialState: IFavoriteState = { uid: [] };

export const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavoriteList: (state, action) => {
      //状態に情報をセット(保存)しておく。
      state.uid = action.payload;
    },
  },
});

export const { setFavoriteList } = favoriteSlice.actions;
export default favoriteSlice.reducer;
