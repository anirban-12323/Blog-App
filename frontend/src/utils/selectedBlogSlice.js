import { createSlice } from "@reduxjs/toolkit";

export const selectedBlogSlice = createSlice({
  name: "selectedBlogSlice",
  initialState: JSON.parse(localStorage.getItem("selectedBlog")) || {
    creator: { _id: "" },
    likes: [],
    comments: [],
  },
  reducers: {
    addSelectedBlog(state, action) {
      localStorage.setItem("selectedBlog", JSON.stringify(action.payload));
      return action.payload;
    },
    removeSelectedBlog(state, action) {
      localStorage.removeItem("selectedBlog");
      return {};
    },
    setComments(state, action) {
      state.comments = [...state.comments, action.payload];
    },
    setCommentLikes(state, action) {
      let { commentId, userId } = action.payload;
      let comment = state.comments.find((comment) => comment._id == commentId);

      if (comment.likes.includes(userId)) {
        // if user already like then remove
        comment.likes = comment.likes.filter((like) => like !== userId);
      } else {
        //new user like

        comment.likes = [...comment.likes, userId];
      }
      return state;
    },
    setReplies(state, action) {
      let newReply = action.payload;
      function findParentComment(comments) {
        let parentComment;

        for (const comment of comments) {
          if (comment._id === newReply.parentComment) {
            parentComment = {
              ...comment,
              replies: [...comment.replies, newReply],
            };
            break;
          }
          if (comment.replies.length > 0) {
            parentComment = findParentComment(comment.replies);

            if (parentComment) {
              parentComment = {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id == parentComment._id ? parentComment : reply,
                ),
              };
              break;
            }
          }
        }

        return parentComment; //top level comment return ho raha hei
      }
      let parentComment = findParentComment(state.comments);
      state.comments = state.comments.map((comment) =>
        comment._id == parentComment._id ? parentComment : comment,
      );
    },
  },
});

export const {
  addSelectedBlog,
  removeSelectedBlog,
  setComments,
  setCommentLikes,
  setReplies,
} = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
