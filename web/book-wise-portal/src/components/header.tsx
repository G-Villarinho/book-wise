import { LucideIcon } from "lucide-react";

interface HeaderProps {
  icon: LucideIcon;
  title: string;
}

export function Header({ icon: Icon, title }: HeaderProps) {
  return (
    <header className="flex flex-row items-center gap-3">
      <Icon strokeWidth={2} size={40} className="text-[#50B2C0]" />
      <h1 className="text-3xl font-extrabold">{title}</h1>
    </header>
  );
}
