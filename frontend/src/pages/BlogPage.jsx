import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  addSelectedBlog,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const user = JSON.parse(localStorage.getItem("user"));

  const { token, user } = useSelector((slice) => slice.user);

  const [blogData, setBlogData] = useState(null);
  async function fetchBlogById() {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`
      );
      setBlogData(res.data.blog);
      dispatch(addSelectedBlog(res.data.blog));
    } catch (error) {
      toast.error(error);
    }
  }
  useEffect(() => {
    fetchBlogById();
    return () => {
      dispatch(removeSelectedBlog());
    };
  }, [id]);
  return (
    <div className="max-w-[1000px]">
      {blogData ? (
        <div>
          <h1 className="mt-10 front-bold text-4xl">{blogData.title}</h1>
          <h2 className="my-5 text-3xl">{blogData.creator.name}</h2>
          <img
            src={blogData.image}
            alt=""
            className="w-full h-[400px] object-cover rounded-lg"
          />
          {token && user.email === blogData.creator.email && (
            <button className="bg-green-400 mt-5 px-6 py-2 text-2xl rounded">
              <Link to={"/edit/" + blogData.blogId}> Edit</Link>
            </button>
          )}
        </div>
      ) : (
        <h1>loading....</h1>
      )}
    </div>
  );
}

export default BlogPage;
