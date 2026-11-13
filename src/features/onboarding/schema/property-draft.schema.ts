import { z } from "zod";
import { Timestamp } from "firebase/firestore";

import { PROPERTY_STRUCTURES } from "../types/onboarding.types";
import { PRIVACY_TYPE_VALUES } from "../types/privacy.types";

const propertyStructureSchema = z.enum(PROPERTY_STRUCTURES);
const privacyTypeSchema = z.enum(PRIVACY_TYPE_VALUES);

const propertyLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  neighborhood: z.string().trim(),
});

export const propertyDraftSchema = z.object({
  hostId: z.string().trim().min(1),
  structure: propertyStructureSchema.nullable(),
  privacyType: privacyTypeSchema.nullable().default(null),
  location: propertyLocationSchema.nullable().default(null),
  currentStep: z.string().trim().min(1),
  status: z.enum(["draft", "submitted"]),
  createdAt: z.union([z.instanceof(Timestamp), z.date()]),
   updatedAt: z.union([z.instanceof(Timestamp), z.date()]),
});

export type PropertyDraftInput = z.infer<typeof propertyDraftSchema>;

export type PropertyDraft = PropertyDraftInput & {
  readonly id: string;
};