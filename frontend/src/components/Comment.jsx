import React, { useState } from "react";
import { addComment, setIsOpen } from "../utils/commentSlice";
import {
  setComments,
  setCommentLikes,
  setReplies,
  setUpdatedComments,
  deleteCommentAndReply,
} from "../utils/selectedBlogSlice";
import { formatDate } from "../utils/formDate";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
function Comment() {
  const [comment, setComment] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  const dispatch = useDispatch();
  const {
    _id: blogId,
    comments,
    creator: { _id: creatorId },
  } = useSelector((state) => state.selectedBlog);
  const { token } = useSelector((state) => state.user);
  const { id: userId } = useSelector((state) => state.user.user);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [currentEditComment, setCurrentEditComment] = useState(null);

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
      toast.success(res.data.message);
      setComment("");
      dispatch(setComments(res.data.newComment));
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  }

  return (
    <div className="bg-white h-screen fixed top-0 right-0 p-5 w-[350px] border-0 drop-shadow-xl overflow-y-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Comment ({comments?.length})</h1>
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
            currentPopup={currentPopup}
            setCurrentPopup={setCurrentPopup}
            currentEditComment={currentEditComment}
            setCurrentEditComment={setCurrentEditComment}
            toast={toast}
            creatorId={creatorId}
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
  currentPopup,
  setCurrentPopup,
  currentEditComment,
  setCurrentEditComment,
  toast,
  creatorId,
}) {
  const [reply, setReply] = useState("");

  const [updatedCommentContent, setUpdatedCommentContent] = useState("");
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
      toast.error(error?.response?.data?.message);
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
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  async function handleActiveReply(id) {
    setActiveReply((prev) => (prev === id ? null : id));
  }

  async function handleCommentUpdate(id) {
    try {
      let res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/edit-comment/${id}`,
        {
          updatedCommentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res?.data?.message);
      // console.log(res.data.updatedComment);
      dispatch(setUpdatedComments(res.data.updatedComment));

      setUpdatedCommentContent("");
      setCurrentEditComment(null);
      setCurrentPopup(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      setUpdatedCommentContent("");
      setCurrentEditComment(null);
      setCurrentPopup(null);
    }
  }

  async function handleCommentDelete(id) {
    try {
      let res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      dispatch(deleteCommentAndReply(id));
    } catch (error) {
      toast.success(error.response.data.message);
    } finally {
      setUpdatedCommentContent("");
      setCurrentEditComment(null);
    }
  }
  return (
    <>
      {comments?.map((c) => (
        <>
          <hr className="border-t border-gray-300 dark:border-gray-700 my-4" />
          <div className="flex flex-col gap-2 my-4 ">
            {currentEditComment === c?._id ? (
              <div className="my-4 ">
                <textarea
                  type="text"
                  defaultValue={c.comment}
                  placeholder="Reply..."
                  className="h-[150px] resize-none bg-white border-0 drop-shadow w-full p-3 text-lg focus:outline-none"
                  onChange={(e) => setUpdatedCommentContent(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    className="bg-green-600 p-3 my-1 text-white rounded-2xl"
                    onClick={() => handleCommentUpdate(c._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 p-3 my-1 text-white rounded-2xl"
                    onClick={() => setCurrentEditComment(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                      <p className=" capitalize font-medium ">
                        {c?.user?.name}
                      </p>
                      <p>{formatDate(c?.createdAt)}</p>
                    </div>
                  </div>

                  {c?.user?._id === userId || userId === creatorId ? (
                    currentPopup == c?._id ? (
                      <div className="bg-gray-300  w-[70px] rounded-lg">
                        <i
                          className="fi fi-br-cross text-sm relative left-12 mt-1  "
                          onClick={() =>
                            setCurrentPopup((prev) =>
                              prev == c?._id ? null : c._id,
                            )
                          }
                        ></i>

                        {c?.user?._id === userId ? (
                          <p
                            className="p-2 py-1 hover:bg-blue-300 rounded-lg"
                            onClick={() => setCurrentEditComment(c._id)}
                          >
                            Edit
                          </p>
                        ) : (
                          ""
                        )}

                        <p
                          className="p-2 py-1 hover:bg-blue-300 rounded-lg"
                          onClick={() => handleCommentDelete(c?._id)}
                        >
                          Delete
                        </p>
                      </div>
                    ) : (
                      <i
                        class="fi fi-bs-menu-dots"
                        onClick={() => setCurrentPopup(c._id)}
                      ></i>
                    )
                  ) : (
                    ""
                  )}
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
              </>
            )}

            {activeReply === c?._id && (
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
                  onClick={() => handleReply(c?._id)}
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
                  currentPopup={currentPopup}
                  setCurrentPopup={setCurrentPopup}
                  currentEditComment={currentEditComment}
                  setCurrentEditComment={setCurrentEditComment}
                  toast={toast}
                  creatorId={creatorId}
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
