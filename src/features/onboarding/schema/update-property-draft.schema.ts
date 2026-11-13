import { z } from "zod";

import { PROPERTY_STRUCTURES } from "../types/onboarding.types";
import { PRIVACY_TYPE_VALUES } from "../types/privacy.types";

const propertyLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  neighborhood: z.string().trim(),
});

export const updatePropertyDraftSchema = z
  .object({
    structure: z.enum(PROPERTY_STRUCTURES).nullable().optional(),

    privacyType: z.enum(PRIVACY_TYPE_VALUES).nullable().optional(),

    location: propertyLocationSchema.nullable().optional(),

    currentStep: z
      .string()
      .trim()
      .min(1, { message: "Current step cannot be empty" })
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one property field must be provided for update.",
  });

export type UpdatePropertyDraft = z.infer<
  typeof updatePropertyDraftSchema
>;