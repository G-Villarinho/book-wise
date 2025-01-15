import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authorsFiltersSchema = z.object({
  fullName: z.string().optional(),
  authorId: z.string().optional(),
});

type AuthorsFiltersSchema = z.infer<typeof authorsFiltersSchema>;

export function AuthorTableFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const authorId = searchParams.get("authorId");
  const fullName = searchParams.get("fullName");

  const { register, handleSubmit, reset } = useForm<AuthorsFiltersSchema>({
    defaultValues: {
      fullName: fullName ?? "",
      authorId: authorId ?? "",
    },
  });

  const hasAnyFilter = !!fullName || !!authorId;

  function handleFilter(data: AuthorsFiltersSchema) {
    const { fullName, authorId } = data;

    setSearchParams((prev) => {
      if (authorId) {
        prev.set("authorId", authorId);
      } else {
        prev.delete("authorId");
      }

      if (fullName) {
        prev.set("fullName", fullName);
      } else {
        prev.delete("fullName");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete("fullName");
      prev.delete("authorId");
      prev.set("page", "1");

      return prev;
    });

    reset({
      fullName: "",
      authorId: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="ID do autor"
        className="h-8 w-auto"
        {...register("authorId")}
      />
      <Input
        placeholder="Nome do autor"
        className="h-8 w-[320px]"
        {...register("fullName")}
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
