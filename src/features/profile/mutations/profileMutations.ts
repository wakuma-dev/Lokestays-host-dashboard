import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userUpdateProfile, getUserProfile, type ProfileUpdate } from "@/features/profile";
type UserProfile = Awaited<ReturnType<typeof getUserProfile>>;
type UserProfileContext = {
    previousProfile: UserProfile | undefined;
}
export function useUpdateProfileMutation(uId: string){
    const queryClient = useQueryClient();
    const normalizedUserUid = uId.trim();
    const profileQueryKey = ["users", "profile", normalizedUserUid] as const;
    return useMutation<void, Error, ProfileUpdate, UserProfileContext>({
    mutationKey: ["users", "update", normalizedUserUid],
    mutationFn: async (profile) => {
        if(!normalizedUserUid){
            throw new Error("User Id is required to update");
        }
        await userUpdateProfile(normalizedUserUid, profile)
    },
    onMutate: async (profile) => {
        await queryClient.cancelQueries({
            queryKey: profileQueryKey,
            exact: true
        });
        const previousProfile = queryClient.getQueryData<UserProfile>(profileQueryKey);
        if(previousProfile){
            queryClient.setQueryData<UserProfile>(
                profileQueryKey,
                {
                    ...previousProfile,
                    ...profile
                }
            );
        }
        return { previousProfile }
    },
    onError: (_error, _profile, context) => {
     if(context?.previousProfile){
        queryClient.setQueryData(
            profileQueryKey,
            context.previousProfile
        )
     }
    },
    onSettled: async () => {
        await queryClient.invalidateQueries({
            queryKey: ["users"]
        });
    }
    });
}