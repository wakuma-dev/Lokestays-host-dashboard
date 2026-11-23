import { Timestamp } from "firebase/firestore";
export const BUSINESS_TYPE_VALUES = ["individual", "registered"] as const;
export type BusinessType = (typeof BUSINESS_TYPE_VALUES)[number];
export const LEGAL_STRUCTURES = [
  "sole_proprietorship",
  "partnership",
  "private_limited_company",
] as const;
export type LegalStructure = (typeof LEGAL_STRUCTURES)[number];
export const BUSINESS_STATUS_VALUES = ["draft", "complete", "pending_verification"] as const;
export type BusinessStatus = (typeof BUSINESS_STATUS_VALUES)[number];
export interface BusinessAddress {
    country: string;
    city: string;
    subCity: string;
    streetAddress: string;
}
export interface BusinessContact {
    email: string;
    phone: string;
}
export interface BusinessLegalDetails {
    legalStructure: LegalStructure | null;
    registeredName: string | null;
    registrationNumber: string | null;
}
export interface Business {
    ownerId: string;
    businessType: BusinessType;
    businessName: string;
    description: string;
    contact: BusinessContact;
    address: BusinessAddress;
    legal: BusinessLegalDetails;
    status: BusinessStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}