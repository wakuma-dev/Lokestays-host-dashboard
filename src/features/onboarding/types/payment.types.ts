export const PAYMENT_PROVIDERS = [
  "telebirr",
  "mpesa",
  "cbe",
  "awash",
  "dashen",
  "abyssinia",
] as const;
export type PaymentProvider =
  (typeof PAYMENT_PROVIDERS)[number];
export const PAYMENT_STATUSES = [
  "unpaid",
  "pending",
  "processing",
  "successful",
  "failed",
  "cancelled",
] as const;
export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[number];