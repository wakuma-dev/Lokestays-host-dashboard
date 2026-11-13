import type { LucideIcon } from "lucide-react";
import { z } from "zod";

/**
 * Pure domain identifiers. Zero UI or framework dependencies.
 * Space: O(1) | Lookup: O(1) via Set
 */
export const PRIVACY_TYPE_VALUES = [
  "entire_place",
  "private_room",
  "shared_room",
] as const;

export type PrivacyType = (typeof PRIVACY_TYPE_VALUES)[number];

/**
 * Runtime boundary schema for forms (TanStack Form / React Hook Form),
 * URL search params (TanStack Router), and Firestore payloads.
 */
export const PrivacyTypeSchema = z.enum(PRIVACY_TYPE_VALUES);

/**
 * UI-layer contract binding domain values to presentation assets.
 */
export interface PrivacyTypeOption {
  readonly value: PrivacyType;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly description: string;
}