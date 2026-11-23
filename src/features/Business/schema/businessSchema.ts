import { z } from "zod";
import {BUSINESS_TYPE_VALUES, LEGAL_STRUCTURES} from "../types/business.types";
export const businessNameSchema = z
  .string()
  .trim()
  .min(2, "Business name must contain at least 2 characters.")
  .max(100, "Business name cannot exceed 100 characters.");
export const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description cannot exceed 500 characters.")
  .default("");
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid business email address.")
  .max(254, "Email address is too long.");
export const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{6,14}$/,
    "Enter a valid international phone number.")
  .min(7, "Enter a valid phone number.")
  .max(20, "Phone number is too long.");
const nullableTrimmedFieldSchema = z
  .string()
  .trim()
  .max(150, "Value cannot exceed 150 characters.")
  .nullable();
const addressSchema = z
  .object({
    country: z.string().trim().min(1, "Country is required.").max(100),
    city: z.string().trim().min(1, "City is required.").max(100),
    subCity: z.string().trim().min(1, "Sub-city is required.").max(100),
    streetAddress: z
      .string()
      .trim()
      .max(150, "Street address cannot exceed 150 characters.")
      .default(""),
  })
  .strict();
const contactSchema = z
  .object({
    email: emailSchema,
    phone: phoneSchema,
  })
  .strict();
const legalSchema = z
  .object({
    legalStructure: z.enum(LEGAL_STRUCTURES).nullable(),
    registeredName: nullableTrimmedFieldSchema,
    registrationNumber: nullableTrimmedFieldSchema,
  })
  .strict();
export const businessSchema = z
  .object({
    ownerId: z.string().trim().min(1, "Owner ID is required.").max(128),
    businessType: z.enum(BUSINESS_TYPE_VALUES),
    businessName: businessNameSchema,
    description: descriptionSchema,
    contact: contactSchema,
    address: addressSchema,
    legal: legalSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    const isIndividual = data.businessType === "individual";
    const isRegistered = data.businessType === "registered";
    if (isIndividual) {
      if (data.legal.legalStructure !== null) {
        ctx.addIssue({
          code: "custom",
          path: ["legal", "legalStructure"],
          message: "Individual businesses cannot set a legal business structure.",
        });
      }
      if (data.legal.registeredName !== null && data.legal.registeredName.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["legal", "registeredName"],
          message: "Individual businesses cannot set a registered business name.",
        });
      }
      if (
        data.legal.registrationNumber !== null &&
        data.legal.registrationNumber.length > 0
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["legal", "registrationNumber"],
          message: "Individual businesses cannot set a registration number.",
        });
      }
    }
    if (isRegistered) {
      if (data.legal.legalStructure === null) {
        ctx.addIssue({
          code: "custom",
          path: ["legal", "legalStructure"],
          message: "Select a legal business structure.",
        });
      }
      if (!data.legal.registeredName || data.legal.registeredName.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["legal", "registeredName"],
          message: "Registered business name is required.",
        });
      }
      if (
        !data.legal.registrationNumber ||
        data.legal.registrationNumber.length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["legal", "registrationNumber"],
          message: "Registration number is required.",
        });
      }
    }
  });
export type BusinessFormValues = z.infer<typeof businessSchema>;