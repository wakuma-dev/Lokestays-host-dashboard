import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PropertiesTablePaginationProps = {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  hasNextPage: boolean;
  isFetching: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

export function PropertiesTablePagination({
  pageIndex,
  pageSize,
  rowCount,
  hasNextPage,
  isFetching,
  onNextPage,
  onPreviousPage,
}: PropertiesTablePaginationProps) {
  const startRow =
    rowCount === 0 ? 0 : pageIndex * pageSize + 1;

  const endRow = pageIndex * pageSize + rowCount;

  return (
    <div className="flex w-full items-center justify-between p-2">
      <p className="text-sm text-muted-foreground">
        Showing {startRow} to {endRow} properties
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={pageIndex === 0 || isFetching}
              className={
                pageIndex === 0 || isFetching
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(event) => {
                event.preventDefault();

                if (pageIndex > 0 && !isFetching) {
                  onPreviousPage();
                }
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="px-3 text-sm font-medium">
              {pageIndex + 1}
            </span>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!hasNextPage || isFetching}
              className={
                !hasNextPage || isFetching
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(event) => {
                event.preventDefault();

                if (hasNextPage && !isFetching) {
                  onNextPage();
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
