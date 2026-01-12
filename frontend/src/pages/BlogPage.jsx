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

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const user = JSON.parse(localStorage.getItem("user"));

  const { token, user, id: userId } = useSelector((slice) => slice.user);

  const [blogData, setBlogData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const Location = useLocation();
  async function fetchBlogById() {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`
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
          "Something went wrong"
      );
    }
  }
  useEffect(() => {
    fetchBlogById();
    return () => {
      // console.log(window.location.pathname); // that give current location
      // console.log(Location.pathname); // that give previous location
      if (window.location.pathname !== `/edit/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
  }, [id]);
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
        }
      );

      toast.success(res.data.message);
      await fetchBlogById();
    } else {
      return toast.error("Please signin for like this blog");
    }
  }
  return (
    <div className="max-w-[1000px]">
      {blogData ? (
        <div>
          <h1 className="mt-10 front-bold text-4xl">{blogData.title}</h1>
          <h2 className="my-5 text-3xl">{blogData.creator.name}</h2>
          {/* <img
            src={blogData.image}
            alt=""
            className="w-full h-120 object-cover rounded-xl"
          /> */}
          <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl bg-gray-200">
            <img
              src={blogData.image}
              alt="blog"
              className="w-full h-full object-cover"
            />
          </div>

          {token && user.email === blogData.creator.email && (
            <Link to={"/edit/" + blogData.blogId}>
              <button className="bg-green-400 mt-5 px-6 py-2 text-2xl rounded">
                Edit
              </button>
            </Link>
          )}
          <div className="flex gap-4 mt-4">
            <div className="cursor-pointer flex gap-2" onClick={handleOnClick}>
              {isLike ? (
                <i className="fi fi-sr-thumbs-up text-blue-600 text-2xl mt-1"></i>
              ) : (
                <i className="fi fi-rr-social-network text-2xl mt-1"></i>
              )}
              <p className="text-3xl">{blogData.likes.length}</p>
            </div>
            <div className=" flex gap-2">
              <i className="fi fi-sr-comment-alt text-2xl mt-1"></i>
              {/* <p className="text-3xl">{blogData.likes.length}</p> */}
            </div>
          </div>
        </div>
      ) : (
        <h1>loading.....</h1>
      )}
    </div>
  );
}

export default BlogPage;
