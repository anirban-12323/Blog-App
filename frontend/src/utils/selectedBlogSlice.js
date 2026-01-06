import { createSlice } from "@reduxjs/toolkit";

export const selectedBlogSlice = createSlice({
  name: "selectedBlogSlice",
  initialState: JSON.parse(localStorage.getItem("selectedBlog")) || {},
  reducers: {
    addSelectedBlog(state, action) {
      localStorage.setItem("selectedBlog", JSON.stringify(action.payload));
      return action.payload;
    },
    removeSelectedBlog(state, action) {
      localStorage.removeItem("selectedBlog");
      return {};
    },
  },
});

export const { addSelectedBlog, removeSelectedBlog } =
  selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
