import { TableSkeleton } from "@/components/admin/loading-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-32 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
      <TableSkeleton />
    </div>
  );
}
