import { type ReactElement, memo, useState } from "react";
import {
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { onboardingSteps } from "@/features/onboarding";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useOnboardingStore } from "../store/onboardingStore";
import {
  getPropertyDraftById,
  submitPropertyDraft,
  updatePropertyDraft,
} from "../api/onboarding.api";
import { initializePropertyDraft } from "../lib/initializePropertyDraft";
import { auth } from "@/lib/firebase/auth";
export interface OnboardingNavigationProps {
  readonly onContinue?: () => void;
  readonly isSubmitting?: boolean;
  readonly isValid?: boolean;
}
function OnboardingNavigationComponent({
  onContinue,
  isSubmitting: externalSubmitting = false,
  isValid = true,
}: OnboardingNavigationProps): ReactElement {
  const navigate = useNavigate();
  const { add } = useToast();
  const paymentProvider = useOnboardingStore(
    (state) => state.paymentProvider,
  );
  const paymentAccount = useOnboardingStore(
    (state) => state.paymentAccount,
  );
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const currentIndex = onboardingSteps.findIndex(
    (step) => step.path === pathname,
  );
  const safeIndex = currentIndex !== -1 ? currentIndex : 0;
  const previousStep = onboardingSteps[safeIndex - 1];
  const nextStep = onboardingSteps[safeIndex + 1];
  const isFirstStep = safeIndex === 0;
  const isLastStep = safeIndex === onboardingSteps.length - 1;
  const paymentDetailsReady =
    paymentProvider !== null && paymentAccount.trim().length > 0;
  const isBusy =
    externalSubmitting || isInitializing || isSubmitting;
  const ensurePropertyDraft = async (): Promise<string> => {
    setIsInitializing(true);
    try {
      const existingDraftId = useOnboardingStore.getState().draftId;
      if (existingDraftId) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("Authentication required.");
        }
        const existingDraft = await getPropertyDraftById(
          existingDraftId,
          currentUser.uid,
        );
        if (existingDraft?.status === "draft") {
          return existingDraftId;
        }
        useOnboardingStore.getState().resetOnboarding();
      }
      return await initializePropertyDraft();
    } finally {
      setIsInitializing(false);
    }
  };
  const handleBack = (): void => {
    if (!previousStep || isBusy) {
      return;
    }
    void navigate({
      to: previousStep.path,
    });
  };
  const handleSubmit = async (): Promise<void> => {
    if (isBusy || !isValid) {
      return;
    }
    setIsSubmitting(true);
    try {
      const currentDraftId = await ensurePropertyDraft();
      const state = useOnboardingStore.getState();
      const propertyLocation = state.location;
      const location =
        propertyLocation &&
        propertyLocation.latitude !== null &&
        propertyLocation.longitude !== null
          ? {
              latitude: propertyLocation.latitude,
              longitude: propertyLocation.longitude,
              address: propertyLocation.address,
              city: propertyLocation.city,
              neighborhood: propertyLocation.neighborhood,
            }
          : null;
      await updatePropertyDraft(currentDraftId, {
        structure: state.structure,
        privacyType: state.privacyType,
        location,
        guestCapacity: state.guestCapacity,
        bedrooms: state.bedrooms,
        beds: state.beds,
        bathrooms: state.bathrooms,
        amenities: [...state.amenities],
        roomAmenities: [...state.roomAmenities],
        photos: [...state.photos],
        paymentProvider: state.paymentProvider,
        paymentAccount: state.paymentAccount,
        ...(state.pricePerNight > 0
          ? { pricePerNight: state.pricePerNight }
          : {}),
        currency: state.currency,
        currentStep: "pricing",
      });
      await submitPropertyDraft(currentDraftId);
      useOnboardingStore.getState().resetOnboarding();
      add({
        type: "success",
        title: "Property submitted",
        description: "Your property has been submitted for review.",
      });
      await navigate({
        to: onboardingSteps[0].path,
      });
    } catch (error: unknown) {
      add({
        type: "error",
        title: "Property submission failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while submitting your property.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleContinue = async (): Promise<void> => {
    if (isBusy || !isValid) {
      return;
    }
    if (isLastStep) {
      await handleSubmit();
      return;
    }
    try {
      await ensurePropertyDraft();
      if (onContinue) {
        onContinue();
        return;
      }
      if (nextStep) {
        await navigate({
          to: nextStep.path,
        });
      }
    } catch (error: unknown) {
      add({
        type: "error",
        title: "Unable to continue property setup",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initialize your property draft.",
      });
    }
  };
  return (
    <div
      className={`flex w-full items-center pt-2 px-4 md:px-6 ${
        previousStep ? "justify-between" : "justify-end"
      }`}
    >
      {previousStep && (
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={handleBack}
          aria-label="Go to previous onboarding step"
          className="px-4 py-2 text-[15px] leading-[20px]"
        >
          Back
        </Button>
      )}
      <Button
        type="button"
        disabled={
          !isValid ||
          (isLastStep && !paymentDetailsReady) ||
          isBusy
        }
        onClick={() => {
          void handleContinue();
        }}
        aria-busy={isBusy}
        className="px-6 py-3 text-sm font-medium"
      >
        {isBusy
          ? "..."
          : isFirstStep
            ? "Create property"
            : isLastStep
              ? "Submit property"
              : "Continue"}
      </Button>
    </div>
  );
}
export const OnboardingNavigation = memo(
  OnboardingNavigationComponent,
);
export default OnboardingNavigation;