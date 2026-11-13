import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import {
  getPropertyDraftsByHostId,
  getPropertyDraftById,
  updatePropertyDraft,
  type PropertyDraftWithId,
} from "../api/onboarding.api";

import type { UpdatePropertyDraft } from "../store/update-property-draft.schema";

export const propertyDraftKeys = {
  all: ["property-drafts"] as const,
  byHost: (hostId: string) => [...propertyDraftKeys.all, "host", hostId] as const,
  byId: (draftId: string, hostId: string) => [...propertyDraftKeys.all, "detail", hostId, draftId] as const,
} as const;

export interface UpdateDraftVariables {
  readonly draftId: string;
  readonly hostId: string;
  readonly data: UpdatePropertyDraft;
}

export function usePropertyDrafts(
  hostId: string
): UseQueryResult<PropertyDraftWithId[], Error> {
  return useQuery({
    queryKey: propertyDraftKeys.byHost(hostId),
    queryFn: () => getPropertyDraftsByHostId(hostId),
    enabled: hostId.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}

export function usePropertyDraft(
  draftId: string,
  hostId: string
): UseQueryResult<PropertyDraftWithId | null, Error> {
  return useQuery({
    queryKey: propertyDraftKeys.byId(draftId, hostId),
    queryFn: () => getPropertyDraftById(draftId, hostId),
    enabled: draftId.trim().length > 0 && hostId.trim().length > 0,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

/**
 * @name useUpdatePropertyDraft
 * @description Enterprise-grade mutation hook incorporating optimistic updates, 
 * cancellation guards against race conditions, and automatic cache rollback on failure.
 */
export function useUpdatePropertyDraft(): UseMutationResult<
  void,
  Error,
  UpdateDraftVariables,
  { readonly previousDraft: PropertyDraftWithId | null | undefined }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["property-drafts", "update"],

    mutationFn: ({ draftId, data }) => updatePropertyDraft(draftId, data),

    onMutate: async ({ draftId, hostId, data }) => {
      // 1. Cancel outgoing refetches to prevent race conditions from overwriting optimistic state
      await queryClient.cancelQueries({ queryKey: propertyDraftKeys.byId(draftId, hostId) });
      await queryClient.cancelQueries({ queryKey: propertyDraftKeys.byHost(hostId) });

      // 2. Snapshot the previous state for transactional rollback
      const previousDraft = queryClient.getQueryData<PropertyDraftWithId | null>(
        propertyDraftKeys.byId(draftId, hostId)
      );

      // 3. Optimistically update the single draft cache for instant UI responsiveness
      if (previousDraft) {
        queryClient.setQueryData<PropertyDraftWithId | null>(
          propertyDraftKeys.byId(draftId, hostId),
          (currentDraft) => {
            if (!currentDraft) {
              return currentDraft;
            }

            return {
              ...currentDraft,
              ...(data as Partial<PropertyDraftWithId>),
              updatedAt: new Date() as any,
            } as PropertyDraftWithId;
          }
        );
      }

      return { previousDraft };
    },

    onError: (_err, variables, context) => {
      // Rollback cache state if the network mutation fails
      if (context?.previousDraft !== undefined) {
        queryClient.setQueryData(
          propertyDraftKeys.byId(variables.draftId, variables.hostId),
          context.previousDraft
        );
      }
    },

    onSettled: async (_, __, variables) => {
      // Re-synchronize authoritative server state across host lists and detail views
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: propertyDraftKeys.byHost(variables.hostId),
        }),
        queryClient.invalidateQueries({
          queryKey: propertyDraftKeys.byId(variables.draftId, variables.hostId),
        }),
      ]);
    },
  });
}