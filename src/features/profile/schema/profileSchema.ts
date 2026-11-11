import { z } from "zod";

// --- Domain Constants ---
// 
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;

export const profileSchema = z.object({
  uid: z.string().min(1, { message: "UID is required" }),
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(MAX_NAME_LENGTH, { message: `Full name cannot exceed ${MAX_NAME_LENGTH} characters` })
    .trim(),
  email: z
    .string()
    .email({ message: "Invalid email address format" })
    .max(MAX_EMAIL_LENGTH, { message: `Email cannot exceed ${MAX_EMAIL_LENGTH} characters` })
    .toLowerCase()
    .trim(),
});

export const updateProfileSchema = profileSchema
  .pick({
    fullName: true,
    email: true,
  })
  .partial();


