// src/constants/privacy.constants.ts
import { Home, DoorOpen, Users, type LucideIcon } from "lucide-react";
import {
  PRIVACY_TYPE_VALUES,
  type PrivacyType,
  type PrivacyTypeOption,
} from "../types/privacy.types";

export const PRIVACY_TYPE_MAP: Readonly<Record<PrivacyType, PrivacyTypeOption>> = {
  entire_place: {
    value: "entire_place",
    icon: Home,
    label: "An entire place",
    description: "Guests have the whole place to themselves.",
  },
  private_room: {
    value: "private_room",
    icon: DoorOpen,
    label: "A room",
    description: "Guests have their own room in a home, plus access to shared spaces.",
  },
  shared_room: {
    value: "shared_room",
    icon: Users,
    label: "A shared room in a hostel",
    description:
      "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.",
  },
} as const;

/**
 * Ordered, immutable array derived deterministically from the canonical tuple.
 * Preserves exact UI rendering order without duplicating string literals.
 * Time: O(N) once at module evaluation | Space: O(N)
 */
export const PRIVACY_TYPE_OPTIONS: readonly PrivacyTypeOption[] =
  PRIVACY_TYPE_VALUES.map((type) => PRIVACY_TYPE_MAP[type]);

/**
 * O(1) lookup helper for rendering badges/cards from a stored PrivacyType ID.
 */
export function getPrivacyTypeOption(type: PrivacyType): PrivacyTypeOption {
  return PRIVACY_TYPE_MAP[type];
}

/**
 * Helper to resolve icon component safely at boundaries.
 */
export function getPrivacyTypeIcon(type: PrivacyType): LucideIcon {
  return PRIVACY_TYPE_MAP[type].icon;
}