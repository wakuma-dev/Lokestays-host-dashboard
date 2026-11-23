import { z } from "zod";
import {BUSINESS_TYPE_VALUES, LEGAL_STRUCTURES} from "../types/business.types";
import {
  businessNameSchema,
  emailSchema,
  phoneSchema,
} from "./businessSchema";
const optionalDraftField = <TSchema extends z.ZodType<string>>(
  schema: TSchema
) => z.union([z.literal(""), schema]);
const draftAddressSchema = z
  .object({
    country: z.string().trim().max(100),
    city: z.string().trim().max(100),
    subCity: z.string().trim().max(100),
    streetAddress: z.string().trim().max(150),
  })
  .strict();
const draftLegalSchema = z
  .object({
    legalStructure: z.enum(LEGAL_STRUCTURES).nullable(),
    registeredName: z.string().trim().max(150),
    registrationNumber: z.string().trim().max(150),
  })
  .strict();
const draftContactSchema = z
  .object({
    email: optionalDraftField(emailSchema),
    phone: optionalDraftField(phoneSchema),
  })
  .strict();
const draftDescriptionSchema = z
  .string()
  .trim()
  .max(500, "Description cannot exceed 500 characters.");
export const businessDraftSchema = z
  .object({
    businessType: z.enum(BUSINESS_TYPE_VALUES),
    businessName: optionalDraftField(businessNameSchema),
    description: draftDescriptionSchema,
    contact: draftContactSchema,
    address: draftAddressSchema,
    legal: draftLegalSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    const isIndividual = data.businessType === "individual";
    if (isIndividual) {
      if (data.legal.legalStructure !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["legal", "legalStructure"],
          message: "Individual businesses cannot set a legal structure.",
        });
      }
      if (data.legal.registeredName.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["legal", "registeredName"],
          message: "Individual businesses cannot set a registered name.",
        });
      }
      if (data.legal.registrationNumber.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["legal", "registrationNumber"],
          message: "Individual businesses cannot set a registration number.",
        });
      }
    }
  });
export type BusinessDraftValues = z.infer<typeof businessDraftSchema>;