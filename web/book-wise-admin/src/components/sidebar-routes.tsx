import { BookMarked, Compass, Layout, LibraryBig, Shield } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

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
  },
];

export function SidebarRoutes() {
  const routes = guestRoutes;

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
