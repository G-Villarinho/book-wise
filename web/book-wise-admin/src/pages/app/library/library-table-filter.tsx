import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const libraryFiltersSchema = z.object({
  bookId: z.string().optional(),
  title: z.string().optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
});

type LibraryFiltersSchema = z.infer<typeof libraryFiltersSchema>;

export function LibraryTableFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const bookId = searchParams.get("bookId");
  const title = searchParams.get("title");
  const authorId = searchParams.get("authorId");
  const categoryId = searchParams.get("categoryId");

  const { register, handleSubmit, reset, control } =
    useForm<LibraryFiltersSchema>({
      defaultValues: {
        bookId: bookId ?? "",
        title: title ?? "",
        authorId: authorId ?? "all",
        categoryId: categoryId ?? "all",
      },
    });

  const hasAnyFilter = !!bookId || !!title || !!authorId || !!categoryId;

  function handleFilter(data: LibraryFiltersSchema) {
    const { bookId, title, authorId, categoryId } = data;

    setSearchParams((prev) => {
      if (bookId) {
        prev.set("bookId", bookId);
      } else {
        prev.delete("bookId");
      }

      if (title) {
        prev.set("title", title);
      } else {
        prev.delete("title");
      }

      if (authorId) {
        prev.set("authorId", authorId);
      } else {
        prev.delete("authorId");
      }

      if (categoryId) {
        prev.set("categoryId", categoryId);
      } else {
        prev.delete("categoryId");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete("bookId");
      prev.delete("title");
      prev.delete("authorId");
      prev.delete("categoryId");
      prev.set("page", "1");

      return prev;
    });

    reset({
      bookId: "",
      title: "",
      authorId: "all",
      categoryId: "all",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="ID do livro"
        className="h-8 w-auto"
        {...register("bookId")}
      />
      <Input
        placeholder="Título do livro"
        className="h-8 w-[320px]"
        {...register("title")}
      />

      <Controller
        control={control}
        name="authorId"
        render={({ field: { name, onChange, value, disabled } }) => (
          <Select
            name={name}
            onValueChange={onChange}
            value={value}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="text-sm">Todos os autores</span>
              </SelectItem>
              {/* Adicione outras opções de autores aqui */}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="categoryId"
        render={({ field: { name, onChange, value, disabled } }) => (
          <Select
            name={name}
            onValueChange={onChange}
            value={value}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="text-sm">Todos as categorias</span>
              </SelectItem>
              {/* Adicione outras opções de categorias aqui */}
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={!hasAnyFilter}
        onClick={handleClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  );
}
