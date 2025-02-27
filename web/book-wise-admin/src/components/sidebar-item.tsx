import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export function SidebarItem({ icon: Icon, label, href }: SidebarItemProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname.startsWith(`${href}/`);

  function onClick() {
    navigate(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 h-full text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/70 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4 font-semibold dark:text-white">
        <Icon
          size={22}
          className={cn(
            "text-slate-500 font-bold dark:text-white",
            isActive && "text-sky-700"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
}
