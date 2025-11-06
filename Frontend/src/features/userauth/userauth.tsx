import { Outlet } from "react-router-dom";

export default function Userauth() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-row 2xl:bg-[#393E46] p-10 lg:p-0  bg-white md:rounded-[20px] lg:w-[1000px] lg:h-[900px] 2xl:w-[1300px] 2xl:h-[900px] lg:rounded-[53px]">
        <div className="flex-1 hidden 2xl:flex items-center justify-center">
          <img src="/tablepong.svg" alt="Logo" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[24px]">
          <img src="/pingpong.svg" />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
