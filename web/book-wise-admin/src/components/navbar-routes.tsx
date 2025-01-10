import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function NavbarRoutes() {
  return (
    <div className="flex gap-x-2 ml-auto">
      <Avatar>
        <AvatarImage src="https://github.com/G-Villarinho.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
