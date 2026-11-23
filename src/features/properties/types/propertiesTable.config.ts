import { tableFeatures,
         globalFilteringFeature,
         rowSortingFeature,
         rowSelectionFeature,
         rowPaginationFeature,
         createSortedRowModel,
         createFilteredRowModel,
         metaHelper,
         columnFilteringFeature,
         columnVisibilityFeature,
         sortFn_text,
         sortFn_alphanumeric,
         sortFn_datetime,
         filterFn_includesString
 } from "@tanstack/react-table";
import type { PropertiesTableMeta } from "./propertiesTable.meta";
export const propertiesTableFeatures = tableFeatures({
    rowSortingFeature,
    rowSelectionFeature,
    columnVisibilityFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    rowPaginationFeature,
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns: {
        text: sortFn_text,
        alphanumeric: sortFn_alphanumeric,
        datetime: sortFn_datetime,
    },
    filterFns: {
        includesString: filterFn_includesString,
    },
    tableMeta: metaHelper<PropertiesTableMeta>(),
});
export type PropertiesTableFeatures = typeof propertiesTableFeatures;