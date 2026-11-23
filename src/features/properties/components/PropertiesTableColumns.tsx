import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Properties } from "../types/properties.types";
import { propertiesTableFeatures } from "../types/propertiesTable.config";
import {
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PropertiesStatusBadge from "./PropertiesStatusBadge";
const columnHelper = createColumnHelper<typeof propertiesTableFeatures, Properties>();
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
export default function usePropertiesTableColumns(){
    return useMemo(() => [
     columnHelper.display({
      id: "select",
      header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(!!checked)
            }
            aria-label="Select all properties"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) =>
              row.toggleSelected(!!checked)
            }
            aria-label={`Select ${row.original.structure ?? "property"}`}
          />
        ),
        enableSorting: false,
     }),
     columnHelper.accessor("structure", {
      id: "structure",
      header: "Property Name",
      cell: (info) => info.getValue() || "Untitled property",
      enableGlobalFilter: true,
      sortFn: "text"
     }),
     columnHelper.accessor((property) => property.location?.city ?? "", {
      id: "location",
      header: "Location",
      cell: (info) => info.getValue() || "—",
      enableGlobalFilter: true,
      sortFn: "text"
     }),
     columnHelper.accessor("status", {
     header: "Status",
     cell: ({getValue, row, table}) => (
      <button 
        type="button"
        className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Edit status for ${row.original.structure ?? "property"}`}
            onClick={() => table.options.meta?.onEdit?.(row.original)}
          >
        <PropertiesStatusBadge status={getValue()} />
        </button>
     )
     }),
     columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => {
          const value = info.getValue();
         if (!value || typeof value.toDate !== "function") {
            return "—";
          }
          return dateFormatter.format(value.toDate());
        },
        sortFn: "datetime",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
          const property = row.original;
          const tableMeta = table.options.meta;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Actions for ${property.structure ?? "property"}`}
                    className="border-transparent bg-transparent"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent
                align="end"
                className="min-w-40"
              >
                <DropdownMenuItem
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={() => tableMeta?.onView?.(property)}
                >
                  <Eye className="h-4 w-4 shrink-0" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={() => tableMeta?.onEdit?.(property)}
                >
                  <Pencil className="h-4 w-4 shrink-0" />
                  Edit status
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 whitespace-nowrap text-destructive"
                  onClick={() => tableMeta?.onDelete?.(property)}
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  Delete property
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    [],
  );
}
