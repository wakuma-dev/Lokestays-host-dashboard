import { useMutation } from "@tanstack/react-query";
import { updatePropertyDraft } from "../api/onboarding.api";
import type { UpdatePropertyDraft } from "../schema/update-property-draft.schema";
interface UpdatePropertyDraftVariables {
  readonly draftId: string;
  readonly data: UpdatePropertyDraft;
}

export function useUpdatePropertyDraft() {
  return useMutation<void, Error, UpdatePropertyDraftVariables>({
    mutationFn: ({ draftId, data }) =>
      updatePropertyDraft(draftId, data),
  });
}