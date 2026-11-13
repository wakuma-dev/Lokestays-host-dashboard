import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PropertyLocation } from "../types/location.types";
import type { PropertyStructure } from "../types/onboarding.types";
import type { PrivacyType } from "../types/privacy.types";

interface OnboardingState {
  readonly draftId: string | null;
  readonly structure: PropertyStructure | null;
  readonly privacyType: PrivacyType | null;
  readonly currentStep: string | null;
  readonly status: "draft" | "submitted" | null;
  readonly location: PropertyLocation | null;
  readonly setLocation: (location: PropertyLocation | null) => void;
  readonly setStructure: (structure: PropertyStructure) => void;
  readonly setPrivacyType: (privacyType: PrivacyType) => void;

  readonly hydrateDraft: (draft: {
    readonly id: string;
    readonly structure: PropertyStructure | null;
    readonly privacyType: PrivacyType | null;
    readonly location?: PropertyLocation | null;
    readonly currentStep: string;
    readonly status: "draft" | "submitted";
  }) => void;

  readonly resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      draftId: null,
      structure: null,
      privacyType: null,
      currentStep: null,
      status: null,
      location: null,
      setLocation: (location) => set({ location }),
      setStructure: (structure) => set({ structure }),

      setPrivacyType: (privacyType) => set({ privacyType }),

      hydrateDraft: (draft) =>
        set({
          draftId: draft.id,
          structure: draft.structure,
          privacyType: draft.privacyType,
          location: draft.location ?? null,
          currentStep: draft.currentStep,
          status: draft.status,
        }),

      resetOnboarding: () =>
        set({
          draftId: null,
          structure: null,
          privacyType: null,
          location: null,
          currentStep: null,
          status: null,
        }),
    }),
    {
      name: "enterprise-onboarding-property-store",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    }
  )
);