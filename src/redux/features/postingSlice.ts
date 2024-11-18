import { createSlice } from "@reduxjs/toolkit";
import { IPostingUserState } from "../../Types";

const initialState: IPostingUserState = { id: "" };

export const postingSlice = createSlice({
  name: "postingUser",
  initialState,
  reducers: {
    setPostingUser: (state, action) => {
      //状態(state)に情報をセット(保存)しておく。
      state.id = action.payload.id;
      // state.uid = action.payload.uid;
    },
  },
});

export const { setPostingUser } = postingSlice.actions;
export default postingSlice.reducer;
