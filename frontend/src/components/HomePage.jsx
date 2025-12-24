import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  async function fetchBlogs() {
    let res = await axios.get("http://localhost:3000/api/v1/blogs");
    console.log(res.data.blogs);
    setBlogs(res.data.blogs);
  }
  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <div className="w-[60%]">
      {blogs.map((blog) => (
        <Link to={"blog/" + blog.blogId}>
          <div key={blog._id} className=" w-full my-5 flex justify-between">
            <div className="w-[60%] flex flex-col gap-3">
              <div>
                {/* <img src="" alt="" /> */}
                <p>{blog.creator.name} </p>
              </div>
              <h2 className="font-blod text-3xl">{blog.title}</h2>
              <h4 className="line-clamp-2">{blog.description}</h4>
              <div className="flex gap-3">
                <p>{blog.createdAt}</p>
                <p>500</p>
                <p>200</p>
              </div>
            </div>
            <div className="w-[30%]">
              <img src={blog.image} alt="" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default HomePage;
