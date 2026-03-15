import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formDate";
import { useSelector } from "react-redux";
import { handleSaveBlogs } from "../pages/BlogPage";
import DisplayBlogs from "./DisplayBlogs";
import usePagination from "../hooks/usePagination";

function HomePage() {
  const [page, setPage] = useState(1);
  const { comments } = useSelector((state) => state.selectedBlog);
  const { token } = useSelector((state) => state.user);
  const { id: userId } = useSelector((state) => state.user.user) || {};

  // async function fetchBlogs() {
  //   const params = { page, limit: 1 };
  //   let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`, {
  //     params,
  //   });

  //   setBlogs((prev) => [...prev, ...res.data.blogs]);
  //   setHasMore(res.data.hasMore);
  // }

  const { blogs, hasMore } = usePagination("blogs", {}, 1, page);

  // useEffect(() => {
  //   fetchBlogs();
  // }, [page]);
  return (
    <div className="w-[60%] mx-auto">
      <DisplayBlogs blogs={blogs} />

      {hasMore && (
        <button
          className="bg-blue-500 text-white py-3 px-3 rounded-3xl"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default HomePage;
