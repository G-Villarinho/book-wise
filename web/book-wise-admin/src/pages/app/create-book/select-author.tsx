import { getAuthors } from "@/api/get-authors";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Author } from "@/@types/author";
import { Search, X } from "lucide-react";
import { AuthorChip } from "./author-chip";
import { useFormContext } from "react-hook-form";
import { BookSchemaData } from "./create-book-form";
import { useNavigate } from "react-router-dom"; // Adicionando a importação para navegação

interface SelectAuthorProps {
  open: boolean;
  selectedAuthors: {
    id: string;
    fullName: string;
    avatarUrl: string;
  }[];
  onAuthorsChange: (authors: Author[]) => void;
  onClose: () => void;
}

export function SelectAuthor({
  open,
  selectedAuthors,
  onAuthorsChange,
  onClose,
}: SelectAuthorProps) {
  const { setValue } = useFormContext<BookSchemaData>();
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedAuthorPreview, setSelectedAuthorPreview] =
    useState<Author[]>(selectedAuthors);
  const [page, setPage] = useState(1); // Página gerenciada localmente

  const { data: result, isLoading } = useQuery({
    queryKey: ["authors", submittedQuery, page],
    queryFn: () =>
      getAuthors({
        page,
        limit: 4,
        fullName: submittedQuery,
      }),
    staleTime: 1000 * 60 * 15,
    enabled: open,
  });

  const navigate = useNavigate(); // Instanciando o hook de navegação

  function handlePaginate(pageIndex: number) {
    setPage(pageIndex);
  }

  function handleSearch() {
    setSubmittedQuery(searchQuery);
    setPage(1);
  }

  function handleClearFilter() {
    setSearchQuery("");
    setSubmittedQuery("");
    setPage(1);
  }

  function toggleAuthorSelection(author: Author) {
    const isSelected = selectedAuthorPreview.some((a) => a.id === author.id);
    const updatedSelected = isSelected
      ? selectedAuthorPreview.filter((a) => a.id !== author.id)
      : [...selectedAuthorPreview, author];

    setSelectedAuthorPreview(updatedSelected);
    onAuthorsChange(updatedSelected);
  }

  useEffect(() => {
    setValue(
      "authors",
      selectedAuthorPreview.map((author) => ({ id: author.id }))
    );
  }, [selectedAuthorPreview, setValue]);

  const handleRemoveAuthor = (authorId: string) => {
    const updatedAuthors = selectedAuthorPreview.filter(
      (author) => author.id !== authorId
    );
    setSelectedAuthorPreview(updatedAuthors);
    onAuthorsChange(updatedAuthors);
  };

  function handleAddAuthors() {
    onClose();
  }

  function handleCreateAuthor() {
    navigate("/authors/new");
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Escolha os Autores</DialogTitle>
        <DialogDescription>
          Selecione autores para associar ao livro.
        </DialogDescription>
      </DialogHeader>
      <div className="flex gap-4 ">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar autores"
          className="w-full"
        />
        <Button onClick={handleSearch} variant="outline" size="sm">
          <Search />
        </Button>
        <Button onClick={handleClearFilter} variant="outline" size="sm">
          <X />
        </Button>
      </div>
      {selectedAuthorPreview.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {selectedAuthorPreview.map((author) => (
            <AuthorChip
              key={author.id}
              author={author}
              onRemove={handleRemoveAuthor}
            />
          ))}
        </div>
      )}
      {isLoading ? (
        <p>Carregando autores...</p>
      ) : (
        result && (
          <>
            <ul className="divide-y">
              {result.data.map((author: Author) => (
                <li key={author.id} className="flex items-center gap-4 p-4">
                  <img
                    src={author.avatarUrl}
                    alt={author.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="flex-1 font-medium">{author.fullName}</span>
                  <Button
                    onClick={() => toggleAuthorSelection(author)}
                    variant="ghost"
                    size="sm"
                  >
                    {selectedAuthorPreview.some((a) => a.id === author.id)
                      ? "Remover"
                      : "Selecionar"}
                  </Button>
                </li>
              ))}
            </ul>
            <Pagination
              page={page}
              total={result.total}
              totalPages={result.totalPages}
              onPageChange={handlePaginate}
            />
          </>
        )
      )}

      {result?.data.length === 0 && !isLoading && (
        <div className="mt-4 text-center">
          <p>Nenhum autor encontrado. Deseja criar um novo autor?</p>
          <Button
            className="mt-4"
            onClick={handleCreateAuthor}
            variant="outline"
            size="sm"
          >
            Criar Autor
          </Button>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button onClick={handleAddAuthors} variant="outline">
          Adicionar autores
        </Button>
      </div>
    </DialogContent>
  );
}
