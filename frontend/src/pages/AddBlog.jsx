import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });
  useEffect(() => {
    if (!token) {
      return navigate("/signin");
    }
  }, []);
  async function handlePostBlog() {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/blogs",
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div>
      <label htmlFor="">Title</label>
      <input
        type="text "
        placeholder="title"
        onChange={(e) =>
          setBlogData((blogData) => ({ ...blogData, title: e.target.value }))
        }
      />
      <br />
      <br />
      <label htmlFor="">Description</label>
      <input
        type="text "
        placeholder="description"
        onChange={(e) =>
          setBlogData((blogData) => ({
            ...blogData,
            description: e.target.value,
          }))
        }
      />
      <br />
      <br />
      <div>
        {" "}
        <label htmlFor="image">
          {blogData.image ? (
            <img
              src={URL.createObjectURL(blogData.image)}
              alt=""
              className="aspect-video object-cover"
            />
          ) : (
            <div className=" bg-slate-500 aspect-video flex justify-center items-center text-4xl">
              Select Image
            </div>
          )}
        </label>
        <input
          className="hidden"
          id="image"
          type="file"
          onChange={(e) =>
            setBlogData((blogData) => ({
              ...blogData,
              image: e.target.files[0],
            }))
          }
        />
      </div>

      <br />
      <button onClick={handlePostBlog}>Post Blog</button>
    </div>
  );
};

export default AddBlog;
