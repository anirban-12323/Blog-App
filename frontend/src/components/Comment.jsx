import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  clearComments,
  closeComment,
  editComment,
  fetchComments,
  likeComment,
  deleteComment,
} from "../utils/commentSlice";
import { useEffect, useState } from "react";
import { formDate } from "../utils/formDate";
import axios from "axios";

function Comment({ onCommentChange }) {
  const isOpen = useSelector((state) => state.comments.isOpen);
  const dispatch = useDispatch();

  const [comment, setComment] = useState(""); //input value

  const { _id: blogId } = useSelector((state) => state.selectedBlog);
  const { token, id: userId } = useSelector((state) => state.user);
  const { list: comments, loading } = useSelector((state) => state.comments);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  async function handleComment() {
    if (!comment.trim()) return;

    dispatch(addComment({ blogId, comment, token })).then(() => {
      onCommentChange(); // refresh BlogPage count
    });

    setComment("");
  }

  async function handleSave(commentId) {
    if (!editText.trim()) {
      return;
    }
    dispatch(editComment({ commentId, text: editText, token }));
    (setEditingId(null), setEditText(""));
  }

  useEffect(() => {
    if (!isOpen || !blogId) {
      return;
    } else if (isOpen && blogId) {
      dispatch(fetchComments(blogId));
    }
  }, [isOpen, blogId]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-screen w-[360px] bg-white border-l shadow-xl flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">
          Comments <span className="text-gray-400">({comments.length})</span>
        </h2>
        <button
          onClick={() => dispatch(closeComment())}
          className="text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* ADD COMMENT */}
      <div className="p-4 border-b">
        <textarea
          placeholder="Write a comment…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full resize-none rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          rows={2}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleComment}
            disabled={loading}
            className="px-4 py-1.5 rounded-full bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500 text-center">No comments yet</p>
        )}

        {comments.map((c) => (
          <div key={c._id} className="flex gap-3">
            {/* AVATAR */}
            {c.user.avatar ? (
              <img
                src={c.user.avatar}
                alt={c.user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : c.user.name ? (
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                {c.user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            ) : null}

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex gap-3">
                <div className="bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex items-start justify-between gap-35">
                    {/* Left: creator + date */}
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{c.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {formDate(c.createdAt)}
                      </p>
                    </div>

                    {/* Right: menu */}
                    <i className="fi fi-br-menu-dots"></i>
                  </div>

                  {editingId === c._id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="mt-1 w-full border rounded-md px-2 py-1 text-sm focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-800 mt-1">{c.comment}</p>
                  )}
                </div>
                {c.user._id === userId && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpenId(menuOpenId === c._id ? null : c._id)
                      }
                      className="text-gray-500 hover:text-black px-2"
                    >
                      ...
                    </button>

                    {menuOpenId === c._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            setEditingId(c._id);
                            setEditText(c.comment);
                            setMenuOpenId(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpenId(null);
                            if (!confirm("Delete this comment?")) {
                              return;
                            }

                            dispatch(
                              deleteComment({ commentId: c._id, token }),
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <button
                  onClick={() =>
                    dispatch(likeComment({ commentId: c._id, token }))
                  }
                  className="hover:text-black"
                >
                  ❤️ {c.likes.length}
                </button>

                {c.user._id === userId && editingId !== c._id && (
                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setEditText(c.comment);
                    }}
                    className="hover:text-black"
                  >
                    Edit
                  </button>
                )}

                {editingId === c._id && (
                  <>
                    <button
                      onClick={() => handleSave(c._id)}
                      className="text-black font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditText("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;
