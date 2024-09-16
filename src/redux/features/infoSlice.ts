import { createSlice } from "@reduxjs/toolkit";
import { IInfoState } from "../../Types";

const initialState: IInfoState = { uid: [] };

export const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setInfo: (state, action) => {
      //状態(state)に情報をセット(保存)しておく。
      state.uid = action.payload;
    },
  },
});

export const { setInfo } = infoSlice.actions;
export default infoSlice.reducer;
