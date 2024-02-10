import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: [] };

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      //状態(state)に情報をセット(保存)しておく。
      state.value = action.payload;
    },
  },
});

export const { setPost } = postSlice.actions;
export default postSlice.reducer;
