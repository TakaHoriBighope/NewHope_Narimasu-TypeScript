import { createSlice } from "@reduxjs/toolkit";
import { IPostState } from "../../Types";

const initialState: IPostState = { post: [] };

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostList: (state, action) => {
      //状態にpost document numberをセット(保存)しておく。
      state.post = action.payload;
    },
  },
});

export const { setPostList } = postSlice.actions;
export default postSlice.reducer;
