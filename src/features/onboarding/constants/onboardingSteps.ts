import type { OnboardingLink }from "@/features/onboarding"
export const onboardingSteps: readonly OnboardingLink[] = [
  { path: "/properties/about", stepNumber: 1, title: "Tell us about your place"},
  { path: "/properties/structure", stepNumber: 2, title: "Structure & Rooms" },
  { path: "/properties/privacy", stepNumber: 3, title: "Privacy & Guest Capacity"},
  {path: "/properties/location", stepNumber: 4, title: "Location & Address"},
  {path: "/properties/basics", stepNumber: 5, title: "Property Basics"},
  {path: "/properties/amenities", stepNumber: 6, title: "Amenities"},
  {path: "/properties/photos", stepNumber: 7, title: "Photos"},
  {path: "/properties/rooms", stepNumber: 8, title: "Rooms"},
  {path: "/properties/pricing", stepNumber: 9, title: "Pricing"}
] as const;