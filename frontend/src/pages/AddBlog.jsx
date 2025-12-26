import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const AddBlog = () => {
  const { id } = useParams();

  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });

  // useEffect(() => {
  //   if (!token) {
  //     return navigate("/signin");
  //   }
  // }, []);
  async function handlePostBlog() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs`,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handelUpdateBlog() {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,

        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchBlogById() {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`
      );
      setBlogData({
        title: res.data.blog.title,
        description: res.data.blog.description,
        image: res.data.blog.image,
      });
      console.log(res);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);
  return (
    <div>
      <label htmlFor="">Title</label>
      <input
        type="text "
        placeholder="title"
        onChange={(e) =>
          setBlogData((blogData) => ({ ...blogData, title: e.target.value }))
        }
        value={blogData.title}
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
        value={blogData.description}
      />
      <br />
      <br />
      <div>
        {" "}
        <label htmlFor="image">
          {blogData.image ? (
            <img
              src={
                typeof blogData.image == "string"
                  ? blogData.image
                  : URL.createObjectURL(blogData.image)
              }
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
      <button
        onClick={id ? handelUpdateBlog : handlePostBlog}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
      >
        {id ? "Update Blog" : "Post Blog"}
      </button>
    </div>
  );
};

export default AddBlog;
