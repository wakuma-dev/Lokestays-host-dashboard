import { z } from "zod";
const CloudinaryEnvSchema = z.object({
  VITE_CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, { message: "VITE_CLOUDINARY_CLOUD_NAME must not be empty" }),
  VITE_CLOUDINARY_UPLOAD_PRESET: z
    .string()
    .min(1, { message: "VITE_CLOUDINARY_UPLOAD_PRESET must not be empty" }),
});

function parseCloudinaryConfig() {
  const validationResult = CloudinaryEnvSchema.safeParse(import.meta.env);

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.format();
    console.error("[ConfigurationError] Invalid Cloudinary environment setup:", JSON.stringify(formattedErrors, null, 2));
    throw new Error("Fatal: Cloudinary environment configuration is invalid or missing required variables.");
  }

  return validationResult.data;
}

const env = parseCloudinaryConfig();

export const cloudinaryConfig = Object.freeze({
  cloudName: env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: env.VITE_CLOUDINARY_UPLOAD_PRESET,
  uploadUrl: `https://api.cloudinary.com/v1_1/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
} as const);

export type CloudinaryConfig = typeof cloudinaryConfig;