import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

const categories = [
  { id: "tudo", label: "Tudo" },
  { id: "computacao", label: "Computação" },
  { id: "educacao", label: "Educação" },
  { id: "fantasia", label: "Fantasia" },
  { id: "ficcao-cientifica", label: "Ficção Científica" },
  { id: "horror", label: "Horror" },
  { id: "hqs", label: "HQs" },
  { id: "suspense", label: "Suspense" },
];

export function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("categoryId");

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
              ? "bg-[#50B2C0] text-white"
              : "bg-transparent border-2 border-[#50B2C0] text-[#50B2C0]"
          } h-10 px-6 text-sm rounded-full`}
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
