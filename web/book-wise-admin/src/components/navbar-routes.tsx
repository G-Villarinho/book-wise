import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function NavbarRoutes() {
  return (
    <div className="flex gap-x-6 ml-auto">
      <ThemeToggle />
      <Avatar>
        <AvatarImage src="https://github.com/G-Villarinho.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
