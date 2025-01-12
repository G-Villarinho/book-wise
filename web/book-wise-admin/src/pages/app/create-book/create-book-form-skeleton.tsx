import { Skeleton } from "@/components/ui/skeleton";

export function CreateBookFormSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 px-12">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-col gap-1 col-span-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="flex flex-col gap-1 col-span-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-col gap-1 col-span-2">
        <Skeleton className="h-5 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-1 col-span-2">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="col-span-2 flex justify-end mt-4">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
