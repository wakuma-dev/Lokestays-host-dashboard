import { getDocs,
         limit,
         where,
         query,
         collection
 } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase/firestore";

const hostIdSchema = z.string().min(1, {message: "Host ID cannot be empty or whitespace"})
export async function hasHostProperties(hostId: unknown): Promise<boolean>{
    const validationResult = hostIdSchema.safeParse(hostId);
    if(!validationResult.success){
        throw new Error(`[ValidationError] Invalid hostId parameter: ${validationResult.error.message}`);
    }
    const sanitizedHostId = validationResult.data.trim();
    try {
        const propertiesRef = collection(db, "properties");
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