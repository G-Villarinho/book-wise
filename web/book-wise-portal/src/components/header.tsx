import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HeaderProps {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
}

export function Header({ icon: Icon, title, children }: HeaderProps) {
  return (
    <header className="flex flex-row items-center gap-3 mb-9 px-12 justify-between">
      <div className="flex items-center gap-3">
        <Icon strokeWidth={2} size={40} className="text-[#50B2C0]" />
        <h1 className="text-3xl font-extrabold">{title}</h1>
      </div>
      <div className="items-center gap-2 hidden md:flex">{children}</div>
    </header>
  );
}
