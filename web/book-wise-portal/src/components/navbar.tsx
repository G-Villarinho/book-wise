import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileSidebar } from "@/components/mobile-sidebar";

export function Navbar() {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
