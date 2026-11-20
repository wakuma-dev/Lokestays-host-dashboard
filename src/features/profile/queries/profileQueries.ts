import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/features/profile/api/profile.api";
export function useProfileQuery(uId: string){
    const normalizedUserId = uId.trim();
    return useQuery({
     queryKey: ["users", "profile", normalizedUserId],
     queryFn: () => getUserProfile(normalizedUserId),
     enabled: normalizedUserId.length > 0,
     staleTime: 1000 * 60 * 5,
     gcTime: 1000 * 60 * 10,
     refetchOnWindowFocus: false
    });
}