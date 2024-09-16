import { createSlice } from "@reduxjs/toolkit";
import { IGroupModalState } from "../../Types";

const initialState: IGroupModalState = {
  isGroupOpen: false,
};

const groupModalSlice = createSlice({
  name: "groupModal",
  initialState,
  reducers: {
    openGroupModal: (state) => {
      state.isGroupOpen = true;
    },
    closeGroupModal: (state) => {
      state.isGroupOpen = false;
    },
  },
});

export const { openGroupModal, closeGroupModal } = groupModalSlice.actions;
export default groupModalSlice.reducer;
