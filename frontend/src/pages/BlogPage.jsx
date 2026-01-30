import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  addSelectedBlog,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";
import toast from "react-hot-toast";
import Comment from "../components/Comment";
import { toggleComment } from "../utils/commentSlice";
import { fetchComments } from "../utils/commentSlice";

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const user = JSON.parse(localStorage.getItem("user"));

  const { token, user, id: userId } = useSelector((slice) => slice.user);

  const [blogData, setBlogData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const Location = useLocation();
  //const commentCount = useSelector((state) => state.comments.count);

  // const [commentCount, setCommentCount] = useState(0);

  async function fetchBlogById() {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
      );
      setBlogData(res.data.blog);
      if (res.data.blog.likes.includes(userId)) {
        setIsLike((prev) => !prev);
      }
      dispatch(addSelectedBlog(res.data.blog));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  }

  // useEffect(() => {
  //   if (!blogData?._id) {
  //     return;
  //   }
  //   // fetchCommentCount(blogData._id);
  // }, [blogData?._id]);
  useEffect(() => {
    fetchBlogById();

    return () => {
      if (window.location.pathname !== `/edit/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
  }, [id]);
  // //useEffect(() => {
  //   if (blogData?._id) {
  //     dispatch(fetchComments(blogData._id));
  //   }
  // }, [blogData?._id]);

  async function handleOnClick() {
    if (token) {
      setIsLike((prev) => !prev);
      //
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      await fetchBlogById();
    } else {
      return toast.error("Please signin for like this blog");
    }
  }
  return (
    <div className="max-w-[1000px] mx-auto ">
      {blogData ? (
        <div>
          {/* CONTENT WRAPPER (same width as image) */}
          <div className="max-w-md mx-auto text-left">
            {/* TITLE */}
            <h1 className="mt-10 font-bold text-4xl capitalize">
              {blogData.title}
            </h1>

            {/* AUTHOR */}
            <p className="mt-2 text-xl text-gray-600">
              {blogData.creator.name}
            </p>

            {/* IMAGE */}
            <img
              src={blogData.image}
              alt="blog"
              className="mt-6 w-full h-92 object-cover rounded-xl"
            />

            {/* ACTION BAR */}
            <div className="flex items-center justify-between mt-4">
              {token && user.email === blogData.creator.email && (
                <Link to={"/edit/" + blogData.blogId}>
                  <button className="bg-green-400 px-4 py-1 text-lg rounded">
                    Edit
                  </button>
                </Link>
              )}

              <div className="flex gap-6">
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleOnClick}
                >
                  {isLike ? (
                    <i className="fi fi-sr-thumbs-up text-blue-600 text-xl"></i>
                  ) : (
                    <i className="fi fi-rr-social-network text-xl"></i>
                  )}
                  <span>{blogData.likes.length}</span>
                </div>

                <div className="flex gap-2 items-center cursor-pointer">
                  <i
                    onClick={() => dispatch(toggleComment())}
                    className="fi fi-sr-comment-alt text-xl"
                  ></i>
                  <span>{blogData.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>loading.....</h1>
      )}
      <Comment onCommentChange={fetchBlogById} />
    </div>
  );
}

export default BlogPage;
