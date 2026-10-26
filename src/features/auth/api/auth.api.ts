import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  type AuthProvider,
  signInWithRedirect,
  signOut,
  type User,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import type { RegisterDataType, LoginDataType } from "@/features/auth";

type UserProfile = {
  readonly uid: string;
  readonly email: string;
  readonly fullName?: string;
};

const syncUserProfile = async (
  user: User,
  names?: Pick<RegisterDataType, "fullName">,
): Promise<void> => {
  if (!user.email) {
    throw new Error(
      "An email address is required to create a user profile.",
    );
  }

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const existingProfile = snapshot.data();

  const existingFullName =
    typeof existingProfile?.fullName === "string"
      ? existingProfile.fullName.trim()
      : "";

  const requestedFullName = names?.fullName?.trim() ?? "";
  const providerFullName = user.displayName?.trim() ?? "";

  const fullName =
    existingFullName || requestedFullName || providerFullName;

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email,
    ...(fullName ? { fullName } : {}),
  };

  await setDoc(userRef, profile, { merge: true });
};

export const signup = async (
  data: RegisterDataType,
): Promise<void> => {
  const { fullName, email, password } = data;

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  try {
    await syncUserProfile(userCredential.user, {
      fullName,
    });
  } catch (error: unknown) {
    console.error("Failed to synchronize the user profile:", error);
    throw error;
  }

  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error("Failed to sign out after registration:", error);
  }
};

export const login = async (
  data: LoginDataType,
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    data.email.trim(),
    data.password,
  );

  return userCredential.user;
};

export const loginWithProvider = async (
  provider: AuthProvider,
): Promise<User> => {
  const userCredential = await signInWithPopup(auth, provider);

  await syncUserProfile(userCredential.user);

  return userCredential.user;
};

export const loginWithGoogle = async (): Promise<User> => {
  return loginWithProvider(googleProvider);
};

export const loginWithFacebook = async (): Promise<User> => {
  return loginWithProvider(facebookProvider);
};

export const loginWithGoogleRedirect = async (): Promise<void> => {
  await signInWithRedirect(auth, googleProvider);
};

export const loginWithFacebookRedirect = async (): Promise<void> => {
  await signInWithRedirect(auth, facebookProvider);
};

export const handleAuthRedirectResult = async (): Promise<User | null> => {
  const result = await getRedirectResult(auth);

  if (!result) {
    return null;
  }

  await syncUserProfile(result.user);

  return result.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};