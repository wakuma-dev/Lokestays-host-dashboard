import { updateDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { profileSchema, updateProfileSchema, type Profile, type ProfileUpdate} from "@/features/profile"
export async function getUserProfile(uid: string): Promise<Profile>{
     if(!uid.trim()){
        throw new Error("A valid uid is required to fetch the profile")
     }
     const userRef = doc(db, "users", uid);
     const snapshot = await getDoc(userRef);
     if(!snapshot.exists()){
      throw new Error("Admin not found");
     }
     const profileData = profileSchema.safeParse({
        uid: snapshot.id,
        ...snapshot.data()
     } as Profile);
     if(!profileData.success){
        throw new Error("Admin profile contains invalid data.");
     }
     return profileData.data
}
export async function userUpdateProfile(uid: string, profileData: ProfileUpdate): Promise<void>{
    if(!uid.trim()){
        throw new Error("A valid uid is required to update the profile");
    }
    const validatedData = updateProfileSchema.safeParse(profileData);
    if(!validatedData.success){
        throw new Error("Invalid profile data provided for update.");
    }
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if(!snapshot.exists()){
        throw new Error("Admin profile not found for update");
    }
    const existingData = profileSchema.safeParse({
        uid: snapshot.id,
        ...snapshot.data()
    } as Profile);
    if(!existingData.success){
     throw new Error("Existing admin profile contains invalid data.")
    }
    await updateDoc(userRef, {
        ...validatedData.data,
        updatedAt: serverTimestamp()
    });
}