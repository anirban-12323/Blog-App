import { Outlet } from "react-router-dom";

function Navber() {
  return (
    <div className=" flex-none w-full h-full flex flex-col items-center overflow-x-hidden">
      <div className="w-full bg-gray-700 h-[60px]">Navber</div>
      <Outlet></Outlet>
    </div>
  );
}

export default Navber;
