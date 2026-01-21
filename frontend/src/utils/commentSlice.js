import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks--
//fetch comments
export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (blogId) => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/blogs/${blogId}/comments`,
    );
    return res.data.comments;
  },
);

export const likeComment = createAsyncThunk(
  "comments/like",
  async ({ commentId, token, userId }) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return { commentId, userId };
  },
);

//edit comment
export const editComment = createAsyncThunk(
  "comments/edit",
  async ({ commentId, text, token }) => {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}`,
      { comment: text },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data.comment;
  },
);

// add comment

export const addComment = createAsyncThunk(
  "comments/add",
  async ({ blogId, comment, token }) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/blogs/${blogId}/comments`,
      { comment: comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data.comment;
  },
);

const initialState = {
  //UI
  isOpen: false,

  //DATA
  list: [],
  count: 0,
  loading: false,
  error: null,
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
    clearComments: (state) => {
      ((state.list = []), (state.count = 0));
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch

      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.count = action.payload.length;
        state.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //add
      .addCase(addComment.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.count += 1;
      })
      //like comment
      .addCase(likeComment.fulfilled, (state, action) => {
        const { commentId, userId } = action.payload;

        const c = state.list.find((c) => c._id === commentId);
        if (!c) return;

        const alreadyLiked = c.likes.includes(userId);

        if (alreadyLiked) {
          // unlike
          c.likes = c.likes.filter((id) => id !== userId);
        } else {
          // like
          c.likes.push(userId);
        }
      });

    // edit comment
    builder.addCase(editComment.fulfilled, (state, action) => {
      const index = state.list.findIndex((c) => c._id === action.payload._id);

      if (index !== -1) {
        state.list[index].comment = action.payload.comment;
      }
    });
  },
});

export const { toggleComment, closeComment, openComment, clearComments } =
  commentSlice.actions;
export default commentSlice.reducer;
