import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import {PAYMENT_PROVIDERS, PAYMENT_STATUSES} from "../types/payment.types";
import { PROPERTY_AMENITIES, PROPERTY_STRUCTURES, ROOM_AMENITIES } from "../types/onboarding.types";
import { PRIVACY_TYPE_VALUES } from "../types/privacy.types";
const propertyStructureSchema = z.enum(PROPERTY_STRUCTURES);
const privacyTypeSchema = z.enum(PRIVACY_TYPE_VALUES);
const propertyAmenitySchema = z.enum(PROPERTY_AMENITIES);
const roomAmenitySchema = z.enum(ROOM_AMENITIES);
const paymentProviderSchema = z.enum(PAYMENT_PROVIDERS);
const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
const propertyPhotoSchema = z.object({
  id: z.string().trim().min(1),
  url: z.url(),
  publicId: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  format: z.string().trim().min(1),
  bytes: z.number().int().positive(),
  position: z.number().int().min(0),
});
export const propertyPhotosSchema = z
  .array(propertyPhotoSchema)
  .max(20, {
    message: "You can upload a maximum of 20 photos.",
  })
  .refine(
    (photos) =>
      new Set(photos.map((photo) => photo.id)).size === photos.length,
    {
      message: "Duplicate photos are not allowed.",
    },
  )
  .refine(
    (photos) =>
      new Set(photos.map((photo) => photo.position)).size ===
      photos.length,
    {
      message: "Photo positions must be unique.",
    },
  )
  .refine(
    (photos) =>
      new Set(photos.map((photo) => photo.publicId)).size ===
      photos.length,
    {
      message: "Duplicate uploaded images are not allowed.",
    },
  );
const amenitiesSchema = z
  .array(propertyAmenitySchema)
  .refine(
    (amenities) => new Set(amenities).size === amenities.length,
    {
      message: "Duplicate amenities are not allowed.",
    },
  );
export const roomAmenitiesSchema = z
  .array(roomAmenitySchema)
  .refine(
    (amenities) => new Set(amenities).size === amenities.length,
    {
      message: "Duplicate room amenities are not allowed.",
    },
  );
const propertyLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().min(1, {
  message: "Address is required.",
  }),
  city: z.string().trim().min(1, {
    message: "City is required.",
  }),
  neighborhood: z.string().trim(),
});
export const propertyPricingSchema = z.object({
  pricePerNight: z
    .number()
    .int()
    .min(1, {
      message: "Price must be greater than zero.",
    })
    .max(1_000_000_000),
  currency: z.literal("ETB"),
});
export const propertyStatusSchema = z.enum([
  "draft",
  "pending",
  "approved",
  "rejected",
]);
const firestoreTimestampSchema = z.union([
  z.instanceof(Timestamp),
  z.date(),
]);
export const propertyDraftSchema = z.object({
  hostId: z.string().trim().min(1),
  structure: propertyStructureSchema.nullable(),
  privacyType: privacyTypeSchema.nullable().default(null),
  location: propertyLocationSchema.nullable().default(null),
  guestCapacity: z
    .number()
    .int()
    .min(1)
    .max(16)
    .default(1),
  bedrooms: z
    .number()
    .int()
    .min(0)
    .max(50)
    .default(0),
  beds: z
    .number()
    .int()
    .min(0)
    .max(50)
    .default(0),
  bathrooms: z
    .number()
    .min(0)
    .max(50)
    .default(0),
  amenities: amenitiesSchema.default([]),
  roomAmenities: roomAmenitiesSchema.default([]),
  photos: propertyPhotosSchema.default([]),
  pricePerNight: z
    .number()
    .int()
    .min(0)
    .max(1_000_000_000)
    .default(0),
  currency: z.literal("ETB").default("ETB"),
  paymentProvider: paymentProviderSchema.nullable().default(null),
  paymentStatus: paymentStatusSchema.default("unpaid"),
  paymentReference: z.string().trim().min(1).nullable().default(null),
  currentStep: z.string().trim().min(1),
  status: propertyStatusSchema,
  submittedAt: firestoreTimestampSchema.nullable().default(null),
  createdAt: firestoreTimestampSchema,
  updatedAt: firestoreTimestampSchema,
});
export const propertySubmissionSchema = propertyDraftSchema.extend({
  structure: propertyStructureSchema,
  privacyType: privacyTypeSchema,
  location: propertyLocationSchema,
  photos: propertyPhotosSchema.min(5, {
    message: "At least 5 property photos are required.",
  }),
  pricePerNight: propertyPricingSchema.shape.pricePerNight,
  currency: z.literal("ETB"),
  paymentProvider: paymentProviderSchema,
  paymentStatus: z.literal("successful", {
    error: "Property listing payment must be completed.",
  }),
  paymentReference: z.string().trim().min(1, {
    message: "Verified payment reference is required.",
  }),
  status: z.literal("draft"),
  submittedAt: z.null(),
});
export type PropertyDraftInput = z.infer<
  typeof propertyDraftSchema
>;
export type PropertyDraft = PropertyDraftInput & {
  readonly id: string;
};
export type PropertySubmission = z.infer<
  typeof propertySubmissionSchema
>;