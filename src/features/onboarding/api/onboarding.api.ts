import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";

import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";

import {
  propertyDraftSchema,
  type PropertyDraft,
} from "../schema/property-draft.schema";

import {
  updatePropertyDraftSchema,
  type UpdatePropertyDraft,
} from "../schema/update-property-draft.schema";

const hostIdSchema = z.string().trim().min(1, {
  message: "Host ID must not be empty",
});

const draftIdSchema = z.string().trim().min(1, {
  message: "Draft ID must not be empty",
});

export interface CreatePropertyDraftInput {
  readonly hostId: string;
  readonly initialStep?: string;
}

export type CreatePropertyDraftResult = {
  readonly draftId: string;
};

export type PropertyDraftWithId = PropertyDraft & {
  readonly id: string;
};

/**
 * @name updatePropertyDraft
 * @description Updates an existing property onboarding draft.
 *
 * Algorithmic Complexity:
 * - Validation: O(K), where K is the number of updated fields.
 * - Firestore Write: O(1) network operation.
 */
export async function updatePropertyDraft(
  draftId: string,
  data: UpdatePropertyDraft,
): Promise<void> {
  const validatedDraftId = draftIdSchema.parse(draftId);
  const validatedData = updatePropertyDraftSchema.parse(data);

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Authentication required: Active user session is missing.",
    );
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

/**
 * @name getPropertyDraftById
 * @description Retrieves and validates a single property draft document.
 */
export async function getPropertyDraftById(
  draftId: string,
  hostId: string,
): Promise<PropertyDraftWithId | null> {
  const validatedHostId = hostIdSchema.parse(hostId);
  const validatedDraftId = draftIdSchema.parse(draftId);

  const draftRef = doc(db, "propertyDrafts", validatedDraftId);

  try {
    const snapshot = await getDoc(draftRef);

    if (!snapshot.exists()) {
      return null;
    }

    const rawData = snapshot.data();
    const draft = propertyDraftSchema.parse(rawData);

    if (draft.hostId !== validatedHostId) {
      throw new Error(
        "Authorization failure: You are not authorized to access this property draft.",
      );
    }

    return {
      id: snapshot.id,
      ...draft,
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

/**
 * @name getPropertyDraftsByHostId
 * @description Retrieves all active draft property onboarding documents.
 */
export async function getPropertyDraftsByHostId(
  hostId: string,
): Promise<PropertyDraftWithId[]> {
  const validatedHostId = hostIdSchema.parse(hostId);

  const draftsQuery = query(
    collection(db, "propertyDrafts"),
    where("hostId", "==", validatedHostId),
    where("status", "==", "draft"),
  );

  try {
    const snapshot = await getDocs(draftsQuery);

    return snapshot.docs.map((docSnap) => {
      const rawData = docSnap.data();
      const parsedDraft = propertyDraftSchema.parse(rawData);

      return {
        id: docSnap.id,
        ...parsedDraft,
      };
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";

    throw new Error(
      `Failed to query property drafts for host [${validatedHostId}]: ${errorMessage}`,
    );
  }
}

/**
 * @name createPropertyDraft
 * @description Creates a new property onboarding draft document.
 */
export async function createPropertyDraft({
  hostId,
  initialStep = "structure",
}: CreatePropertyDraftInput): Promise<CreatePropertyDraftResult> {
  const validatedHostId = hostIdSchema.parse(hostId);
  const validatedStep = z.string().trim().min(1).parse(initialStep);

  const draftRef = doc(collection(db, "propertyDrafts"));

  const draftPayload: Omit<
    PropertyDraft,
    "id" | "createdAt" | "updatedAt"
  > & {
    readonly createdAt: ReturnType<typeof serverTimestamp>;
    readonly updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    hostId: validatedHostId,
    structure: null,
    privacyType: null,
    location: null,
    currentStep: validatedStep,
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(draftRef, draftPayload);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";

    throw new Error(
      `Failed to initialize property draft for host [${validatedHostId}]: ${errorMessage}`,
    );
  }

  return {
    draftId: draftRef.id,
  };
}