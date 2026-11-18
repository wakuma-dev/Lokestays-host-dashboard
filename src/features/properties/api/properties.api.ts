import { getDocs,
         limit,
         where,
         query,
         collection,
         updateDoc,
         deleteDoc,
         doc,
         orderBy,
         startAfter,
         documentId,
         type QueryDocumentSnapshot,
         type DocumentData,
         serverTimestamp
 } from "firebase/firestore";
import { z } from "zod";
import { getIdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { propertiesSchema } from "../schema/propertiesSchema";
import type { UpdatePropertyParams } from "../types/UpdatePropery.types";
import type { GetAllProperties, Properties } from "../types/properties.types";

export async function deleteProperty(propertyDraftId: string): Promise<void>{
    const normalizedPropertyDraftId = propertyDraftId.trim();
    if(!normalizedPropertyDraftId){
        throw new Error("Property Draft Id is required to delete the property")
    }
    await deleteDoc(doc(db, "propertyDrafts", normalizedPropertyDraftId))
}
export async function updateProperty({propertyDraftId, ...updates}: UpdatePropertyParams): Promise<void>{
    const normalizedPropertyDraftId = propertyDraftId.trim();
    if(!normalizedPropertyDraftId){
        throw new Error("Property Draft Id is require to update the property");
    }
    const editableFields = Object.entries(updates).filter(([, value]) => value !== undefined);
    if(editableFields.length === 0){
         throw new Error("At least one editable property field is required.");
    }
    await updateDoc(doc(db, "propertyDrafts", normalizedPropertyDraftId), {
        ...Object.fromEntries(editableFields),
        updatedAt: serverTimestamp()
    });
}
export async function getAllProperties({pageSize, lastDocument}: GetAllProperties):
 Promise<{properties: Properties[];
         lastDocument: QueryDocumentSnapshot<DocumentData> | null;
         hasNextPage: boolean;}>{
 if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new Error("Page size must be a positive integer.");
  }
 const currentUser = auth.currentUser;
 if (!currentUser) {
    throw new Error("Authentication required to load properties.");
  }
 const { claims } = await getIdTokenResult(currentUser);
 const propertiesRef = collection(db, "propertyDrafts");
 const constraints = [
    ...(claims.admin === true
      ? []
      : [where("hostId", "==", currentUser.uid)]),
    orderBy("createdAt", "desc"),
    orderBy(documentId(), "desc"),
    ...(lastDocument ? [startAfter(lastDocument)] : []),
    limit(pageSize + 1)
 ];
 const propertiesQuery = query(
    propertiesRef,
    ...constraints
 );
 const snapshot = await getDocs(propertiesQuery);
 const hasNextPage = snapshot.docs.length > pageSize;
 const pageDocuments = snapshot.docs.slice(0, pageSize);
 const properties = pageDocuments.map((document) => {
    const parsedProperty = propertiesSchema.parse({
      ...document.data(),
      id: document.id,
    }) as Properties;

    return parsedProperty;
  });
  return {
     properties,
    lastDocument: pageDocuments.at(-1) ?? null,
    hasNextPage,
  }
      
}
const hostIdSchema = z.string().min(1, {message: "Host ID cannot be empty or whitespace"})
export async function hasHostProperties(hostId: unknown): Promise<boolean>{
    const validationResult = hostIdSchema.safeParse(hostId);
    if(!validationResult.success){
        throw new Error(`[ValidationError] Invalid hostId parameter: ${validationResult.error.message}`);
    }
    const sanitizedHostId = validationResult.data.trim();
    try {
        const propertiesRef = collection(db, "propertyDrafts");
        const propertiesQuery = query(
            propertiesRef,
            where("hostId", "==", sanitizedHostId),
            limit(1)
        );
        const snapshot = await getDocs(propertiesQuery);
        return !snapshot.empty;
    } catch(error: unknown){
      const errorMessage = error instanceof Error ? error.message : "Unknown persistence layer failure";
    throw new Error(`[DatabaseError] Failed to verify host properties for ID [${sanitizedHostId}]: ${errorMessage}`);
    }
}