import { z } from "zod";
const envSchema = z.object({
  VITE_APP_NAME: z
    .string()
    .min(1, "VITE_APP_NAME is required"),

  VITE_APP_ENV: z.enum([
    "development",
    "staging",
    "production",
  ]),

  VITE_SHOW_ERROR_DETAILS: z.enum([
    "true",
    "false",
  ]),

  VITE_FIREBASE_API_KEY: z
    .string()
    .min(1, "VITE_FIREBASE_API_KEY is required"),

  VITE_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, "VITE_FIREBASE_AUTH_DOMAIN is required"),

  VITE_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, "VITE_FIREBASE_PROJECT_ID is required"),

  VITE_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, "VITE_FIREBASE_STORAGE_BUCKET is required"),

  VITE_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "VITE_FIREBASE_MESSAGING_SENDER_ID is required"),

  VITE_FIREBASE_APP_ID: z
    .string()
    .min(1, "VITE_FIREBASE_APP_ID is required"),

  VITE_FIREBASE_MEASUREMENT_ID: z
    .string()
    .optional(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment configuration:",
    parsedEnv.error.flatten().fieldErrors,
  );

  throw new Error(
    "Application configuration is invalid.",
  );
}

export const env = Object.freeze({
  appName: parsedEnv.data.VITE_APP_NAME,

  appEnvironment: parsedEnv.data.VITE_APP_ENV,

  showErrorDetails:
    parsedEnv.data.VITE_SHOW_ERROR_DETAILS === "true",

  firebase: {
    apiKey: parsedEnv.data.VITE_FIREBASE_API_KEY,
    authDomain:
      parsedEnv.data.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:
      parsedEnv.data.VITE_FIREBASE_PROJECT_ID,
    storageBucket:
      parsedEnv.data.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      parsedEnv.data.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:
      parsedEnv.data.VITE_FIREBASE_APP_ID,
    measurementId:
      parsedEnv.data.VITE_FIREBASE_MEASUREMENT_ID,
  },
});