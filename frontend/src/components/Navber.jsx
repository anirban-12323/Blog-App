import { Outlet } from "react-router-dom";

function Navber() {
  return (
    <div className="flex-none w-full h-full flex flex-col items-center overflow-x-hidden">
      <div className="w-full bg-gray-700 h-[60px] flex items-center px-6 shadow-md">
        <h1 className="text-white text-2xl font-bold tracking-wide">
          Blog<span className="text-yellow-400">App</span>
        </h1>
      </div>

      <Outlet />
    </div>
  );
}

export default Navber;
