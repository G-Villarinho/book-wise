import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface AuthorsTableRowProps {
  author: {
    id: string;
    fullName: string;
    nationality: string;
    biography: string;
    avatarUrl: string;
    createdAt: string;
  };
}

export function AuthorsTableRow({ author }: AuthorsTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Avatar className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
          <AvatarImage
            src={author.avatarUrl}
            className="w-full h-full object-cover"
          />
          <AvatarFallback className="flex items-center justify-center bg-gray-300 text-gray-600 text-lg font-bold">
            {author.fullName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {author.id}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {author.fullName}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(author.createdAt), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {author.nationality}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">Action</TableCell>
    </TableRow>
  );
}
