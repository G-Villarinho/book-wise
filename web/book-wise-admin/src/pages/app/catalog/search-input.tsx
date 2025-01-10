import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { ListFilter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function SearchInput() {
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedValue = useDebounce(value, 500);
  const authorOrTitle = searchParams.get("authorOrTitle");

  useEffect(() => {
    if (debouncedValue) {
      setSearchParams((prev) => {
        prev.set("authorOrTitle", debouncedValue);
        prev.set("page", "1");
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("authorOrTitle");
        prev.set("page", "1");
        return prev;
      });
    }
  }, [debouncedValue, setSearchParams]);

  function handleClearFilter() {
    setValue("");
    setSearchParams((prev) => {
      prev.delete("authorOrTitle");
      prev.set("page", "1");
      return prev;
    });
  }

  return (
    <div className="flex flex-row gap-1">
      {authorOrTitle && (
        <div className="mt-2 flex justify-end mr-4">
          <Button onClick={handleClearFilter} variant="outline">
            <ListFilter />
            Remover filtros
          </Button>
        </div>
      )}
      <div className="relative top-2">
        <Search className="h-4 w-4 absolute top-2 left-3 text-slate-600" />
        <Input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
          placeholder="Buscar por autor ou título"
        />
      </div>
    </div>
  );
}
