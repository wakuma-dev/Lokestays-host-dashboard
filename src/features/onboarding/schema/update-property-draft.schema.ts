import { z } from "zod";
import {
  PROPERTY_AMENITIES,
  PROPERTY_STRUCTURES,
  ROOM_AMENITIES,
} from "../types/onboarding.types";

import { PRIVACY_TYPE_VALUES } from "../types/privacy.types";
import { propertyPhotosSchema } from "./property-draft.schema";

const propertyStructureSchema = z.enum(PROPERTY_STRUCTURES);
const privacyTypeSchema = z.enum(PRIVACY_TYPE_VALUES);
const propertyAmenitySchema = z.enum(PROPERTY_AMENITIES);
const roomAmenitySchema = z.enum(ROOM_AMENITIES);
const propertyLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  neighborhood: z.string().trim(),
});

export const updatePropertyDraftSchema = z
  .object({
    structure: propertyStructureSchema.nullable().optional(),
    privacyType: privacyTypeSchema.nullable().optional(),
    location: propertyLocationSchema.nullable().optional(),
    guestCapacity: z.number().int().min(1).max(16).optional(),
    bedrooms: z.number().int().min(0).max(50).optional(),
    beds: z.number().int().min(0).max(50).optional(),
    bathrooms: z.number().min(0).max(50).optional(),
    amenities: z.array(propertyAmenitySchema).optional(),
    roomAmenities: z.array(roomAmenitySchema).optional(),
    photos: propertyPhotosSchema.optional(),
    pricePerNight: z.number().int().min(1).max(1_000_000_000).optional(),
    currency: z.literal("ETB").optional(),
    currentStep: z.string().trim().min(1).optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one property field must be provided.",
    },
  );

export type UpdatePropertyDraft = z.infer<
  typeof updatePropertyDraftSchema
>;