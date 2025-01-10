import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="relative max-w-[220px] h-[300px] bg-white shadow-lg rounded-lg">
      <div className="relative">
        <Skeleton className="w-full h-[300px] rounded-t-lg" />
      </div>

      <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-gray-300 rounded-lg z-10" />
    </div>
  );
}
