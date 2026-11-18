export type UpdatePropertyParams = {
  propertyDraftId: string;
  structure?: string | null;
  privacyType?: string | null;
  guestCapacity?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  amenities?: string[];
  roomAmenities?: string[];
  pricePerNight?: number;
  status?: "draft" | "pending" | "approved" | "rejected";
};