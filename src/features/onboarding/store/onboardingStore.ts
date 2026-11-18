import { create } from "zustand";

import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

import type {
  PropertyStructure,
  PropertyAmenity,
  RoomAmenities,
} from "../types/onboarding.types";

import type { PropertyPhoto } from "../types/photo.types";
import type { PropertyLocation } from "../types/location.types";
import type { PrivacyType } from "../types/privacy.types";

export interface PropertyBasics {
  readonly guestCapacity: number;
  readonly bedrooms: number;
  readonly beds: number;
  readonly bathrooms: number;
}

export type PropertyDraftStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected";

interface HydratePropertyDraft {
  readonly id: string;
  readonly structure: PropertyStructure | null;
  readonly privacyType: PrivacyType | null;
  readonly location?: PropertyLocation | null;
  readonly guestCapacity?: number;
  readonly bedrooms?: number;
  readonly beds?: number;
  readonly bathrooms?: number;
  readonly amenities?: readonly PropertyAmenity[];
  readonly roomAmenities?: readonly RoomAmenities[];
  readonly photos?: readonly PropertyPhoto[];
  readonly pricePerNight?: number;
  readonly currency?: "ETB";
  readonly currentStep: string;
  readonly status: PropertyDraftStatus;
}

interface OnboardingState {
  readonly draftId: string | null;

  readonly structure: PropertyStructure | null;
  readonly privacyType: PrivacyType | null;

  readonly currentStep: string | null;
  readonly status: PropertyDraftStatus | null;

  readonly photos: readonly PropertyPhoto[];
  readonly location: PropertyLocation | null;

  readonly guestCapacity: number;
  readonly bedrooms: number;
  readonly beds: number;
  readonly bathrooms: number;

  readonly amenities: readonly PropertyAmenity[];
  readonly roomAmenities: readonly RoomAmenities[];

  readonly pricePerNight: number;
  readonly currency: "ETB";

  readonly setDraftId: (draftId: string) => void;

  readonly setPhotos: (photos: readonly PropertyPhoto[]) => void;
  readonly removePhoto: (photoId: string) => void;

  readonly setLocation: (location: PropertyLocation | null) => void;

  readonly setStructure: (structure: PropertyStructure) => void;
  readonly setPrivacyType: (privacyType: PrivacyType) => void;

  readonly setPropertyBasics: (basics: PropertyBasics) => void;

  readonly setAmenities: (
    amenities: readonly PropertyAmenity[],
  ) => void;

  readonly toggleAmenity: (amenity: PropertyAmenity) => void;

  readonly setRoomAmenities: (
    amenities: readonly RoomAmenities[],
  ) => void;

  readonly toggleRoomAmenity: (amenity: RoomAmenities) => void;

  readonly setPricing: (pricePerNight: number) => void;

  readonly hydrateDraft: (draft: HydratePropertyDraft) => void;

  readonly setStatus: (status: PropertyDraftStatus) => void;

  readonly resetOnboarding: () => void;
}

const initialBasics: PropertyBasics = {
  guestCapacity: 1,
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
};

const initialState = {
  draftId: null,

  structure: null,
  privacyType: null,

  currentStep: null,
  status: null,

  photos: [],
  location: null,

  ...initialBasics,

  amenities: [],
  roomAmenities: [],

  pricePerNight: 0,
  currency: "ETB" as const,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      /**
       * Stores the Firestore document ID.
       */
      setDraftId: (draftId) => {
        if (!draftId.trim()) {
          throw new Error("Draft ID cannot be empty.");
        }

        set({ draftId });
      },

      setPhotos: (photos) =>
        set({
          photos: [...photos],
        }),

      removePhoto: (photoId) =>
        set((state) => ({
          photos: state.photos
            .filter((photo) => photo.id !== photoId)
            .map((photo, index) => ({
              ...photo,
              position: index,
            })),
        })),

      setLocation: (location) => set({ location }),

      setStructure: (structure) => set({ structure }),

      setPrivacyType: (privacyType) => set({ privacyType }),

      setPropertyBasics: (basics) => set(basics),

      setAmenities: (amenities) =>
        set({
          amenities: [...new Set(amenities)],
        }),

      toggleAmenity: (amenity) =>
        set((state) => {
          const isSelected = state.amenities.includes(amenity);

          return {
            amenities: isSelected
              ? state.amenities.filter((item) => item !== amenity)
              : [...state.amenities, amenity],
          };
        }),

      setRoomAmenities: (amenities) =>
        set({
          roomAmenities: [...new Set(amenities)],
        }),

      toggleRoomAmenity: (amenity) =>
        set((state) => {
          const isSelected = state.roomAmenities.includes(amenity);

          return {
            roomAmenities: isSelected
              ? state.roomAmenities.filter((item) => item !== amenity)
              : [...state.roomAmenities, amenity],
          };
        }),

      setPricing: (pricePerNight) =>
        set({
          pricePerNight,
          currency: "ETB",
        }),

      /**
       * Hydrates the frontend store from Firestore.
       */
      hydrateDraft: (draft) =>
        set({
          draftId: draft.id,

          structure: draft.structure,
          privacyType: draft.privacyType,

          location: draft.location ?? null,

          guestCapacity: draft.guestCapacity ?? 1,
          bedrooms: draft.bedrooms ?? 0,
          beds: draft.beds ?? 0,
          bathrooms: draft.bathrooms ?? 0,

          amenities: [...new Set(draft.amenities ?? [])],

          roomAmenities: [
            ...new Set(draft.roomAmenities ?? []),
          ],

          photos: [...(draft.photos ?? [])],

          pricePerNight: draft.pricePerNight ?? 0,
          currency: draft.currency ?? "ETB",

          currentStep: draft.currentStep,
          status: draft.status,
        }),

      setStatus: (status) => set({ status }),

      /**
       * Clears the current onboarding session.
       */
      resetOnboarding: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "enterprise-onboarding-property-store",

      storage: createJSONStorage(() => sessionStorage),

      version: 2,
      migrate: (persistedState) => persistedState as OnboardingState,
    },
  ),
);