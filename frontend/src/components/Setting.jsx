import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

function Setting() {
  const { token, showLikedBlogs, showSavedBlogs } = useSelector(
    (state) => state.user,
  );
  const [data, setData] = useState({
    showSavedBlogs,
    showLikedBlogs,
  });

  async function handleVisibility() {
    try {
      console.log("running");
      let res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/settings/blog-visibility`,
        data,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
    } catch (error) {}
  }
  return (
    <div className="w-full p-5 md:w-[800px] flex flex-col items-center h-[calc(100vh_-_250px)] mx-auto justify-center">
      <div className="w-full">
        <h2 className="my-10 text-2xl font-semibold text-left">Settings</h2>
      </div>

      <div className="mb-4 w-full">
        <h2 className="block text-sm font-medium mb-1">Show Saved Blogs?</h2>
        <select
          name=""
          id=""
          className="w-full p-3 rounded-lg border text-lg focus:outline-none"
          value={data.showSavedBlogs}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              showSavedBlogs: e.target.value == "true" ? true : false,
            }))
          }
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <div className="mb-4 w-full">
        <h2 className="block text-sm font-medium mb-1">Show Liked Blogs?</h2>
        <select
          name=""
          id=""
          className="w-full p-3 rounded-lg border text-lg focus:outline-none"
          value={data.showLikedBlogs}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              showLikedBlogs: e.target.value == "true" ? true : false,
            }))
          }
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <button
        onClick={handleVisibility}
        className="w-[20%] mx-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Update
      </button>
    </div>
  );
}

export default Setting;
