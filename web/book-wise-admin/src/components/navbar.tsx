import { MobileSidebar } from "./mobile-sidebar";
import { NavbarRoutes } from "./navbar-routes";

export function Navbar() {
  return (
    <div className="p-4 border-b h-full flex items-center shadow-sm bg-white text-gray-900 border-gray-300 dark:bg-zinc-950 dark:text-gray-100 dark:border-gray-600">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
}
