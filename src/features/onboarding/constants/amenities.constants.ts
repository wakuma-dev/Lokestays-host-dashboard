import type { PropertyAmenity } from "../types/onboarding.types";
export interface AmenityOption {
  readonly value: PropertyAmenity;
  readonly label: string;
  readonly description?: string;
}
export interface AmenityCategory {
  readonly title: string;
  readonly amenities: readonly AmenityOption[];
}
export const AMENITY_CATEGORIES: readonly AmenityCategory[] = [
  {
    title: "Basics",
    amenities: [
      { value: "air-conditioning", label: "Air conditioning" },
      { value: "dryer", label: "Dryer" },
      {
        value: "essentials",
        label: "Essentials",
        description: "Towels, bed sheets, soap, and toilet paper",
      },
      { value: "heating", label: "Heating" },
      { value: "hot-water", label: "Hot water" },
      { value: "kitchen", label: "Kitchen" },
      { value: "refrigerator", label: "Refrigerator" },
      { value: "tv", label: "TV" },
      { value: "washer", label: "Washer" },
      { value: "wifi", label: "Wifi" },
    ],
  },
  {
    title: "Popular",
    amenities: [
      { value: "coffee-maker", label: "Coffee maker" },
      {
        value: "cooking-basics",
        label: "Cooking basics",
        description: "Pots and pans, oil, salt and pepper",
      },
      { value: "hair-dryer", label: "Hair dryer" },
      { value: "hangers", label: "Hangers" },
      { value: "iron", label: "Iron" },
      { value: "shampoo", label: "Shampoo" },
    ],
  },
  {
    title: "Features",
    amenities: [
      { value: "crib", label: "Crib" },
      { value: "dedicated-workspace", label: "Dedicated workspace" },
      { value: "ev-charger", label: "EV charger" },
      { value: "free-parking", label: "Free parking on premises" },
      { value: "gym", label: "Gym" },
      { value: "hot-tub", label: "Hot tub" },
      { value: "indoor-fireplace", label: "Indoor fireplace" },
      { value: "outdoor-furniture", label: "Outdoor furniture" },
      { value: "pool", label: "Pool" },
    ],
  },
  {
    title: "Location",
    amenities: [
      { value: "beach-access", label: "Beach access" },
      { value: "waterfront", label: "Waterfront" },
    ],
  },
  {
    title: "Safety",
    amenities: [
      { value: "carbon-monoxide-alarm", label: "Carbon monoxide alarm" },
      { value: "smoke-alarm", label: "Smoke alarm" },
    ],
  },
];