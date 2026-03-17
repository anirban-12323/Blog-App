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

  const { blogs, hasMore } = usePagination("blogs", {}, 1, page);

  return (
    <div className="w-full mx-auto lg:w-[70%] flex p-5 ">
      <div className="w-full md:w-[60%]  md:pr-10">
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
      <div className="hidden md:block w-[30%] border-l pl-10 min-h-[calc(100vh_-_70px)]">
        <h1>Recomended Topics</h1>
        <div className="flex flex-wrap">
          {["react", "mern", "express", "nodejs", "thor"].map((tag, index) => (
            <Link to={`/tag/${tag}`}>
              <div
                key={index}
                className=" m-2 bg-gray-300 text-black  hover:text-white hover:bg-blue-400 rounded-full flex justify-center items-center px-3 py-2 gap-2"
              >
                <p>{tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
