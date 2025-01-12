import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export function Sidebar() {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm dark:bg-zinc-950">
      <div className="p-6 flex flex-row gap-1">
        <Logo />
        <span className="text-xl font-semibold text-zinc-600 dark:text-white">
          BOOK WISE
        </span>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
}
