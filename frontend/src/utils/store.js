import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import selectedBlogReducer from "./selectedBlogSlice";
import commentReducer from "./commentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    selectedBlog: selectedBlogReducer,
    comments: commentReducer,
  },
});

export default store;
