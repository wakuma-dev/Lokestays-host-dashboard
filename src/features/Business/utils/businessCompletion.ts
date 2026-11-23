import type { z } from "zod";
import { businessSchema, type BusinessDraftValues } from "@/features/Business";

export type BusinessCompletionError = z.ZodIssue;
export type ValidatedBusinessDraft = z.output<typeof businessSchema>;

export type BusinessCompletionResult =
  | Readonly<{
      isComplete: true;
      data: ValidatedBusinessDraft;
      errors: readonly [];
    }>
  | Readonly<{
      isComplete: false;
      data?: never;
      errors: readonly BusinessCompletionError[];
    }>;

const DRAFT_COMPLETION_OWNER_ID_SENTINEL = "__draft_completion_check__";

function evaluateBusinessDraftCompletion(
  draft: BusinessDraftValues,
  ownerId: string
): BusinessCompletionResult {
  const normalizedOwnerId = ownerId.trim();
  const candidatePayload: unknown = {
    ...draft,
    ownerId: normalizedOwnerId,
  };

  const parsedResult = businessSchema.safeParse(candidatePayload);

  if (!parsedResult.success) {
    return {
      isComplete: false,
      errors: parsedResult.error.issues,
    };
  }

  return {
    isComplete: true,
    data: parsedResult.data,
    errors: [],
  };
}

export function validateBusinessCompletionWithOwner(
  draft: BusinessDraftValues,
  ownerId: string
): BusinessCompletionResult {
  return evaluateBusinessDraftCompletion(draft, ownerId);
}

export function validateBusinessCompletion(
  draft: BusinessDraftValues
): BusinessCompletionResult {
  return evaluateBusinessDraftCompletion(draft, DRAFT_COMPLETION_OWNER_ID_SENTINEL);
}