import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";
import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { PAYMENT_PROVIDERS } from "../types/payment.types";
import {
  propertyDraftSchema,
  type PropertyDraft,
} from "../schema/property-draft.schema";
import {
  updatePropertyDraftSchema,
  type UpdatePropertyDraft,
} from "../schema/update-property-draft.schema";
const hostIdSchema = z.string().trim().min(1, {
  message: "Host ID must not be empty.",
});
const draftIdSchema = z.string().trim().min(1, {
  message: "Draft ID must not be empty.",
});
const initialStepSchema = z.string().trim().min(1);
const submissionRequirementsSchema = z.object({
  structure: z.string().min(1),
  privacyType: z.string().min(1),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().trim().min(1),
    city: z.string().trim().min(1),
    neighborhood: z.string(),
  }),
  photos: z
    .array(
      z.object({
        id: z.string().min(1),
        url: z.url(),
        publicId: z.string().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        format: z.string().min(1),
        bytes: z.number().int().positive(),
        position: z.number().int().min(0),
      }),
    )
    .min(1)
    .max(20),
  pricePerNight: z.number().int().min(1).max(1_000_000_000),
  currency: z.literal("ETB"),
  paymentProvider: z.enum(PAYMENT_PROVIDERS),
  paymentAccount: z.string().trim().min(1),
});
export interface CreatePropertyDraftInput {
  readonly hostId: string;
  readonly initialStep?: string;
}
export interface CreatePropertyDraftResult {
  readonly draftId: string;
}
export type PropertyDraftWithId = PropertyDraft & {
  readonly id: string;
};
export async function updatePropertyDraft(
  draftId: string,
  data: UpdatePropertyDraft,
): Promise<void> {
  const validatedDraftId = draftIdSchema.parse(draftId);
  const validatedData = updatePropertyDraftSchema.parse(data);
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Authentication required.");
  }
  const draftRef = doc(db, "propertyDrafts", validatedDraftId);
  try {
    await updateDoc(draftRef, {
      ...validatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    throw new Error(
      `Failed to update property draft [${validatedDraftId}]: ${errorMessage}`,
    );
  }
}
export async function getPropertyDraftById(
  draftId: string,
  hostId: string,
): Promise<PropertyDraftWithId | null> {
  const validatedHostId = hostIdSchema.parse(hostId);
  const validatedDraftId = draftIdSchema.parse(draftId);
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== validatedHostId) {
    throw new Error("Authorization failure: Invalid host.");
  }
  const draftRef = doc(db, "propertyDrafts", validatedDraftId);
  try {
    const snapshot = await getDoc(draftRef);
    if (!snapshot.exists()) {
      return null;
    }
    const draft = propertyDraftSchema.parse(snapshot.data());
    if (draft.hostId !== validatedHostId) {
      throw new Error("Authorization failure: You do not own this draft.");
    }
    return {
      ...draft,
      id: snapshot.id,
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Authorization failure")
    ) {
      throw error;
    }
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    throw new Error(
      `Failed to retrieve property draft [${validatedDraftId}]: ${errorMessage}`,
    );
  }
}
export async function getPropertyDraftsByHostId(
  hostId: string,
): Promise<PropertyDraftWithId[]> {
  const validatedHostId = hostIdSchema.parse(hostId);
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== validatedHostId) {
    throw new Error("Authorization failure: Invalid host.");
  }
  const draftsQuery = query(
    collection(db, "propertyDrafts"),
    where("hostId", "==", validatedHostId),
    where("status", "==", "draft"),
  );
  try {
    const snapshot = await getDocs(draftsQuery);
    return snapshot.docs.map((docSnap) => {
      const parsedDraft = propertyDraftSchema.parse(docSnap.data());
      return {
        ...parsedDraft,
        id: docSnap.id,
      };
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    throw new Error(
      `Failed to retrieve drafts for host [${validatedHostId}]: ${errorMessage}`,
    );
  }
}
export async function createPropertyDraft({
  hostId,
  initialStep = "structure",
}: CreatePropertyDraftInput): Promise<CreatePropertyDraftResult> {
  const validatedHostId = hostIdSchema.parse(hostId);
  const validatedStep = initialStepSchema.parse(initialStep);
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== validatedHostId) {
    throw new Error("Authorization failure: Invalid host.");
  }
  const draftRef = doc(collection(db, "propertyDrafts"));
  const draftPayload = {
    hostId: validatedHostId,
    structure: null,
    privacyType: null,
    location: null,
    guestCapacity: 1,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    amenities: [],
    roomAmenities: [],
    photos: [],
    pricePerNight: 0,
    currency: "ETB" as const,
    paymentProvider: null,
    paymentAccount: null,
    paymentStatus: "unpaid" as const,
    paymentReference: null,
    currentStep: validatedStep,
    status: "draft" as const,
    submittedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  try {
    await setDoc(draftRef, draftPayload);
    return {
      draftId: draftRef.id,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    throw new Error(
      `Failed to create property draft: ${errorMessage}`,
    );
  }
}
export async function submitPropertyDraft(
  draftId: string,
): Promise<void> {
  const validatedDraftId = draftIdSchema.parse(draftId);
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Authentication required.");
  }
  const draftRef = doc(db, "propertyDrafts", validatedDraftId);
  try {
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(draftRef);
      if (!snapshot.exists()) {
        throw new Error("Property draft was not found.");
      }
      const draft = propertyDraftSchema.parse(snapshot.data());
      if (draft.hostId !== currentUser.uid) {
        throw new Error("Authorization failure: You do not own this draft.");
      }
      if (draft.status !== "draft") {
        throw new Error("This property is no longer an editable draft.");
      }
      submissionRequirementsSchema.parse(draft);
      transaction.update(draftRef, {
        status: "pending",
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    throw new Error(
      `Failed to submit property draft [${validatedDraftId}]: ${errorMessage}`,
    );
  }
}