import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchFilterSchema = z.object({
  q: z.string().optional(),
});

type SearchFilterSchema = z.infer<typeof searchFilterSchema>;

export function SearchFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q");

  const { register, handleSubmit } = useForm<SearchFilterSchema>({
    defaultValues: {
      q: q ?? "",
    },
  });

  function handleFilter(data: SearchFilterSchema) {
    const { q } = data;

    setSearchParams((prev) => {
      if (q) {
        prev.set("q", q);
      } else {
        prev.delete("q");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="w-full max-w-md min-w-[350px]"
    >
      <div className="relative">
        <Input
          className="w-full bg-transparent h-12 text-sm border rounded-md pl-3 pr-28 py-2 transition duration-300 ease"
          placeholder="Buscar livro ou autor"
          {...register("q")}
        />
        <Button
          className=" absolute top-1 right-1 flex items-center rounded bg-[#50B2C0] py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:shadow-none active:bg- hover:bg-[#48a1ae] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="submit"
        >
          <div className="flex items-center gap-2">
            <Search size={15} strokeWidth={3} />
            Buscar
          </div>
        </Button>
      </div>
    </form>
  );
}
