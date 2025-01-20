import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => Promise<void> | void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (page >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-2 lg:space-x-2">
        <Button
          variant="outline"
          className="hidden h-12 w-12 p-0 lg:flex bg-[#181C2A] hover:bg-[#202638]"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          <span className="sr-only">Primeira página</span>
          <ChevronsLeft />
        </Button>

        <Button
          variant="outline"
          className="h-12 w-12 p-0 bg-[#181C2A] hover:bg-[#202638]"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <span className="sr-only">Página anterior</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant="outline"
            className={`h-12 w-12 p-0 bg-[#181C2A] hover:bg-[#202638] ${
              page === pageNum ? "bg-gray-200 text-gray-800" : "text-gray-200"
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          className="h-12 w-12 p-0 bg-[#181C2A] hover:bg-[#202638]"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Próxima página</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="hidden h-12 w-12 p-0 lg:flex bg-[#181C2A] hover:bg-[#202638]"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Última página</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
