import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const routes = [
  {
    label: "Início",
    icon: LayoutDashboard,
    to: "/",
    color: "text-sky-500",
  },
  {
    label: "Explorar",
    icon: Search,
    to: "/explore",
    color: "text-violet-500",
  },
  {
    label: "Perfil",
    icon: User,
    to: "/profile",
    color: "text-pink-700",
  },
];

export function Sidebar() {
  const location = useLocation();

  const pathname = location.pathname;

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-950 text-white">
      <div className="px-3 py-2 flex-1">
        <Link to="/" className="flex items-center pl-3 mb-14">
          <div className="relative mr-4">
            <img
              src={logo}
              width="150"
              alt="Icone de um livro com um marcador no lado superior direito e um coração do lado inferior esquerdo e do lado escrito Book Wise"
            />
          </div>
        </Link>
        <div className="space-y-4">
          {routes.map((route) => (
            <Link
              to={route.to}
              key={route.to}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.to
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  strokeWidth={2}
                  className={cn("h-5 w-5 mr-3", route.color)}
                />
                <div className="ml-3 font-semibold">{route.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
