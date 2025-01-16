import { BookMarked, Compass, Layout, LibraryBig, Shield } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useContext } from "react";
import { UserContext } from "@/contexts/user-context";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dasboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Catálago",
    href: "/catalog",
  },
  {
    icon: LibraryBig,
    label: "Biblioteca",
    href: "/library",
  },
  {
    icon: BookMarked,
    label: "Autores",
    href: "/authors",
  },
  {
    icon: Shield,
    label: "Administradores",
    href: "/admins",
    requiredRole: "owner",
  },
];

export function SidebarRoutes() {
  const { user } = useContext(UserContext);
  const routes = guestRoutes.filter((route) => {
    if (!route.requiredRole) {
      return true;
    }
    return route.requiredRole === user?.role;
  });

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => {
        return (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        );
      })}
    </div>
  );
}
