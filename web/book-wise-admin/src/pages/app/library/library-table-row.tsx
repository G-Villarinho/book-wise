import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Ellipsis, FilePen, Forward, Search, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LibraryTableRowProps {
  book: {
    id: string;
    totalPages: number;
    totalEvaluations: number;
    title: string;
    description: string;
    coverImageURL: string;
    authors: string[];
    categories: string[];
    createdAt: string;
  };
}

export function LibraryTableRow({ book }: LibraryTableRowProps) {
  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Dialog onOpenChange={setIsBookDetailsOpen} open={isBookDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do livro</span>
            </Button>
          </DialogTrigger>
        </Dialog>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">{book.id}</TableCell>

      <TableCell className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(book.createdAt), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {book.title}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {book.authors.join(", ")}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {book.categories.join(", ")}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="xxs">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Trash /> Remove
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FilePen /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Forward /> Publish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
