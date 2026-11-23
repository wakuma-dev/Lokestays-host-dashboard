import type { Timestamp } from "firebase/firestore";
export type  OnboardingLink = {
    readonly path: string;
    readonly stepNumber: number;
    readonly title: string;
}
export type PropertyDrafts = {
    readonly id: string;
    readonly hostId: string;
    readonly structure: PropertyStructure | null;
    readonly currentStep: string;
    readonly guestCapacity: number;
    readonly bedrooms: number;
    readonly beds: number;
    readonly bathrooms: number;
    readonly status: "draft" | "submitted";
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}
export const PROPERTY_STRUCTURES = [
  "House",
  "Apartment",
  "Barn",
  "Bed & breakfast",
  "Boat",
  "Cabin",
  "Camper/RV",
  "Casa particular",
  "Castle",
  "Cave",
  "Container",
  "Cycladic home",
  "Dammuso",
  "Dome",
  "Earth home",
  "Farm",
  "Guesthouse",
  "Hotel",
  "Houseboat",
  "Minsu",
  "Riad",
  "Ryokan",
  "Shepherd’s hut",
  "Tent",
  "Tiny home",
  "Tower",
  "Treehouse",
  "Trullo",
  "Windmill",
  "Yurt",
] as const;
export type PropertyStructure = (typeof PROPERTY_STRUCTURES)[number];
export const ROOM_AMENITIES = [
"Air conditioning",
"Dryer",
"Essentials",
"Towels, bed sheets, soap, and toilet paper",
"Heating",
"Hot water",
"Kitchen",
"Refrigerator",
"TV",
"Washer",
"Wifi",
"Coffee maker",
"Cooking basics",
"Pots and pans, oil, salt and pepper",
"Hair dryer",
"Hangers",
"Iron",
"Shampoo",
"Crib",
"Dedicated workspace",
"EV charger",
"Free parking on premises",
"Gym",
"Hot tub",
"Indoor fireplace",
"Outdoor furniture",
"Pool",
"Beach access",
"Waterfront",
"Carbon monoxide alarm",
"Smoke alarm"
] as const;
export type RoomAmenities = (typeof ROOM_AMENITIES)[number];
export const PROPERTY_AMENITIES = [
  "air-conditioning",
  "dryer",
  "essentials",
  "heating",
  "hot-water",
  "kitchen",
  "refrigerator",
  "tv",
  "washer",
  "wifi",
  "coffee-maker",
  "cooking-basics",
  "hair-dryer",
  "hangers",
  "iron",
  "shampoo",
  "crib",
  "dedicated-workspace",
  "ev-charger",
  "free-parking",
  "gym",
  "hot-tub",
  "indoor-fireplace",
  "outdoor-furniture",
  "pool",
  "beach-access",
  "waterfront",
  "carbon-monoxide-alarm",
  "smoke-alarm",
] as const;
export type PropertyAmenity = (typeof PROPERTY_AMENITIES)[number];