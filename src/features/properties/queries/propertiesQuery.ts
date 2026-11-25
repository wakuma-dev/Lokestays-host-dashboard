import { useQuery } from "@tanstack/react-query";
import { getAllProperties, getPropertyById } from "@/features/properties"
import type { GetAllProperties } from "../types/properties.types";
export function usePropertiesQuery({pageSize, lastDocument}: GetAllProperties){
    return useQuery({
        queryKey: ["propertyDrafts", "list", pageSize, lastDocument?.id ?? null],
        queryFn: () => {
            return getAllProperties({pageSize, lastDocument})
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
    });
}
export function usePropertyQuery(propertyId: string){
    const normalizedPropertyId = propertyId.trim();
    return useQuery({
         queryKey: ["propertyDrafts", "details", normalizedPropertyId],
         queryFn: () => {
            return getPropertyById(normalizedPropertyId)
         },
         staleTime: 1000 * 60 * 5,
         gcTime: 1000 * 60 * 10,
         refetchOnWindowFocus: false,
         retry: false
    });
}