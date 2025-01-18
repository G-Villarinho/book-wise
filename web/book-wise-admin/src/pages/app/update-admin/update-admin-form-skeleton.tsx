import { Skeleton } from "@/components/ui/skeleton";

export function UpdateAdminFormSkeleton() {
  return (
    <div className="w-full max-w-2xl mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-bold mb-2">Nome completo</label>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex flex-col">
          <label className="font-bold mb-2">E-mail</label>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="w-40 h-10 mt-4 rounded-md" />
      </div>
    </div>
  );
}
