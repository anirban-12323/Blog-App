// import { useDispatch, useSelector } from "react-redux";
// import {
//   addComment,
//   closeComment,
//   editComment,
//   fetchComments,
//   likeComment,
//   deleteComment,
// } from "../utils/commentSlice";
// import { useEffect, useState } from "react";
// import { formDate } from "../utils/formDate";
// import axios from "axios";

// function Comment({ onCommentChange }) {
//   const isOpen = useSelector((state) => state.comments.isOpen);
//   const dispatch = useDispatch();

//   const [comment, setComment] = useState(""); //input value

//   const [reply, setReply] = useState("");

//   const { _id: blogId } = useSelector((state) => state.selectedBlog);
//   console.log("selectedBlog blogId-->", blogId);
//   const { token, id: userId } = useSelector((state) => state.user);
//   const { list: comments, loading } = useSelector((state) => state.comments);

//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [menuOpenId, setMenuOpenId] = useState(null);

//   const [activeReply, setActiveReply] = useState(null);

//   async function handleComment() {
//     if (!comment.trim()) return;

//     dispatch(addComment({ blogId, comment, token })).then(() => {
//       onCommentChange(); // refresh BlogPage count
//     });

//     setComment("");
//   }

//   async function handleReply(parentCommentId) {
//     try {
//       let res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/comment/${parentCommentId}/${blogId}`,
//         {
//           reply,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       console.log(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function handleSave(commentId) {
//     if (!editText.trim()) {
//       return;
//     }
//     dispatch(editComment({ commentId, text: editText, token }));
//     (setEditingId(null), setEditText(""));
//   }

//   function handleActiveReply(id) {
//     setActiveReply((prev) => (prev === id ? null : id));
//   }

//   useEffect(() => {
//     if (!isOpen || !blogId) {
//       return;
//     } else if (isOpen && blogId) {
//       dispatch(fetchComments(blogId));
//     }
//   }, [isOpen, blogId]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed top-0 right-0 h-screen w-[360px] bg-white border-l shadow-xl flex flex-col">
//       {/* HEADER */}
//       <div className="flex items-center justify-between px-4 py-3 border-b">
//         <h2 className="text-lg font-semibold">
//           Comments <span className="text-gray-400">({comments.length})</span>
//         </h2>
//         <button
//           onClick={() => dispatch(closeComment())}
//           className="text-gray-500 hover:text-black text-xl"
//         >
//           ✕
//         </button>
//       </div>

//       {/* ADD COMMENT */}
//       <div className="p-4 border-b">
//         <textarea
//           placeholder="Write a comment…"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="w-full resize-none rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//           rows={2}
//         />
//         <div className="flex justify-end mt-2">
//           <button
//             onClick={handleComment}
//             disabled={loading}
//             className="px-4 py-1.5 rounded-full bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
//           >
//             Post
//           </button>
//         </div>
//       </div>

//       {/* COMMENTS LIST */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {comments.length === 0 && (
//           <p className="text-sm text-gray-500 text-center">No comments yet</p>
//         )}

//         {comments.map((c) => (
//           <div key={c._id} className="flex gap-3">
//             {/* AVATAR */}
//             {c.user.avatar ? (
//               <img
//                 src={c.user.avatar}
//                 alt={c.user.name}
//                 className="w-9 h-9 rounded-full object-cover"
//               />
//             ) : c.user.name ? (
//               <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
//                 {c.user.name?.charAt(0)?.toUpperCase() || "U"}
//               </div>
//             ) : null}

//             {/* CONTENT */}
//             <div className="flex-1">
//               <div className="flex gap-3">
//                 <div className="bg-gray-50 rounded-xl px-3 py-2">
//                   <div className="flex items-start justify-between gap-35">
//                     {/* Left: creator + date */}
//                     <div className="flex flex-col">
//                       <p className="text-sm font-semibold">{c.user.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {formDate(c.createdAt)}
//                       </p>
//                     </div>

//                     {/* Right: menu */}
//                     <i className="fi fi-br-menu-dots"></i>
//                   </div>

//                   {editingId === c._id ? (
//                     <input
//                       value={editText}
//                       onChange={(e) => setEditText(e.target.value)}
//                       className="mt-1 w-full border rounded-md px-2 py-1 text-sm focus:outline-none"
//                     />
//                   ) : (
//                     <p className="text-sm text-gray-800 mt-1">{c.comment}</p>
//                   )}
//                 </div>
//                 {c.user._id === userId && (
//                   <div className="relative">
//                     <button
//                       onClick={() =>
//                         setMenuOpenId(menuOpenId === c._id ? null : c._id)
//                       }
//                       className="text-gray-500 hover:text-black px-2"
//                     >
//                       ...
//                     </button>

//                     {menuOpenId === c._id && (
//                       <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10">
//                         <button
//                           onClick={() => {
//                             setEditingId(c._id);
//                             setEditText(c.comment);
//                             setMenuOpenId(null);
//                           }}
//                           className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => {
//                             setMenuOpenId(null);
//                             if (!confirm("Delete this comment?")) {
//                               return;
//                             }

//                             dispatch(
//                               deleteComment({ commentId: c._id, token }),
//                             );
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* ACTIONS */}
//               <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
//                 <div className="flex justify-between gap-16 ">
//                   <div className="flex justify-between gap-6">
//                     <div>
//                       <button
//                         onClick={() =>
//                           dispatch(likeComment({ commentId: c._id, token }))
//                         }
//                         className="hover:text-black"
//                       >
//                         ❤️ {c.likes.length}
//                       </button>
//                     </div>
//                     <div className="flex justify-between gap-2">
//                       {" "}
//                       <i class="fi fi-sr-comment-alt"></i>
//                       <p className=" text-s">6</p>
//                     </div>
//                   </div>
//                   <div
//                     onClick={() => handleActiveReply(c._id)}
//                     className=" hover:underline"
//                   >
//                     reply
//                   </div>
//                 </div>
//               </div>

//               {activeReply === c._id && (
//                 <div className="p-4 border-b">
//                   <textarea
//                     placeholder="Write a reply…"
//                     value={reply}
//                     onChange={(e) => setReply(e.target.value)}
//                     className="w-full resize-none rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//                     rows={2}
//                   />
//                   <div className="flex justify-end mt-2">
//                     <button
//                       onClick={() => handleReply(c._id)}
//                       disabled={loading}
//                       className="px-4 py-1.5 rounded-full bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
//                     >
//                       Post
//                     </button>
//                   </div>
//                 </div>
//               )}
//               {c.replies?.length > 0 && (
//                 <div className="ml-10 mt-3 space-y-2">
//                   {c.replies.map((replyItem) => (
//                     <div key={replyItem._id} className="flex gap-2">
//                       {/* AVATAR */}

//                       {replyItem.user?.avatar ? (
//                         <img
//                           src={replyItem.user.avatar}
//                           alt={replyItem.user.name}
//                           className="w-7 h-7 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
//                           {replyItem.user?.name?.charAt(0)?.toUpperCase() ||
//                             "U"}
//                         </div>
//                       )}
//                       {/* Reply Content */}

//                       <div className="bg-gray-100 rounded-xl px-3 py-2">
//                         <p className="text-xs font-semibold">
//                           {replyItem.user?.name}
//                         </p>

//                         <p className="text-xs text-gray-700 mt-1">
//                           {replyItem.comment}
//                         </p>

//                         <p className="text-[10px] text-gray-400 mt-1">
//                           {formDate(replyItem.createdAt)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Comment;

// import { useDispatch, useSelector } from "react-redux";
// import { addComment, closeComment, fetchComments } from "../utils/commentSlice";

// import { useState } from "react";
// import axios from "axios";

// import { formDate } from "../utils/formDate";
// import toast from "react-hot-toast";

// function Comment() {
//   const dispatch = useDispatch();
//   const [comment, setComment] = useState("");
//   const [activeReply, setActiveReply] = useState(null);

//   const { list: comments } = useSelector((state) => state.comments);
//   const { _id: blogId } = useSelector((state) => state.selectedBlog);

//   const { token, id: userId } = useSelector((state) => state.user);

//   async function handleComment() {
//     try {
//       if (!comment.trim()) return;

//       await dispatch(addComment({ blogId, comment, token }));

//       setComment("");
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || "Something went wrong");
//     }
//   }

//   return (
//     <div className="bg-white h-screen p-5 fixed top-0 right-0 w-[400px] border-l drop-shadow-xl overflow-y-scroll">
//       {/* HEADER */}
//       <div className="flex justify-between">
//         <h1 className="text-xl font-medium">
//           Comments ({comments?.length || 0})
//         </h1>
//         <i
//           onClick={() => dispatch(closeComment())}
//           className="fi fi-br-cross text-lg mt-1 cursor-pointer"
//         ></i>
//       </div>

//       {/* ADD COMMENT */}

//       <div className="my-4">
//         <textarea
//           value={comment}
//           placeholder="Comment..."
//           className="h-[120px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
//           onChange={(e) => setComment(e.target.value)}
//         />

//         <button
//           onClick={handleComment}
//           className="bg-green-500 px-7 py-3 my-2 text-white"
//         >
//           Post
//         </button>
//       </div>

//       {/* COMMENTS DISPLAY */}

//       <DisplayComments
//         comments={comments}
//         blogId={blogId}
//         token={token}
//         userId={userId}
//         activeReply={activeReply}
//         setActiveReply={setActiveReply}
//       />
//     </div>
//   );
// }
// function DisplayComments({
//   comments,
//   blogId,
//   token,
//   userId,
//   activeReply,
//   setActiveReply,
//   level = 0,
// }) {
//   if (!comments || comments.length === 0) {
//     return null;
//   }

//   return (
//     <div className={`${level > 0 ? "ml-8 mt-2" : ""}`}>
//       {comments?.map((c) => (
//         <div key={c._id} className="mb-4">
//           {/* COMMENT CARD */}

//           <div className="bg-gray-100 p-3 rounded-lg">
//             <p className="font-semibold">{c.user?.name}</p>
//             <p className="text-xs text-gray-500">{formDate(c.createdAt)}</p>
//             <p className="mt-2">{c.comment}</p>
//           </div>

//           {/* ACTIONS */}

//           <div>
//             <button
//               onClick={() => setActiveReply(c._id)}
//               className="text-blue-500"
//             >
//               Reply
//             </button>
//           </div>

//           {/* REPLY BOX */}
//           {activeReply === c._id && (
//             <ReplyBox
//               parentCommentId={c._id}
//               blogId={blogId}
//               token={token}
//               setActiveReply={setActiveReply}
//             />
//           )}

//           {/* RECURSIVE REPLIES */}

//           {c.replies?.length > 0 && (
//             <DisplayComments
//               comments={c.replies}
//               blogId={blogId}
//               token={token}
//               userId={userId}
//               activeReply={activeReply}
//               setActiveReply={setActiveReply}
//               level={level + 1}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// function ReplyBox({ parentCommentId, blogId, token, setActiveReply }) {
//   const dispatch = useDispatch();

//   const [reply, setReply] = useState("");

//   async function handleReply() {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/comment/${parentCommentId}/${blogId}`,
//         { reply },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       setReply("");
//       setActiveReply(null);

//       dispatch(fetchComments(blogId)); // ✅ correct way
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <div>
//       <textarea
//         value={reply}
//         onChange={(e) => setReply(e.target.value)}
//         className="border p-2 w-full"
//       />
//       <button
//         onClick={handleReply}
//         className="bg-green-500 px-4 py-1 mt-1 text-white"
//       >
//         Post
//       </button>
//     </div>
//   );
// }
// export default Comment;

import React, { useState } from "react";
import { addComment, setIsOpen } from "../utils/commentSlice";
import { setComments, setCommentLikes } from "../utils/selectedBlogSlice";
import { formatDate } from "../utils/formDate";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
function Comment() {
  const [comment, setComment] = useState("");
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
          {comments.map((c) => (
            <>
              <hr />
              <div className="flex flex-col gap-2 my-4">
                <div className="flex w-full justify-between ">
                  <div className="flex justify-between gap-2">
                    <div className="w-8 h-8">
                      <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${c.user.name}`}
                        alt=""
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <p className=" capitalize font-medium ">{c.user.name}</p>
                      <p>{formatDate(c.createdAt)}</p>
                    </div>
                  </div>
                  <i class="fi fi-bs-menu-dots"></i>
                </div>

                <p className="font-medium text-lg">{c.comment}</p>

                <div className=" flex justify-between">
                  <div className="flex gap-3">
                    <div className=" cursor-pointer flex gap-2">
                      {c.likes.includes(userId) ? (
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
                      <p className="text-lg">{c.likes.length}</p>
                    </div>

                    <div className="flex gap-2">
                      <i className="fi fi-sr-comment-alt text-lg mt-1" />
                      <p>5</p>
                    </div>
                  </div>

                  <p>reply</p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comment;
