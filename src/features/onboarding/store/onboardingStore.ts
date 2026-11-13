import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PropertyStructure } from "../types/onboarding.types";

interface OnboardingState {
  readonly draftId: string | null;
  readonly structure: PropertyStructure | null;
  readonly currentStep: string | null;
  readonly status: "draft" | "submitted" | null;
  readonly setStructure: (structure: PropertyStructure) => void;
  readonly hydrateDraft: (draft: {
    readonly id: string;
    readonly structure: PropertyStructure | null;
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
      currentStep: null,
      status: null,
      setStructure: (structure) => set({ structure }),
      hydrateDraft: (draft) =>
        set({
          draftId: draft.id,
          structure: draft.structure,
          currentStep: draft.currentStep,
          status: draft.status,
        }),
      resetOnboarding: () =>
        set({
          draftId: null,
          structure: null,
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