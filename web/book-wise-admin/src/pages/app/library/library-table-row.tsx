import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { LibraryTableCellActions } from "./library-table-cell-actions";

interface LibraryTableRowProps {
  book: {
    id: string;
    totalPages: number;
    totalEvaluations: number;
    title: string;
    description: string;
    coverImageURL: string;
    published: boolean;
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
      <TableCell className="font-mono text-xs font-medium ">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
            book.published ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {book.published ? "Publicado" : "Não publicado"}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <LibraryTableCellActions
          bookId={book.id}
          isPublished={book.published}
        />
      </TableCell>
    </TableRow>
  );
}
