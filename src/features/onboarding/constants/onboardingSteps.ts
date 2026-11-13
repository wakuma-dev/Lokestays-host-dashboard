import type { OnboardingLink }from "@/features/onboarding"
export const onboardingSteps: readonly OnboardingLink[] = [
  { path: "/properties/about", stepNumber: 1, title: "Tell us about your place"},
  { path: "/properties/structure", stepNumber: 2, title: "Structure & Rooms" },
  { path: "/properties/privacy", stepNumber: 3, title: "Privacy & Guest Capacity"},
  {path: "/properties/location", stepNumber: 4, title: "Location & Address"}
] as const;