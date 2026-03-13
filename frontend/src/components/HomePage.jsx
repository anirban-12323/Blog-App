import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formDate";
import { useSelector } from "react-redux";
import { handleSaveBlogs } from "../pages/BlogPage";
import DisplayBlogs from "./DisplayBlogs";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const { comments } = useSelector((state) => state.selectedBlog);
  const { token } = useSelector((state) => state.user);
  const { id: userId } = useSelector((state) => state.user.user) || {};

  async function fetchBlogs() {
    let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`);
    console.log(res.data.blogs);
    setBlogs(res.data.blogs);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <div className="w-[60%] mx-auto">
      <DisplayBlogs blogs={blogs} />
    </div>
  );
}

export default HomePage;
