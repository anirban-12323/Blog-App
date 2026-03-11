import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../utils/userSlice";

function Navber() {
  const { token } = useSelector((state) => state.user);
  const { name, username, profilepic } = useSelector(
    (state) => state.user.user || {},
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);

  const handleWriteClick = () => {
    navigate("/add-blog");
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowPopup(false);
    navigate("/");
  };
  return (
    <>
      <div className="bg-white max-w-full flex justify-between  relative items-center h-[60px] px-10 border-b drop-shadow-sm">
        <div className="flex justify-between gap-4 items-center">
          <Link to={"/"}>
            <div>
              <img src={logo} alt="" />
            </div>
          </Link>
          <div className="relative w-full max-w-sm">
            <i className="fi fi-rs-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              className="bg-gray-300 outline-none focus:outline-none  rounded-full pl-10 p-2"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center items-center">
          <div className="flex gap-1 justify-center items-center ">
            <i className="fi fi-rr-file-edit text-2xl mt-2"></i>
            <span onClick={handleWriteClick} className="text-xl cursor-pointer">
              Write
            </span>
          </div>

          {token ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={
                  profilepic
                    ? profilepic
                    : `https://api.dicebear.com/9.x/initials/svg?seed=${name}`
                }
                alt=""
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowPopup((prev) => !prev)}
              />
            </div>
          ) : (
            <div className="flex gap-1">
              <Link to={"/signup"}>
                <button className="bg-blue-400 rounded-full px-5 py-2 text-white">
                  Signup
                </button>
              </Link>

              <Link to={"/signin"}>
                <button className="border rounded-full px-5 py-2">
                  Signin
                </button>
              </Link>
            </div>
          )}
        </div>

        {showPopup ? (
          <div className="w-[150px] h-[180px] bg-gray-100  drop-shadow-xl absolute right-2 top-12 rounded-xl ">
            <Link to={`/@${username}`}>
              <p className="popup rounded-t-xl">Profile</p>
            </Link>
            <Link to={`/edit-profile`}>
              <p className="popup ">Edit Profile</p>
            </Link>
            {/* <p className=" popup rounded-t-xl">Edit Profile</p> */}
            <p className=" popup rounded-b-xl ">Setting</p>
            <p className=" popup rounded-b-xl  " onClick={handleLogout}>
              Logout
            </p>
          </div>
        ) : null}
      </div>
      <Outlet />
    </>
  );
}

export default Navber;
