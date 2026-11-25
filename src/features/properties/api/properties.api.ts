import {
  getDocs,
  limit,
  where,
  query,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  startAfter,
  documentId,
  setDoc,
  type QueryDocumentSnapshot,
  type DocumentData,
  serverTimestamp,
} from "firebase/firestore";

import { z } from "zod";
import { getIdTokenResult } from "firebase/auth";

import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";

import { propertiesSchema } from "../schema/propertiesSchema";

import type { UpdatePropertyParams } from "../types/UpdatePropery.types";
import type {
  GetAllProperties,
  Properties,
} from "../types/properties.types";

// =========================================
// VALIDATION
// =========================================

const propertyIdSchema = z.string().trim().min(1);

const hostIdSchema = z.string().trim().min(1);

const pageSizeSchema = z.number().int().min(1).max(50);

const createPropertyDraftSchema = z.object({
  hostId: z.string().trim().min(1),
  status: z.literal("draft"),
  pricePerNight: z.literal(0),
  currency: z.literal("ETB"),
  submittedAt: z.null(),
  paymentProvider: z.null(),
  paymentStatus: z.literal("unpaid"),
  paymentReference: z.null(),
});

export type CreatePropertyDraftResult = {
  propertyDraftId: string;
};

// =========================================
// CREATE PROPERTY DRAFT
// =========================================

export async function createPropertyDraft(): Promise<CreatePropertyDraftResult> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Authentication is required to create a property draft.",
    );
  }

  // Generate a document reference without writing yet.
  const propertyDraftRef = doc(
    collection(db, "propertyDrafts"),
  );

  const initialData = {
    hostId: currentUser.uid,
    status: "draft" as const,
    pricePerNight: 0 as const,
    currency: "ETB" as const,
    submittedAt: null,
    paymentProvider: null,
    paymentStatus: "unpaid" as const,
    paymentReference: null,
  };

  const validatedData = createPropertyDraftSchema.parse(initialData);

  try {
    await setDoc(propertyDraftRef, {
      ...validatedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      propertyDraftId: propertyDraftRef.id,
    };
  } catch (error: unknown) {
    console.error("Failed to create property draft:", error);

    throw new Error(
      error instanceof Error
        ? `Failed to create property draft: ${error.message}`
        : "Failed to create property draft due to an unknown error.",
    );
  }
}

// =========================================
// GET PROPERTY BY ID
// =========================================

export async function getPropertyById(
  propertyId: string,
): Promise<Properties> {
  const validatedId = propertyIdSchema.parse(propertyId);

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Authentication is required to load property.",
    );
  }

  const { claims } = await getIdTokenResult(currentUser);

  const propertyRef = doc(
    db,
    "propertyDrafts",
    validatedId,
  );

  const propertySnapshot = await getDoc(propertyRef);

  if (!propertySnapshot.exists()) {
    throw new Error("Property not found.");
  }

  const property = propertiesSchema.parse({
    ...propertySnapshot.data(),
    id: propertySnapshot.id,
  });

  if (
    claims.admin !== true &&
    property.hostId !== currentUser.uid
  ) {
    throw new Error(
      "You are not authorized to access this property.",
    );
  }

  return property;
}

// =========================================
// DELETE PROPERTY
// =========================================

export async function deleteProperty(
  propertyDraftId: string,
): Promise<void> {
  const normalizedPropertyDraftId =
    propertyIdSchema.parse(propertyDraftId);

  await deleteDoc(
    doc(db, "propertyDrafts", normalizedPropertyDraftId),
  );
}

// =========================================
// UPDATE PROPERTY
// =========================================

export async function updateProperty({
  propertyDraftId,
  ...updates
}: UpdatePropertyParams): Promise<void> {
  const normalizedPropertyDraftId =
    propertyIdSchema.parse(propertyDraftId);

  const editableFields = Object.entries(updates).filter(
    ([, value]) => value !== undefined,
  );

  if (editableFields.length === 0) {
    throw new Error(
      "At least one editable property field is required.",
    );
  }

  await updateDoc(
    doc(db, "propertyDrafts", normalizedPropertyDraftId),
    {
      ...Object.fromEntries(editableFields),
      updatedAt: serverTimestamp(),
    },
  );
}

// =========================================
// GET ALL PROPERTIES
// =========================================

export async function getAllProperties({
  pageSize,
  lastDocument,
}: GetAllProperties): Promise<{
  properties: Properties[];
  lastDocument: QueryDocumentSnapshot<DocumentData> | null;
  hasNextPage: boolean;
}> {
  const validatedPageSize = pageSizeSchema.parse(pageSize);

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Authentication required to load properties.",
    );
  }

  const { claims } = await getIdTokenResult(currentUser);

  const propertiesRef = collection(db, "propertyDrafts");

  const constraints = [
    ...(claims.admin === true
      ? []
      : [
          where(
            "hostId",
            "==",
            currentUser.uid,
          ),
        ]),

    orderBy("createdAt", "desc"),
    orderBy(documentId(), "desc"),

    ...(lastDocument
      ? [startAfter(lastDocument)]
      : []),

    limit(validatedPageSize + 1),
  ];

  const propertiesQuery = query(
    propertiesRef,
    ...constraints,
  );

  const snapshot = await getDocs(propertiesQuery);

  const hasNextPage =
    snapshot.docs.length > validatedPageSize;

  const pageDocuments = snapshot.docs.slice(
    0,
    validatedPageSize,
  );

  const properties = pageDocuments.map((document) =>
    propertiesSchema.parse({
      ...document.data(),
      id: document.id,
    }),
  );

  return {
    properties,
    lastDocument: pageDocuments.at(-1) ?? null,
    hasNextPage,
  };
}

// =========================================
// CHECK HOST PROPERTIES
// =========================================

export async function hasHostProperties(
  hostId: unknown,
): Promise<boolean> {
  const validationResult = hostIdSchema.safeParse(hostId);

  if (!validationResult.success) {
    throw new Error(
      `[ValidationError] Invalid hostId parameter: ${
        validationResult.error.message
      }`,
    );
  }

  const sanitizedHostId = validationResult.data;

  try {
    const propertiesRef = collection(
      db,
      "propertyDrafts",
    );

    const propertiesQuery = query(
      propertiesRef,
      where("hostId", "==", sanitizedHostId),
      limit(1),
    );

    const snapshot = await getDocs(propertiesQuery);

    return !snapshot.empty;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown persistence layer failure";

    throw new Error(
      `[DatabaseError] Failed to verify host properties for ID [${sanitizedHostId}]: ${errorMessage}`,
    );
  }
}