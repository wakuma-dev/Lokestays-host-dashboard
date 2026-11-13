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