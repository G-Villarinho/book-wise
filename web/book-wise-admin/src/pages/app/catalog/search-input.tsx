import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedValue) {
      navigate({
        pathname: window.location.pathname,
        search: `?q=${debouncedValue}&page=1`,
      });
    } else {
      navigate({
        pathname: window.location.pathname,
        search: "",
      });
    }
  }, [debouncedValue, navigate]);

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
