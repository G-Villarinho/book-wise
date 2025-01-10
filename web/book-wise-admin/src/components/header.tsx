import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-4xl">{title}</h1>
          <p className="text-sm ">{subtitle}</p>
        </div>
        <div className="ml-auto flex flex-row gap-1 mr-3">{children}</div>
      </div>
    </header>
  );
}
