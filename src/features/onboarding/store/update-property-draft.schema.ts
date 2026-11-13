import { z } from "zod";
export const updatePropertyDraftSchema = z
  .object({
    structure: z.string().nullable().optional(),
    currentStep: z.string().trim().min(1, { message: "Current step cannot be empty" }).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one property field must be provided for update.",
  });

export type UpdatePropertyDraft = z.infer<typeof updatePropertyDraftSchema>;