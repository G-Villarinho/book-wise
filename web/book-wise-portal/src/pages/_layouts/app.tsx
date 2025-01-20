import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401) {
            navigate("/sign-in", {
              replace: false,
            });
          }

          if (status === 403) {
            navigate("/forbidden", {
              replace: false,
            });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:w-72 md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-950">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
