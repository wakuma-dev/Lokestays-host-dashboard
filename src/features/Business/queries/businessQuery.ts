import { useQuery, 
         type UseQueryResult } from "@tanstack/react-query";
import { getBusiness, 
         type BusinessApiError, 
         type BusinessDocument } from "../api/business.api";
export const businessKeys = {
  all: ["businesses"] as const,
  ownerScope: (ownerId: string | null) =>
    [...businessKeys.all, "owner", ownerId ?? "anonymous"] as const,
  details: (ownerId: string | null) =>
    [...businessKeys.ownerScope(ownerId), "details"] as const,
};
export function useBusinessQuery(ownerId: string | null): UseQueryResult<BusinessDocument | null, BusinessApiError>{
    const normalizedOwnerId = ownerId?.trim() || null;
    return useQuery<BusinessDocument | null, BusinessApiError>({
        queryKey: businessKeys.details(normalizedOwnerId),
        queryFn: getBusiness,
        enabled: normalizedOwnerId !== null,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1
    })
}
