import { type ReactElement, memo } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { onboardingSteps } from "@/features/onboarding"
import { Button } from "@/components/ui/button";
export interface OnboardingNavigationProps {
    readonly onContinue?: () => void;
    readonly isSubmitting?: boolean;
    readonly isValid?: boolean;
}
function OnboardingNavigationComponent({
    onContinue,
    isSubmitting = false,
    isValid = true,
}: OnboardingNavigationProps): ReactElement {
    const navigate = useNavigate();

    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });

    const currentIndex = onboardingSteps.findIndex(
        (step) => step.path === pathname,
    );

    const safeIndex = currentIndex !== -1 ? currentIndex : 0;
    const previousStep = onboardingSteps[safeIndex - 1];
    const nextStep = onboardingSteps[safeIndex + 1];
    const isLastStep = safeIndex === onboardingSteps.length - 1;

    const handleBack = (): void => {
        if (previousStep && !isSubmitting) {
            void navigate({ to: previousStep.path });
        }
    };

    const handleContinue = (): void => {
        if (isSubmitting || !isValid) {
            return;
        }
        if (onContinue) {
            onContinue();
        } else if (nextStep) {
            void navigate({ to: nextStep.path });
        }
    };

    return (
        <div className={`flex w-full items-center pt-2 px-4 md:px-6 ${previousStep ? "justify-between" : "justify-end"}`}>
            {previousStep && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={handleBack}
                    aria-label="Go to previous onboarding step"
                    className="px-4 py-2 text-[15px] leading-[20px]"
                >
                    Back
                </Button>
            )}

            <Button
                type="button"
                disabled={!isValid || isSubmitting}
                onClick={handleContinue}
                aria-busy={isSubmitting}
                className="px-6 py-3 text-sm font-medium"
            >
                {isSubmitting
                    ? "Saving..."
                    : isLastStep
                    ? "Submit property"
                    : "Continue"}
            </Button>
        </div>
    );
}

export const OnboardingNavigation = memo(OnboardingNavigationComponent);
export default OnboardingNavigation;