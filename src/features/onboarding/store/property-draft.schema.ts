import { z } from "zod";
import { Timestamp } from "firebase/firestore";
import { PROPERTY_STRUCTURES } from "../types/onboarding.types"
const propertyStructureSchema = z.enum(PROPERTY_STRUCTURES);
export const propertyDraftSchema = z.object({
  hostId: z.string().min(1, { message: "Host ID cannot be empty" }),
  structure: propertyStructureSchema.nullable(),
  currentStep: z.string().min(1, { message: "Current step cannot be empty" }),
  status: z.enum(["draft", "submitted"]),
  createdAt: z.union([z.instanceof(Timestamp), z.date()]),
  updatedAt: z.union([z.instanceof(Timestamp), z.date()]),
});

export type PropertyDraftInput = z.infer<typeof propertyDraftSchema>;

export type PropertyDraft = PropertyDraftInput & {
  readonly id: string;
};