import React from "react";
import { formatDate } from "../utils/formDate";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DisplayBlogs = ({ blogs }) => {
  const { comments } = useSelector((state) => state.selectedBlog);
  const { token } = useSelector((state) => state.user);
  const { id: userId } = useSelector((state) => state.user.user) || {};
  return (
    <>
      {blogs.map((blog) => (
        <Link key={blog._id} to={"/blog/" + blog.blogId}>
          <div className=" w-full my-5 flex justify-between">
            <div className="w-[60%] flex flex-col gap-3">
              <div>
                {/* <img src="" alt="" /> */}
                <p>{blog?.creator?.name} </p>
              </div>
              <h2 className="font-blod text-3xl">{blog.title}</h2>
              <h4 className="line-clamp-2">{blog.description}</h4>
              <div className="flex gap-3">
                <p>{formatDate(blog.createdAt)}</p>
                <div className="flex gap-4 ">
                  <div className="cursor-pointer flex gap-2">
                    <i className="fi fi-sr-thumbs-up text-blue-600 text-xl mt-1"></i>

                    <p className="text-xl">{blog.likes.length}</p>
                  </div>
                  <div className=" flex gap-2">
                    <i className="fi fi-sr-comment-alt text-xl mt-1"></i>
                    <p className="text-xl">{comments?.length}</p>
                  </div>
                  <div
                    className=" flex gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveBlogs(blog._id, token);
                    }}
                  >
                    {blog?.totalSaves?.includes(userId) ? (
                      <i className="fi fi-sr-bookmark text-xl "></i>
                    ) : (
                      <i className="fi fi-br-bookmark text-xl "></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[40%] sm:w-[30%] max-xsm:w-full">
              <img
                src={blog.image}
                alt=""
                className="aspect-video object-cover w-full"
              />
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default DisplayBlogs;
