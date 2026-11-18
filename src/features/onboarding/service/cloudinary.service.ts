import { z } from "zod";
import { cloudinaryConfig } from "../../../lib/cloudinary/Cloudinary.config";

const cloudinaryResponseSchema = z.object({
  secure_url: z.url(),
  public_id: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  format: z.string().min(1),
  bytes: z.number().int().positive(),
});

export interface PropertyPhoto {
  readonly id: string;
  readonly url: string;
  readonly publicId: string;
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly bytes: number;
  readonly position: number;
}

export async function uploadPropertyPhoto(
  file: File,
  position: number,
  signal?: AbortSignal,
): Promise<PropertyPhoto> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("folder", "lokestays/properties");

  const response = await fetch(cloudinaryConfig.uploadUrl, {
    method: "POST",
    body: formData,
    signal,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.status}`);
  }

  const responseData: unknown = await response.json();

  const result = cloudinaryResponseSchema.parse(responseData);

  return {
    id: crypto.randomUUID(),
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    position,
  };
} 