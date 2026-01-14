import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    //toggleComment panel

    toggleComment: (state) => {
      state.isOpen = !state.isOpen;
    },

    //closeComment panel
    closeComment: (state) => {
      state.isOpen = false;
    },
    //openComment panel
    openComment: (state) => {
      state.isOpen = true;
    },
  },
});

export const { toggleComment, closeComment, openComment } =
  commentSlice.actions;
export default commentSlice.reducer;
