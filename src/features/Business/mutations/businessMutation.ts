import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationResult,
} from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import {
  completeBusiness,
  createBusiness,
  deleteBusiness,
  saveBusinessDraft,
  updateBusiness,
  type BusinessApiError,
  type BusinessDocument,
} from "../api/business.api";
import { businessKeys } from "../queries/businessQuery";
import type { BusinessDraftValues } from "../schema/businessDraftSchema";
export type BusinessMutations = Readonly<{
  createMutation: UseMutationResult<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >;
  updateMutation: UseMutationResult<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >;
  saveDraftMutation: UseMutationResult<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >;
  completeMutation: UseMutationResult<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >;
  deleteMutation: UseMutationResult<
    void,
    BusinessApiError,
    void,
    BusinessMutationContext
  >;
}>;
type BusinessMutationContext = Readonly<{
  detailsQueryKey: QueryKey | null;
  previousBusiness: BusinessDocument | null | undefined;
}>;
function buildOptimisticBusinessDocument(
  existing: BusinessDocument,
  draftPayload: BusinessDraftValues,
  nextStatus?: BusinessDocument["status"]
): BusinessDocument {
  return {
    ...existing,
    ...draftPayload,
    ownerId: existing.ownerId,
    status: nextStatus ?? existing.status,
    createdAt: existing.createdAt,
    updatedAt: Timestamp.now(),
  };
}
export function useBusinessMutations(
  ownerId: string | null = null
): BusinessMutations {
  const queryClient = useQueryClient();
  const normalizedOwnerId = ownerId?.trim() || null;
  const detailsQueryKey: QueryKey | null =
    normalizedOwnerId !== null
      ? businessKeys.details(normalizedOwnerId)
      : null;
  const invalidateBusinessScope = async (): Promise<void> => {
    const scopeKey =
      normalizedOwnerId !== null
        ? businessKeys.ownerScope(normalizedOwnerId)
        : businessKeys.all;
    await queryClient.invalidateQueries({
      queryKey: scopeKey,
    });
  };
  const prepareOptimisticDraftPatch = async (
    payload: BusinessDraftValues,
    nextStatus?: BusinessDocument["status"]
  ): Promise<BusinessMutationContext> => {
    if (!detailsQueryKey) {
      return {
        detailsQueryKey: null,
        previousBusiness: undefined,
      };
    }
    await queryClient.cancelQueries({ queryKey: detailsQueryKey });
    const previousBusiness =
      queryClient.getQueryData<BusinessDocument | null>(detailsQueryKey);
    if (previousBusiness) {
      queryClient.setQueryData<BusinessDocument | null>(
        detailsQueryKey,
        buildOptimisticBusinessDocument(previousBusiness, payload, nextStatus)
      );
    }
    return {
      detailsQueryKey,
      previousBusiness,
    };
  };
  const prepareOptimisticDelete = async (): Promise<BusinessMutationContext> => {
    if (!detailsQueryKey) {
      return {
        detailsQueryKey: null,
        previousBusiness: undefined,
      };
    }
    await queryClient.cancelQueries({ queryKey: detailsQueryKey });
    const previousBusiness =
      queryClient.getQueryData<BusinessDocument | null>(detailsQueryKey);
    queryClient.setQueryData<BusinessDocument | null>(detailsQueryKey, null);
    return {
      detailsQueryKey,
      previousBusiness,
    };
  };
  const rollbackOptimisticChange = (
    _error: BusinessApiError,
    _variables: unknown,
    context: BusinessMutationContext | undefined
  ): void => {
    if (!context?.detailsQueryKey || context.previousBusiness === undefined) {
      return;
    }
    queryClient.setQueryData<BusinessDocument | null>(
      context.detailsQueryKey,
      context.previousBusiness
    );
  };
  const createMutation = useMutation<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >({
    mutationFn: (payload: BusinessDraftValues) => createBusiness(payload),
    onSettled: invalidateBusinessScope,
  });
  const updateMutation = useMutation<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >({
    mutationFn: (payload: BusinessDraftValues) => updateBusiness(payload),
    onMutate: (payload) => prepareOptimisticDraftPatch(payload),
    onError: rollbackOptimisticChange,
    onSettled: invalidateBusinessScope,
  });
  const saveDraftMutation = useMutation<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >({
    mutationFn: (payload: BusinessDraftValues) => saveBusinessDraft(payload),
    onMutate: (payload) => prepareOptimisticDraftPatch(payload),
    onError: rollbackOptimisticChange,
    onSettled: invalidateBusinessScope,
  });
  const completeMutation = useMutation<
    void,
    BusinessApiError,
    BusinessDraftValues,
    BusinessMutationContext
  >({
    mutationFn: (payload: BusinessDraftValues) => completeBusiness(payload),
    onMutate: (payload) => prepareOptimisticDraftPatch(payload, "complete"),
    onError: rollbackOptimisticChange,
    onSettled: invalidateBusinessScope,
  });
  const deleteMutation = useMutation<
    void,
    BusinessApiError,
    void,
    BusinessMutationContext
  >({
    mutationFn: () => deleteBusiness(),
    onMutate: prepareOptimisticDelete,
    onError: rollbackOptimisticChange,
    onSettled: invalidateBusinessScope,
  });
  return {
    createMutation,
    updateMutation,
    saveDraftMutation,
    completeMutation,
    deleteMutation,
  };
}