import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DisplayBlogs from "../components/DisplayBlogs";
import usePagination from "../hooks/usePagination";

const SearchBlogs = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const [page, setPage] = useState(1);
  // useEffect(() => {
  //   if (q) {
  //     async function fetchSearchBlogs() {
  //       try {
  //         let res = await axios.get(
  //           `${import.meta.env.VITE_BACKEND_URL}/search-blog`,
  //           {
  //             params: { search: q, limit: 1, page },
  //           },
  //         );

  //         setBlogs((prev) => [...prev, ...res.data.blogs]);
  //         setHasMore(res.data.hasMore);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     fetchSearchBlogs();
  //   }
  // }, [q, page]);

  const { blogs, hasMore } = usePagination(
    "search-blog",
    { search: q },
    1,
    page,
  );
  //because pagination state belongs to the previous search.

  //When the search query changes, the pagination must restart from page 1.
  useEffect(() => {
    setPage(1);
  }, [q]);
  return (
    <div className="w-[60%] mx-auto">
      <h1 className=" my-10 text-4xl text-gray-500 font-bold">
        Results for <span className="text-black">{q}</span>
      </h1>
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
};

export default SearchBlogs;
