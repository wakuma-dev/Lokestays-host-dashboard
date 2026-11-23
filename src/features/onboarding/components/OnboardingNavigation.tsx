import { type ReactElement, memo, useState } from "react";
import {
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { onboardingSteps } from "@/features/onboarding";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "../store/onboardingStore";
import {
  submitPropertyDraft,
  updatePropertyDraft,
} from "../api/onboarding.api";
import { initializePropertyDraft } from "../lib/initializePropertyDraft";
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
  const draftId = useOnboardingStore((state) => state.draftId);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(
    null,
  );
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
  const isBusy =
    externalSubmitting || isInitializing || isSubmitting;
  const ensurePropertyDraft = async (): Promise<string> => {
    const existingDraftId = useOnboardingStore.getState().draftId;
    if (existingDraftId) {
      return existingDraftId;
    }
    setIsInitializing(true);
    try {
      const newDraftId = await initializePropertyDraft();
      return newDraftId;
    } finally {
      setIsInitializing(false);
    }
  };
  const handleBack = (): void => {
    if (!previousStep || isBusy || isSubmitted) {
      return;
    }
    setNavigationError(null);
    void navigate({
      to: previousStep.path,
    });
  };
  const handleSubmit = async (): Promise<void> => {
    if (isBusy || !isValid || isSubmitted) {
      return;
    }
    setIsSubmitting(true);
    setNavigationError(null);
    try {
      const state = useOnboardingStore.getState();
      const currentDraftId = state.draftId ?? (await ensurePropertyDraft());
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
        ...(state.pricePerNight > 0
          ? { pricePerNight: state.pricePerNight }
          : {}),
        currency: state.currency,
        currentStep: "pricing",
      });
      await submitPropertyDraft(currentDraftId);
      useOnboardingStore.getState().setStatus("pending");
      setIsSubmitted(true);
    } catch (error: unknown) {
      setNavigationError(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your property.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleContinue = async (): Promise<void> => {
    if (isBusy || !isValid || isSubmitted) {
      return;
    }
    setNavigationError(null);
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
      setNavigationError(
        error instanceof Error
          ? error.message
          : "Failed to initialize your property draft.",
      );
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
          disabled={isBusy || isSubmitted}
          onClick={handleBack}
          aria-label="Go to previous onboarding step"
          className="px-4 py-2 text-[15px] leading-[20px]"
        >
          Back
        </Button>
      )}
      <Button
        type="button"
        disabled={!isValid || isBusy || isSubmitted}
        onClick={() => {
          void handleContinue();
        }}
        aria-busy={isBusy}
        className="px-6 py-3 text-sm font-medium"
      >
        {isSubmitted
          ? "Property submitted"
          : isInitializing
            ? "Creating property..."
            : isSubmitting
              ? "Submitting..."
              : externalSubmitting
                ? "Saving..."
                : isFirstStep && !draftId
                  ? "Create property"
                  : isLastStep
                    ? "Submit property"
                    : "Continue"}
      </Button>
      {navigationError && (
        <p
          role="alert"
          className="ml-3 text-sm text-red-600 dark:text-red-400"
        >
          {navigationError}
        </p>
      )}
      {isSubmitted && (
        <p
          role="status"
          className="ml-3 text-sm text-green-600 dark:text-green-400"
        >
          Your property has been submitted for review.
        </p>
      )}
    </div>
  );
}
export const OnboardingNavigation = memo(
  OnboardingNavigationComponent,
);
export default OnboardingNavigation;