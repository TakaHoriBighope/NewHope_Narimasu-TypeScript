import { createSlice } from "@reduxjs/toolkit";
import { IEditModalState } from "../../Types";

const initialState: IEditModalState = {
  isEditOpen: false,
};

const editModalSlice = createSlice({
  name: "editModal",
  initialState,
  reducers: {
    openEditModal: (state) => {
      state.isEditOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditOpen = false;
    },
  },
});

export const { openEditModal, closeEditModal } = editModalSlice.actions;
export default editModalSlice.reducer;
