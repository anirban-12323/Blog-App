import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DisplayBlogs from "../components/DisplayBlogs";
import usePagination from "../hooks/usePagination";

const SearchBlogs = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const { tag } = useParams();

  const [page, setPage] = useState(1);
  const query = tag
    ? { tag: tag.toLowerCase().replace(" ", "-") }
    : { search: q };

  const { blogs, hasMore } = usePagination("search-blog", query, 1, page);
  //because pagination state belongs to the previous search.

  //When the search query changes, the pagination must restart from page 1.
  useEffect(() => {
    setPage(1);
  }, [q]);
  return (
    <div className="w-full p-5 sm:w-[80%] md:w-[60%] lg:w-[55%] mx-auto">
      <h1 className=" my-10 text-4xl text-gray-500 font-bold">
        Results for <span className="text-black">{tag ? tag : q}</span>
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
