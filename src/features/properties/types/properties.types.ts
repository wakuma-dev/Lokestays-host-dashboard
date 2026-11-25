import { type DocumentData, 
         Timestamp,
         QueryDocumentSnapshot
 } from "firebase/firestore";
import type { PaymentProvider } from "@/features/onboarding/types/payment.types";
export interface GetAllProperties {
    pageSize: number;
    lastDocument: QueryDocumentSnapshot<DocumentData> | null
}
export const PROPERTIES_STATUS = [
   "draft",
  "pending",
  "approved",
  "rejected",
] as const;
export type PropertiesStatus = (typeof PROPERTIES_STATUS)[number];
export interface Properties {
  id: string;
  hostId: string;
  structure: string | null;
  privacyType: string | null;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    neighborhood: string;
  } | null;
  guestCapacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  roomAmenities: string[];
  photos: {
    id: string;
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    position: number;
  }[];
  pricePerNight: number;
  currency: "ETB";
  paymentProvider: PaymentProvider | null;
  paymentAccount: string | null;
  currentStep: string;
  status: PropertiesStatus;
  submittedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface PropertyHost {
  id: string;
  fullName: string;
}