import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import selectedBlogReducer from "./selectedBlogSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    selectedBlog: selectedBlogReducer,
  },
});

export default store;
