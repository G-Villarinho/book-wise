import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cog, LogOut } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "./user-provider";
import { useNavigate } from "react-router-dom";
import { signOut } from "@/api/sign-out";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { EditProfileModal } from "./modals/edit-profile-modal";

export function Navbar() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { mutateAsync: signOutFn } = useMutation({
    mutationFn: signOut,
  });

  async function handleSignOut() {
    try {
      await signOutFn();

      navigate("/sign-in", { replace: false });
    } catch {
      toast.error("Falha ao sair do portal.");
    }
  }

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full">
            <Avatar>
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  {user?.fullName ? user.fullName[0].toUpperCase() : "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-app-gray-800 p-3">
            {user && (
              <>
                <div className="mb-4">
                  <div className="font-bold text-app-gray-100">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-app-gray-300">{user.email}</div>
                </div>
                <Dialog
                  onOpenChange={setIsEditProfileOpen}
                  open={isEditProfileOpen}
                >
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div className="flex gap-3">
                        <Cog />
                        <span>Configurações</span>
                      </div>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <EditProfileModal
                    onClose={() => setIsEditProfileOpen(false)}
                  />
                </Dialog>
                <DropdownMenuItem onClick={handleSignOut}>
                  <div className="flex gap-3 text-red-500">
                    <LogOut />
                    <span>Sair</span>
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
