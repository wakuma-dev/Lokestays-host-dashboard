import { auth } from "@/lib/firebase/auth";
import { createPropertyDraft } from "@/features/onboarding/api/onboarding.api";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
export async function initializePropertyDraft(): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be authenticated to create a property.");
  }
  const { draftId } = await createPropertyDraft({
    hostId: currentUser.uid,
    initialStep: "structure",
  });
  useOnboardingStore.getState().setDraftId(draftId);
  return draftId;
}