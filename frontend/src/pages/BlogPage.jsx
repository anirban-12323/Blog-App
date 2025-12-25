import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function BlogPage() {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  async function fetchBlogById() {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`
      );
      setBlogData(res.data.blog);
    } catch (error) {
      toast.error(error);
    }
  }
  useEffect(() => {
    fetchBlogById();
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
        </div>
      ) : (
        <h1>loading....</h1>
      )}
    </div>
  );
}

export default BlogPage;
