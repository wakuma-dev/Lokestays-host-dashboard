import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "@/features/properties"
import type { GetAllProperties } from "../types/properties.types";
export function usePropertiesQuery({pageSize, lastDocument}: GetAllProperties){
    return useQuery({
        queryKey: ["propertyDrafts", pageSize, lastDocument?.id ?? null],
        queryFn: () => {
            return getAllProperties({pageSize, lastDocument})
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
    });
}