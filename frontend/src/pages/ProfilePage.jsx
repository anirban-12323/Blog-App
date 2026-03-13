import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { handleFollowCreator, handleSaveBlogs } from "./BlogPage";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/formDate";
import DisplayBlogs from "../components/DisplayBlogs";

const ProfilePage = () => {
  const { username } = useParams();

  const [userData, setUserData] = useState(null);
  const { id: userId } = useSelector((state) => state.user.user);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        console.log(username);
        let res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/${username?.split("@")[1]}`,
        );

        setUserData(res.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserDetails();
  }, [username]);
  return (
    <div className=" w-full flex  justify-center">
      {userData ? (
        <div className="w-[80%]  flex justify-evenly">
          <div className="w-[50%] ">
            <div className="flex justify-between mt-10">
              <p className="text-4xl font-semibold">{userData.name}</p>
              <i className="fi fi-bs-menu-dots opacity-90"></i>
            </div>

            <div className="my-4">
              <p className="mb-10">Home</p>
            </div>
            <div>
              {userData.blogs.map((blog) => (
                <Link key={blog._id} to={"/blog/" + blog.blogId}>
                  <div className=" w-full my-5 flex justify-between">
                    <div className="w-[60%] flex flex-col gap-3">
                      <div>
                        {/* <img src="" alt="" /> */}
                        <p>{blog.creator.name} </p>
                      </div>
                      <h2 className="font-blod text-3xl">{blog.title}</h2>
                      <h4 className="line-clamp-2">{blog.description}</h4>
                      <div className="flex gap-3">
                        <p className="text-md">{formatDate(blog.createdAt)}</p>
                        <div className="flex gap-4 ">
                          <div className="cursor-pointer flex gap-2">
                            <i className="fi fi-sr-thumbs-up text-blue-600 text-md "></i>

                            <p className="text-md">{blog.likes.length}</p>
                          </div>
                          <div className=" flex gap-2">
                            <i className="fi fi-sr-comment-alt text-md "></i>
                            <p className="text-md">{blog.comments?.length}</p>
                          </div>
                          <div
                            className=" flex gap-2"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSaveBlogs(blog._id, token);
                            }}
                          >
                            {blog?.totalSaves?.includes(userId) ? (
                              <i className="fi fi-sr-bookmark text-md "></i>
                            ) : (
                              <i className="fi fi-br-bookmark text-md "></i>
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
            </div>
          </div>

          <div className="w-[20%] border-l pl-10 min-h-[calc(100vh_-_70px)]">
            <div className="my-10">
              <div className="w-20 h-20">
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${userData.name}`}
                  alt=""
                  className="rounded-full"
                />
              </div>
              <p className="text-base font-medium my-3">{userData.name}</p>
              <p className="text-slate-600">
                {userData.followers.length} Followers
              </p>
              <p className="text-slate-600  text-sm font-normal my-3">
                {userData.bio}
              </p>

              {userId == userData._id ? (
                <button className="bg-green-600 rounded-full px-7 py-3 my-3 text-white">
                  <Link to="/edit-profile">Edit Profile</Link>
                </button>
              ) : (
                <button
                  className="bg-green-600 rounded-full px-7 py-3 my-3 text-white"
                  onClick={() => handleFollowCreator(userData._id, token)}
                >
                  follow
                </button>
              )}

              <div className="my-6">
                <h2 className=" font-semibold">Following</h2>
                <div className="my-5">
                  {userData.following.map((user) => (
                    <div className="flex justify-between items-center gap-2">
                      <Link to={`/@${user.username}`}>
                        <div className="flex items-center gap-2 hover:underline cursor-pointer">
                          <div className="w-5 h-5">
                            <img
                              src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                              alt=""
                              className="rounded-full"
                            />
                          </div>

                          <p className="text-base font-medium my-3">
                            {user.name}
                          </p>
                        </div>
                      </Link>
                      <i className="fi fi-bs-menu-dots opacity-90"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Loading....</h1>
      )}
    </div>
  );
};

export default ProfilePage;
