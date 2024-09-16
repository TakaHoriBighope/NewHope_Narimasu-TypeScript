import { createSlice } from "@reduxjs/toolkit";
import { ISelectPosterModalState } from "../../Types";

const initialState: ISelectPosterModalState = {
  isSelectPosterOpen: false,
};

const selectPosterModalSlice = createSlice({
  name: "selectPosterModal",
  initialState,
  reducers: {
    openSelectPosterModal: (state) => {
      state.isSelectPosterOpen = true;
    },
    closeSelectPosterModal: (state) => {
      state.isSelectPosterOpen = false;
    },
  },
});

export const { openSelectPosterModal, closeSelectPosterModal } =
  selectPosterModalSlice.actions;
export default selectPosterModalSlice.reducer;
