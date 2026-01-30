import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

const AddBlog = () => {
  const { id } = useParams();
  const token = useSelector((slice) => slice.user.token);
  const { title, description, image } = useSelector(
    (slice) => slice.selectedBlog,
  );

  // const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    content: "",
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
        },
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
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
        },
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  }

  async function fetchBlogById() {
    // try {
    //   let res = await axios.get(
    //     `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`
    //   );
    //   setBlogData({
    //     title: res.data.blog.title,
    //     description: res.data.blog.description,
    //     image: res.data.blog.image,
    //   });
    //   console.log(res);
    // } catch (error) {
    //   toast.error(error.response.data.message);
    // }

    setBlogData({
      title: title,
      description: description,
      image: image,
    });
  }

  function initializeEditorjs() {
    const editorjs = new EditorJS({
      holder: "editorjs",
      placeholder: "write something...",
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
      },
      onChange: async () => {
        let data = await editorjs.save();
        // console.log(data);
        setBlogData((blogData) => ({
          ...blogData,
          content: data,
        }));
      },
    });
  }

  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);

  useEffect(() => {
    initializeEditorjs();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-start pt-10 bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {id ? "Update Blog" : "Create New Blog"}
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter blog title"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={blogData.title}
            onChange={(e) =>
              setBlogData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={4}
            placeholder="Write your blog description..."
            className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={blogData.description}
            onChange={(e) =>
              setBlogData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Cover Image</label>

          <label
            htmlFor="image"
            className="cursor-pointer block border-2 border-dashed rounded-lg overflow-hidden"
          >
            {blogData.image ? (
              <img
                src={
                  typeof blogData.image === "string"
                    ? blogData.image
                    : URL.createObjectURL(blogData.image)
                }
                alt="preview"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                Click to upload image
              </div>
            )}
          </label>

          <input
            id="image"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              setBlogData((prev) => ({
                ...prev,
                image: e.target.files[0],
              }))
            }
          />
        </div>

        <div id="editorjs"></div>

        {/* Submit Button */}
        <button
          onClick={id ? handelUpdateBlog : handlePostBlog}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {id ? "Update Blog" : "Post Blog"}
        </button>
      </div>
    </div>
  );
};

export default AddBlog;
