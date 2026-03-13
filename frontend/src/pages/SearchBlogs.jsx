import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DisplayBlogs from "../components/DisplayBlogs";

const SearchBlogs = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    if (q) {
      async function fetchSearchBlogs() {
        try {
          let res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/search-blog?search=${q}`,
          );

          setBlogs(res.data.blogs);
        } catch (error) {
          console.log(error);
        }
      }
      fetchSearchBlogs();
    }
  }, [q]);

  return (
    <div className="w-[60%] mx-auto">
      <h1 className=" my-10 text-4xl text-gray-500 font-bold">
        Results for <span className="text-black">{q}</span>
      </h1>
      <DisplayBlogs blogs={blogs} />
    </div>
  );
};

export default SearchBlogs;
