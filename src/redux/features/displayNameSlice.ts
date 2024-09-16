import { createSlice } from "@reduxjs/toolkit";
import { IDispNameState } from "../../Types";

const initialState: IDispNameState = {
  displayName: "",
};

export const displayNameSlice = createSlice({
  name: "displayName",
  initialState,
  reducers: {
    setDisplayName: (state, action) => {
      //状態(state)に情報をセット(保存)しておく。
      state.displayName = action.payload;
    },
  },
});

export const { setDisplayName } = displayNameSlice.actions;
export default displayNameSlice.reducer;
