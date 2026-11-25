import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProperty, getAllProperties, updateProperty } from "@/features/properties";
import type { QueryKey } from "@tanstack/react-query";
import type { UpdatePropertyParams } from "../types/UpdatePropery.types";
type PropertiesPage = Awaited<ReturnType<typeof getAllProperties>>;
type PreviousPropertiesPages = Array<[QueryKey, PropertiesPage | undefined]>;
export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    UpdatePropertyParams,
    { previousPages: PreviousPropertiesPages }
  >({
    mutationKey: ["propertyDrafts", "update"],
    mutationFn: async (params) => {
      await updateProperty(params);
    },
     onMutate: async (params) => {
      await queryClient.cancelQueries({
        queryKey: ["propertyDrafts", "list"],
      });
      const previousPages =
        queryClient.getQueriesData<PropertiesPage>({
          queryKey: ["propertyDrafts", "list"],
        });
      const { propertyDraftId, ...updates } = params;
      for (const [queryKey, page] of previousPages) {
        if (!page) continue;
        queryClient.setQueryData<PropertiesPage>(queryKey, {
          ...page,
          properties: page.properties.map((property) =>
            property.id === propertyDraftId
              ? {
                  ...property,
                  ...updates,
                }
              : property,
          ),
        });
      }
      return { previousPages };
    },
    onError: (_error, _params, context) => {
      for (const [queryKey, page] of context?.previousPages ?? []) {
        if (page) {
          queryClient.setQueryData(queryKey, page);
        }
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["propertyDrafts"],
      });
    },
  });
}
export function useDeletePropertyMutation() {
  const queryClient = useQueryClient();
   return useMutation<void, Error, string, { previousPages: PreviousPropertiesPages }>({
    mutationKey: ["propertyDrafts", "delete"],
    mutationFn: (propertyDraftId) => deleteProperty(propertyDraftId),
    onMutate: async (propertyDraftId) => {
      await queryClient.cancelQueries({
    queryKey: ["propertyDrafts", "list"],
      });
      const previousPages = queryClient.getQueriesData<PropertiesPage>({
    queryKey: ["propertyDrafts", "list"],
      });
      for (const [queryKey, page] of previousPages) {
    if (!page) continue;
    queryClient.setQueryData<PropertiesPage>(queryKey, {
      ...page,
      properties: page.properties.filter(
        (property) => property.id !== propertyDraftId,
      ),
    });
      }
      return { previousPages };
    },
    onError: (_error, _propertyDraftId, context) => {
      for (const [queryKey, page] of context?.previousPages ?? []) {
        if (page) {
          queryClient.setQueryData(queryKey, page);
        }
      }
    },
  onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["propertyDrafts"],
      });
    },
  });
}