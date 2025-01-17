import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { UseProvider } from "@/contexts/user/user-provider";
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
              replace: true,
            });
          }

          if (status === 403) {
            navigate("/forbidden", {
              replace: true,
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
    <UseProvider>
      <div className="h-full">
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
          <Navbar />
        </div>
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="md:pl-60 md:py-28">
          <Outlet />
        </main>
      </div>
    </UseProvider>
  );
}
