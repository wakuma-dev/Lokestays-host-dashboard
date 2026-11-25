import { z } from "zod";
import { Timestamp } from "firebase/firestore";
const serializedTimestampSchema = z.object({
  seconds: z.number().int(),
  nanoseconds: z.number().int(),
});
const firestoreTimestampSchema = z.union([
  z.instanceof(Timestamp),
  z.date(),
  serializedTimestampSchema,
  z.string().datetime(), 
]).transform((value) => {
  if (value instanceof Timestamp) {
    return value;
  }

  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }

  if (typeof value === "string") {
    return Timestamp.fromDate(new Date(value));
  }

  return new Timestamp(value.seconds, value.nanoseconds);
});
export const propertyHostSchema = z.object({
  id: z.string().min(1, "Host Id is required"),
  fullName: z.string().trim().min(1, "Host name is required")
});
const propertyPhotoSchema = z.object({
  id: z.string().min(1, "Photo ID is required"),
  url: z.string().url("Invalid photo URL format"),
  publicId: z.string().min(1, "Cloudinary publicId is required"),
  width: z.number().int().positive("Width must be a positive integer"),
  height: z.number().int().positive("Height must be a positive integer"),
  format: z.string(),
  bytes: z.number().int().positive("File size must be positive"),
  position: z.number().int().nonnegative("Position cannot be negative"),
})
const propertyLocationSchema = z.object({
  latitude: z.number().min(-90, "Latitude must be >= -90").max(90, "Latitude must be <= 90"),
  longitude: z.number().min(-180, "Longitude must be >= -180").max(180, "Longitude must be <= 180"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  neighborhood: z.string().min(2, "Neighborhood is required")
});
export const propertiesSchema = z.object({
  id: z.string().min(1, "Property ID is required"),
  hostId: z.string().min(1, "Host ID is required"),
  structure: z.string().nullable(),
  privacyType: z.string().nullable(),
 location: propertyLocationSchema.nullable(),
 guestCapacity: z.number().int().positive("Capacity must be at least 1"),
  bedrooms: z.number().int().nonnegative("Bedrooms cannot be negative"),
  beds: z.number().int().nonnegative("Beds cannot be negative"),
  bathrooms: z.number().nonnegative("Bathrooms cannot be negative").multipleOf(0.5),
  amenities: z.array(z.string()).default([]),
  roomAmenities: z.array(z.string()).default([]),
  photos: z.array(propertyPhotoSchema).max(50, "Maximum 50 photos allowed per property"),
  pricePerNight: z.number().int().nonnegative("Price per night cannot be negative"),
  currency: z.literal("ETB"),
  currentStep: z.string(),
  status: z.enum([
    "draft",
    "pending",
    "approved",
    "rejected",
  ]),
  submittedAt: firestoreTimestampSchema.nullable(),
  createdAt: firestoreTimestampSchema,
  updatedAt: firestoreTimestampSchema,
});
export type Properties = z.infer<typeof propertiesSchema>
