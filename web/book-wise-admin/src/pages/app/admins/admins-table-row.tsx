import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { AdminsTableActions } from "./admins-table-actions";

interface AdminsTableRowProps {
  admin: {
    id: string;
    fullName: string;
    avatar: string;
    email: string;
    status: "active" | "blocked";
    createdAt: string;
  };
}

export function AdminsTableRow({ admin }: AdminsTableRowProps) {
  const [isEmailVisible, setIsEmailVisible] = useState(false);

  function toggleEmailVisibility() {
    setIsEmailVisible((prev) => !prev);
  }

  function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    return `${name[0]}***@${domain}`;
  }

  return (
    <TableRow>
      <TableCell className="text-center">
        <Avatar className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 mx-auto">
          <AvatarImage
            src={admin.avatar}
            className="w-full h-full object-cover"
          />
          <AvatarFallback className="flex items-center justify-center bg-gray-300 text-gray-600 text-lg font-bold">
            {admin.fullName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {admin.fullName}
      </TableCell>

      <TableCell className="font-mono text-xs font-medium flex items-center gap-2">
        {isEmailVisible ? admin.email : maskEmail(admin.email)}
        <Button
          variant="ghost"
          size="sm"
          className="p-0 text-xs text-blue-500 hover:text-blue-400"
          onClick={toggleEmailVisibility}
        >
          {isEmailVisible ? <Eye /> : <EyeClosed />}
        </Button>
      </TableCell>

      <TableCell className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(admin.createdAt), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>

      <TableCell>
        <Badge
          variant={admin.status === "active" ? "active" : "destructive"}
          className="text-xs"
        >
          {admin.status === "active" ? "Ativo" : "Bloqueado"}
        </Badge>
      </TableCell>
      <TableCell>
        <AdminsTableActions adminId={admin.id} status={admin.status} />
      </TableCell>
    </TableRow>
  );
}
