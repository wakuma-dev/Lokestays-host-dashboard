import { z } from "zod"
export const updatePropertySchema = z.object({
  structure: z.string().min(1, "Structure is required"),
  privacyType: z.string().min(1, "Privacy type is required"),
  pricePerNight: z.number().int().nonnegative("Price must be at least zero"),
  guestCapacity: z.number().int().min(1),
  bedrooms: z.number().int().min(0),
  beds: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
});
export type UpdatePropertyFormValues = z.infer<typeof updatePropertySchema>;