import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SearchInput() {
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedValue = useDebounce(value, 500);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedValue) {
      setSearchParams((prev) => {
        prev.set("authorOrTitle", debouncedValue);
        prev.set("page", "1");
        return prev;
      });

      navigate({
        pathname: window.location.pathname,
        search: `?${searchParams.toString()}`,
      });
    }
  }, [debouncedValue, navigate, searchParams, setSearchParams]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-2 left-3 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Buscar por autor ou título"
      />
    </div>
  );
}
