import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminsTableRowProps {
  admin: {
    id: string;
    fullName: string;
    avatar: string;
    email: string;
    status: string;
    createdAt: string;
  };
}

export function AdminsTableRow({ admin }: AdminsTableRowProps) {
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
        {admin.id}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {admin.fullName}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {admin.email}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {admin.email}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(admin.createdAt), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <Badge
          variant={admin.status === "active" ? "default" : "destructive"}
          className="text-xs"
        >
          {admin.status === "active" ? "Ativo" : "Bloqueado"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
