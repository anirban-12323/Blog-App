import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

import { useSelector } from "react-redux";

function Navber() {
  const { token } = useSelector((state) => state.user);
  const { name } = useSelector((state) => state.user.user || {});
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate("/add-blog");
  };
  return (
    // <div className="flex-none w-full h-full flex flex-col items-center overflow-x-hidden">
    //   <div className="w-full bg-gray-700 h-[60px] flex items-center px-6 shadow-md">
    //     <h1 className="text-white text-2xl font-bold tracking-wide">
    //       Blog<span className="text-yellow-400">App</span>
    //     </h1>
    //   </div>

    //   <Outlet />
    // </div>

    <>
      <div className="bg-white max-w-full flex justify-between items-center h-[60px] px-10 border-b drop-shadow-sm">
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
            <div className="text-xl capitalize">{name || "User"}</div>
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
      </div>
      <Outlet />
    </>
  );
}

export default Navber;
