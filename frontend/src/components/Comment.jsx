import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  clearComments,
  closeComment,
  fetchComments,
  likeComment,
} from "../utils/commentSlice";
import { useEffect, useState } from "react";
import axios from "axios";

function Comment() {
  const isOpen = useSelector((state) => state.comments.isOpen);
  const dispatch = useDispatch();

  const [comment, setComment] = useState(""); //input value

  const { _id: blogId } = useSelector((state) => state.selectedBlog);
  const { token } = useSelector((state) => state.user);
  const { list: comments, loading } = useSelector((state) => state.comments);

  async function handleComment() {
    if (!comment.trim()) return;

    dispatch(addComment({ blogId, comment, token }));
    setComment("");
  }

  useEffect(() => {
    if (!isOpen || !blogId) {
      return;
    } else if (isOpen && blogId) {
      dispatch(fetchComments(blogId));
    }
  }, [isOpen, blogId]);

  // useEffect(() => {
  //   return () => {
  //     if (blogId) {
  //       dispatch(clearComments());
  //     }
  //   };
  // }, [blogId]);

  if (!isOpen) return null;
  return (
    <div className="bg-white h-screen p-5 fixed top-0 right-0 w-[300px] border-l drop-shadow-xl">
      <div className="flex  justify-between">
        <h1 className="text-xl front-medium">Comments({comments.length})</h1>
        <i
          onClick={() => dispatch(closeComment())}
          className="fi fi-rr-cross-small text-2xl"
        ></i>
      </div>
      {/* input */}
      <div className="my-2">
        <input
          type="text"
          placeholder="Comments...."
          className=" w-full p-3 text-lg  shadow-md  focus:outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="bg-green-400  px-5 py-2"
          disabled={loading}
          onClick={handleComment}
        >
          Add
        </button>
      </div>
      {/* comment list */}
      <div className="mt-4 space-y-4 overflow-y-auto max-h-[60vh] pr-2">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}

        {comments.map((c) => (
          <div key={c._id} className="bg-gray-50 p-3 rounded-md border">
            <div className="flex items-center gap-1">
              {c.user.avatar ? (
                <img
                  src={c.user.avatar}
                  alt={c.user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : c.user.name ? (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  {c.user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              ) : null}

              <p className="text-sm font-semibold text-gray-800">
                {c.user.name}
              </p>
            </div>
            <div className="flex gap-2">
              {" "}
              <button
                onClick={() =>
                  dispatch(likeComment({ commentId: c._id, token }))
                }
              >
                ❤️ {c.likes.length}
              </button>
              <p className="text-gray-700 text-sm mt-1">{c.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;
