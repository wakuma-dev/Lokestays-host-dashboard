import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
type PropertiesTableSkeletonProps = {
  hideCheckbox?: boolean;
  hideActions?: boolean;
  hidePagination?: boolean;
  hideSearch?: boolean;
  pageSize?: number;
};
export default function PropertiesTableSkeleton({
  hideCheckbox = false,
  hideActions = false,
  hidePagination = false,
  hideSearch = false,
  pageSize = 8,
}: PropertiesTableSkeletonProps = {}) {
  return (
    <div className="w-full">
      {!hideSearch ? (
        <div className="mb-3 flex justify-end">
          <Skeleton className="h-10 w-full sm:w-72" />
        </div>
      ) : null}
      <div className="w-full overflow-x-auto rounded-lg border border-[#E5E7EB] dark:border-[#27272a]">
        <Table>
          <TableHeader>
            <TableRow>
              {hideCheckbox ? null : (
                <TableHead>
                  <Skeleton className="h-4 w-4" />
                </TableHead>
              )}
              <TableHead>Property Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {hideActions ? null : <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: pageSize }, (_, index) => (
              <TableRow key={index}>
                {hideCheckbox ? null : (
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {hideActions ? null : (
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!hidePagination ? (
          <div className="flex items-center justify-between p-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-32" />
          </div>
        ) : null}
      </div>
    </div>
  );
}