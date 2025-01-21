import { getTopCategories } from "@/api/get-top-categories";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("categoryId");

  const { data: topCategories } = useQuery({
    queryKey: ["topCategories"],
    queryFn: getTopCategories,
  });

  const categories = [
    { id: "all", label: "Tudo" },
    ...(topCategories?.map((category) => ({
      id: category.id,
      label: category.name,
    })) || []),
  ];

  function handleCategoryChange(categoryId: string) {
    setSearchParams((prev) => {
      if (categoryId === "tudo") {
        prev.delete("categoryId");
      } else {
        prev.set("categoryId", categoryId);
      }
      prev.set("page", "1");
      return prev;
    });
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={`font-semibold ${
            selectedCategory === category.id ||
            (category.id === "tudo" && !selectedCategory)
              ? "bg-app-green-100 hover:bg-app-green-200 text-white"
              : "bg-transparent border-2 border-app-green-100 text-app-green-100 hover:bg-app-green-200"
          } h-10 px-6 text-sm rounded-full`}
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
