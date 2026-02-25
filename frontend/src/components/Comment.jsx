import React, { useState } from "react";
import { addComment, setIsOpen } from "../utils/commentSlice";
import {
  setComments,
  setCommentLikes,
  setReplies,
} from "../utils/selectedBlogSlice";
import { formatDate } from "../utils/formDate";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
function Comment() {
  const [comment, setComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  const dispatch = useDispatch();
  const { _id: blogId, comments } = useSelector((state) => state.selectedBlog);
  const { token } = useSelector((state) => state.user);
  const { id: userId } = useSelector((state) => state.user.user);

  async function handleComment() {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${blogId}/comment`,
        {
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setComment("");
      dispatch(setComments(res.data.newComment));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-white h-screen fixed top-0 right-0 p-5 w-[350px] border-0 drop-shadow-xl overflow-y-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Comment ({comments.length})</h1>
        <i
          className="fi fi-br-cross text-lg mt-1  "
          onClick={() => dispatch(setIsOpen(false))}
        ></i>
      </div>

      {/* //Comment Box- */}

      <div className="my-4 ">
        <textarea
          type="text"
          value={comment}
          placeholder="Comment..."
          className="h-[150px] resize-none bg-white border-0 drop-shadow w-full p-3 text-lg focus:outline-none"
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="bg-green-300 p-3 my-1" onClick={handleComment}>
          Add
        </button>
        <div className="mt-4">
          <DisplayComments
            comments={comments}
            userId={userId}
            blogId={blogId}
            token={token}
            activeReply={activeReply}
            setActiveReply={setActiveReply}
            dispatch={dispatch}
          />
        </div>
      </div>
    </div>
  );
}
function DisplayComments({
  comments,
  userId,
  blogId,
  token,
  activeReply,
  setActiveReply,
  dispatch,
}) {
  const [reply, setReply] = useState("");
  async function handleReply(parentCommentId) {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${parentCommentId}/${blogId}`,
        {
          reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setReply(" ");
      setActiveReply(null);
      dispatch(setReplies(res.data.newReply));
    } catch (error) {
      console.log(error);
    }
  }
  //HANDLE COMMENTLIKE
  async function handleCommentLike(commentId) {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
      dispatch(setCommentLikes({ commentId, userId }));
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleActiveReply(id) {
    setActiveReply((prev) => (prev === id ? null : id));
  }

  return (
    <>
      {comments?.map((c) => (
        <>
          <hr className="border-t border-gray-300 dark:border-gray-700 my-4" />
          <div className="flex flex-col gap-2 my-4 ">
            <div className="flex w-full justify-between ">
              <div className="flex justify-between gap-2">
                <div className="w-8 h-8">
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${c?.user?.name}`}
                    alt=""
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className=" capitalize font-medium ">{c.user?.name}</p>
                  <p>{formatDate(c?.createdAt)}</p>
                </div>
              </div>
              <i class="fi fi-bs-menu-dots"></i>
            </div>

            <p className="font-medium text-lg">{c?.comment}</p>

            <div className=" flex justify-between">
              <div className="flex gap-3">
                <div className=" cursor-pointer flex gap-2">
                  {c?.likes?.includes(userId) ? (
                    <i
                      onClick={() => handleCommentLike(c._id)}
                      className="fi fi-sr-thumbs-up text-blue-600 text-lg mt-1"
                    ></i>
                  ) : (
                    <i
                      onClick={() => handleCommentLike(c._id)}
                      className="fi fi-sr-thumbs-up  text-lg mt-1"
                    ></i>
                  )}
                  <p className="text-lg">{c?.likes?.length}</p>
                </div>

                <div className="flex gap-2">
                  <i className="fi fi-sr-comment-alt text-lg mt-1 cursor-pointer" />
                  <p>{c?.replies?.length}</p>
                </div>
              </div>

              <p
                className="cursor-pointer hover:underline"
                onClick={() => handleActiveReply(c._id)}
              >
                reply
              </p>
            </div>
            {activeReply === c._id && (
              <div className="my-4 ">
                <textarea
                  type="text"
                  value={reply}
                  placeholder="Reply..."
                  className="h-[150px] resize-none bg-gray-200 border-0 drop-shadow w-full p-3 text-lg focus:outline-none "
                  onChange={(e) => setReply(e.target.value)}
                />

                <button
                  className="bg-green-300 p-3 my-1"
                  onClick={() => handleReply(c._id)}
                >
                  Add
                </button>
              </div>
            )}

            {/* to show replies */}

            {c?.replies?.length > 0 && (
              <div className="pl-7 border-l">
                <DisplayComments
                  comments={c?.replies}
                  userId={userId}
                  blogId={blogId}
                  token={token}
                  activeReply={activeReply}
                  setActiveReply={setActiveReply}
                  dispatch={dispatch}
                />
              </div>
            )}
          </div>
        </>
      ))}
    </>
  );
}

export default Comment;
