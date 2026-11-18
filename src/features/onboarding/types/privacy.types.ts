import type { LucideIcon } from "lucide-react";
import { z } from "zod";

export const PRIVACY_TYPE_VALUES = [
  "entire_place",
  "private_room",
  "shared_room",
] as const;

export type PrivacyType = (typeof PRIVACY_TYPE_VALUES)[number];
export const PrivacyTypeSchema = z.enum(PRIVACY_TYPE_VALUES);
export interface PrivacyTypeOption {
  readonly value: PrivacyType;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly description: string;
}