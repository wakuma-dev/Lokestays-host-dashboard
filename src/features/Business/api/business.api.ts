import { getDoc, 
         doc, 
         runTransaction, 
         serverTimestamp, 
         type DocumentData,
         type DocumentReference,
         type Transaction, 
         Timestamp} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { auth } from "@/lib/firebase/auth";
import { businessDraftSchema, type BusinessDraftValues} from "@/features/Business";
import {validateBusinessCompletionWithOwner, 
        type ValidatedBusinessDraft} from "../utils/businessCompletion";
import { BUSINESS_STATUS_VALUES, type BusinessStatus } from "../types/business.types";
export type BusinessDocument = Readonly<
  BusinessDraftValues & {
    ownerId: string;
    status: BusinessStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp
  }
>;
export type BusinessApiErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_DATA"
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "INVALID_DOCUMENT"
  | "INVALID_STATE";
export class BusinessApiError extends Error {
    public readonly code: BusinessApiErrorCode;
    constructor(
        message: string,
        code: BusinessApiErrorCode
    ){
      super(message);
      this.name = "BusinessApiError";
      this.code = code;
    }
}
function getAuthenticatedOwnerId(): string {
  const currentUser = auth.currentUser;
   if (!currentUser || currentUser.uid.trim().length === 0) {
    throw new BusinessApiError(
      "Authentication is required.",
      "UNAUTHENTICATED"
    );
  }
  return currentUser.uid;
}
function getBusinessRef(ownerId: string): DocumentReference<DocumentData>{
    return doc(db, "businesses", ownerId);
}
function parseDraftInput(rawInput: unknown): BusinessDraftValues {
    const parsed = businessDraftSchema.safeParse(rawInput);
    if(!parsed.success){
        throw new BusinessApiError("Invalid business information.", "INVALID_DATA")
    }
    return parsed.data;
}
function isValidBusinessStatus(value: unknown): value is BusinessStatus {
    return (BUSINESS_STATUS_VALUES as readonly unknown[]).includes(value);
}
function parseBusinessDocument(rawDocData: DocumentData, expectedOwnerId: string): BusinessDocument{
  const { ownerId, status, createdAt, updatedAt, ...draftFields } = rawDocData;
  if (
    typeof ownerId !== "string" ||
    ownerId !== expectedOwnerId ||
    !isValidBusinessStatus(status) ||
    !(createdAt instanceof Timestamp) ||
    !(updatedAt instanceof Timestamp)
  ) {
    throw new BusinessApiError(
      "Invalid stored business document.",
      "INVALID_DOCUMENT"
    );
  }
  const parsedDraft = parseDraftInput(draftFields);
  return {
    ...parsedDraft,
    ownerId,
    status,
    createdAt,
    updatedAt,
  };
}
function assertEditableState(status: BusinessStatus): void {
  if (status === "pending_verification") {
    throw new BusinessApiError(
      "Business details cannot be modified while verification is pending.",
      "INVALID_STATE"
    );
  }
}
async function readExistingBusinessInTransaction(
  transaction: Transaction,
  businessRef: DocumentReference<DocumentData>,
  expectedOwnerId: string
): Promise<BusinessDocument> {
  const snapshot = await transaction.get(businessRef);
  if (!snapshot.exists()) {
    throw new BusinessApiError(
      "Business profile not found.",
      "NOT_FOUND"
    );
  }
  return parseBusinessDocument(snapshot.data(), expectedOwnerId);
}
export async function createBusiness(input: BusinessDraftValues): Promise<void> {
  const ownerId = getAuthenticatedOwnerId();
  const validatedDraft = parseDraftInput(input);
  const businessRef = getBusinessRef(ownerId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(businessRef);
    if (snapshot.exists()) {
      throw new BusinessApiError(
        "Business profile already exists.",
        "ALREADY_EXISTS"
      );
    }
    transaction.set(businessRef, {
      ...validatedDraft,
      ownerId,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}
export async function getBusiness(): Promise<BusinessDocument | null> {
  const ownerId = getAuthenticatedOwnerId();
  const businessRef = getBusinessRef(ownerId);
   const snapshot = await getDoc(businessRef);
  if (!snapshot.exists()) {
    return null;
  }
  return parseBusinessDocument(snapshot.data(), ownerId);
}
export async function updateBusiness(input: BusinessDraftValues): Promise<void> {
  const ownerId = getAuthenticatedOwnerId();
  const validatedDraft = parseDraftInput(input);
  const businessRef = getBusinessRef(ownerId);
  await runTransaction(db, async (transaction) => {
    const existing = await readExistingBusinessInTransaction(
      transaction,
      businessRef,
      ownerId
    );
    assertEditableState(existing.status);
    transaction.update(businessRef, {
      ...validatedDraft,
      updatedAt: serverTimestamp(),
    });
  });
}
export async function saveBusinessDraft(
  input: BusinessDraftValues
): Promise<void> {
  const ownerId = getAuthenticatedOwnerId();
  const validatedDraft = parseDraftInput(input);
  const businessRef = getBusinessRef(ownerId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(businessRef);
    if (!snapshot.exists()) {
      transaction.set(businessRef, {
        ...validatedDraft,
        ownerId,
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }
    const existing = parseBusinessDocument(snapshot.data(), ownerId);
    assertEditableState(existing.status);
    transaction.update(businessRef, {
      ...validatedDraft,
      updatedAt: serverTimestamp(),
    });
  });
}
export async function completeBusiness(
  input: BusinessDraftValues
): Promise<void> {
  const ownerId = getAuthenticatedOwnerId();
  const completionResult = validateBusinessCompletionWithOwner(input, ownerId);
  if (!completionResult.isComplete) {
    throw new BusinessApiError(
      "Please complete all required business information.",
      "INVALID_DATA"
    );
  }
  const completedPayload: ValidatedBusinessDraft = completionResult.data;
  const businessRef = getBusinessRef(ownerId);
  await runTransaction(db, async (transaction) => {
    const existing = await readExistingBusinessInTransaction(
      transaction,
      businessRef,
      ownerId
    );
    assertEditableState(existing.status);
    transaction.update(businessRef, {
      ...completedPayload,
      ownerId,
      status: "complete",
      updatedAt: serverTimestamp(),
    });
  });
}
export async function deleteBusiness(): Promise<void> {
  const ownerId = getAuthenticatedOwnerId();
  const businessRef = getBusinessRef(ownerId);
  await runTransaction(db, async (transaction) => {
    const existing = await readExistingBusinessInTransaction(
      transaction,
      businessRef,
      ownerId
    );
    assertEditableState(existing.status);
    transaction.delete(businessRef);
  });
}