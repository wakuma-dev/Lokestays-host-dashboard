import { useState } from "react"
import { type DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useNavigate } from "@tanstack/react-router";
import { useTable, FlexRender } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
} from "lucide-react";
import type { Properties } from "../types/properties.types";
import usePropertiesTableColumns from "./PropertiesTableColumns";
import { propertiesTableFeatures } from "../types/propertiesTable.config";
import {
  usePropertiesQuery,
  PropertiesTableSkeleton,
  PropertiesTablePagination,
   PropertiesToolbar,
  useDeletePropertyMutation,
} from "@/features/properties";
import PropertiesUpdate from "./PropertiesUpdate";
import { Table, TableBody, TableHead, TableHeader, TableCell, TableRow } from "@/components/ui/table";
type PropertiesTableProps = {
  hideCheckbox?: boolean;
  hidePagination?: boolean;
  hideSearch?: boolean;
  hideActions?: boolean;
  hideSorting?: boolean;
  pageSize?: number;
};
function SortIcon({direction,}: {direction: false | "asc" | "desc";}) {
  if (direction === "asc") {
    return <ChevronUp className="h-3.5 w-3.5 text-[#0f766e]" />;
  }
  if (direction === "desc") {
    return <ChevronDown className="h-3.5 w-3.5 text-[#0f766e]" />;
  }
  return (
    <ChevronsUpDown className="h-3.5 w-3.5 opacity-100" />
  );
}
export default function PropertiesTable({
  hideCheckbox = false,
  hidePagination = false,
  hideSearch = false,
  hideActions = false,
  hideSorting = false,
  pageSize = 8,
}: PropertiesTableProps = {}){
    const navigate = useNavigate();
    const [selectedPropertyId, setSelectedPropertyId] =
    useState<string | null>(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [pageIndex, setPageIndex] = useState(0);
    const [pageCursors, setPageCursors] = useState<Array<QueryDocumentSnapshot<DocumentData> | null>>([null]);
    const deletePropertyMutation = useDeletePropertyMutation();
    const lastDocument = pageCursors[pageIndex] ?? null;
    const {data, isPending, isError, error, isFetching} = usePropertiesQuery({
        pageSize,
        lastDocument
    });
    const columns = usePropertiesTableColumns({ hideCheckbox, hideActions }) as ColumnDef<typeof propertiesTableFeatures, Properties, any>[]
    function handleViewProperty(property: Properties) {
    void navigate({
      to: "/properties/$propertyId",
      params: { propertyId: property.id },
    });
  }
   function handleEditProperty(property: Properties) {
  setSelectedPropertyId(property.id);
  setIsUpdateOpen(true);
}
    const properties = data?.properties ?? [];
    const selectedProperty = properties.find((property) => property.id === selectedPropertyId) ?? null;
    async function handleDeleteProperty(property: Properties) {
    if (deletePropertyMutation.isPending) return;
    try {
      await deletePropertyMutation.mutateAsync(property.id);
      setPageIndex(0);
      setPageCursors([null]);
      if (selectedProperty?.id === property.id) {
        setSelectedPropertyId(null);
        setIsUpdateOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  }
    const table = useTable<typeof propertiesTableFeatures, Properties>({
     features: propertiesTableFeatures,
     columns,
     data: properties,
     globalFilterFn: "includesString",
     meta: {
      header: "Your properties",
      paragraph: "Manage your listings, update property details, and keep track of your accommodation on Lokestays.",
      onView: handleViewProperty,
      onEdit: handleEditProperty,
      onDelete: handleDeleteProperty
     }
    });
    function handleNextPage() {
    if (
      !data?.hasNextPage ||
      !data.lastDocument ||
      isFetching
    ) {
      return;
    }
    setPageCursors((previous) => {
      const next = previous.slice(0, pageIndex + 1);
      next[pageIndex + 1] = data.lastDocument;
      return next;
    });
    setPageIndex((previous) => previous + 1);
  }
  function handlePreviousPage() {
    if (pageIndex === 0 || isFetching) return;
    setPageIndex((previous) => previous - 1);
  }
  if (isPending) {
    return (
      <PropertiesTableSkeleton
        hideCheckbox={hideCheckbox}
        hideActions={hideActions}
        hidePagination={hidePagination}
        hideSearch={hideSearch}
        pageSize={pageSize}
      />
    );
  }
  if (isError) {
    return (
      <div className="p-4 text-destructive">
        {error.message || "Failed to load properties."}
      </div>
    );
  }
    return(
     <>
       {selectedProperty ? (
        <PropertiesUpdate
          key={selectedProperty.id}
          property={selectedProperty}
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
        />
      ) : null}
     {!hideSearch ? (
       <div className="w-full flex justify-end">
          <PropertiesToolbar table={table} />
       </div>
     ) : null}
     <div className="w-full overflow-x-auto rounded-lg border border-[#E5E7EB] dark:border-[#27272a]">
        <Table>
            <TableHeader>
             {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const canSorted = !hideSorting && header.column.getCanSort();
                  const ariaSort =
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : "none";
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={ariaSort}
                    >
                      {header.isPlaceholder
                        ? null
                        : canSorted ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="group flex select-none items-center gap-1.5 p-1"
                          >
                            <FlexRender header={header} />
                            <SortIcon direction={sorted} />
                          </button>
                        ) : (
                          <FlexRender header={header} />
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!hidePagination ? (
          <PropertiesTablePagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            rowCount={properties.length}
            hasNextPage={data?.hasNextPage ?? false}
            isFetching={isFetching}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        ) : null}
      </div>
      </>
      );
      }