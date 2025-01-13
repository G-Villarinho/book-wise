import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListFilter } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const booksFiltersSchema = z.object({
  authorOrTitle: z.string().optional(),
});

type BooksFiltersSchema = z.infer<typeof booksFiltersSchema>;

export function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();

  const authorOrTitle = searchParams.get("authorOrTitle");

  const { register, handleSubmit, reset } = useForm<BooksFiltersSchema>({
    defaultValues: {
      authorOrTitle: authorOrTitle ?? "",
    },
  });

  function handleFilter(data: BooksFiltersSchema) {
    const authorOrTitle = data.authorOrTitle?.toString();

    setSearchParams((prev) => {
      if (authorOrTitle) {
        prev.set("authorOrTitle", authorOrTitle);
      } else {
        prev.delete("authorOrTitle");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete("authorOrTitle");
      prev.set("page", "1");

      return prev;
    });

    reset({
      authorOrTitle: "",
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFilter)} className="flex flex-row gap-1">
      {authorOrTitle && (
        <div className="mt-2 flex justify-end mr-4">
          <Button onClick={handleClearFilters} variant="outline">
            <ListFilter />
            Remover filtros
          </Button>
        </div>
      )}
      <div className="relative top-2">
        <Input
          {...register("authorOrTitle")}
          className="w-full md:w-[400px] h-12 rounded-lg bg-slate-100 focus-visible:ring-slate-200 dark:bg-zinc-800"
          placeholder="Buscar por autor ou título"
        />
        <Button type="submit" className=" absolute top-1 left-80 font-bold ">
          Buscar
        </Button>
      </div>
    </form>
  );
}
