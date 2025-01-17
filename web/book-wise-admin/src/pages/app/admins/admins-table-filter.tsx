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
const adminsFiltersSchema = z.object({
  fullName: z.string().optional(),
  status: z.string().optional(),
});

type AdminsFiltersSchema = z.infer<typeof adminsFiltersSchema>;

export function AdminsTableFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const fullName = searchParams.get("fullName");
  const status = searchParams.get("status");

  const { register, handleSubmit, reset, control } =
    useForm<AdminsFiltersSchema>({
      defaultValues: {
        fullName: fullName ?? "",
        status: status ?? "all",
      },
    });

  const hasAnyFilter = !!fullName || !!status;

  function handleFilter(data: AdminsFiltersSchema) {
    const { fullName, status } = data;

    setSearchParams((prev) => {
      if (fullName) {
        prev.set("fullName", fullName);
      } else {
        prev.delete("fullName");
      }

      if (status) {
        prev.set("status", status);
      } else {
        prev.delete("status");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete("fullName");
      prev.delete("status");

      return prev;
    });

    reset({
      fullName: "",
      status: "all",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="Nome do admin"
        className="h-8 w-auto"
        {...register("fullName")}
      />

      <Controller
        control={control}
        name="status"
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
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
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
