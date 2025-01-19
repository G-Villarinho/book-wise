import authImage from "@/assets/auth-image-page.svg";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="max-w-7xl mx-auto h-screen bg-gray-900 text-white">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-w-lg max-md:mx-auto w-full p-6">
          <Outlet />
        </div>
        <div className="h-full md:py-6 flex items-center relative max-md:before:hidden before:absolute before:bg-gradient-to-r before:from-gray-800 before:via-[#343d83] before:to-[#65629c] before:h-full before:w-3/4 before:right-0 before:z-0 ">
          <img
            src={authImage}
            className="rounded-md lg:w-4/5 md:w-11/12 z-50 relative"
            alt="Auth Illustration"
          />
        </div>
      </div>
    </div>
  );
}
