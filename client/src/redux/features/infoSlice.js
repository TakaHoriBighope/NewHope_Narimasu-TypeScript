import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: [] };

export const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setInfo: (state, action) => {
      //状態(state)に情報をセット(保存)しておく。
      state.value = action.payload;
    },
  },
});

export const { setInfo } = infoSlice.actions;
export default infoSlice.reducer;
