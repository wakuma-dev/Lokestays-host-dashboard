import { type ReactElement, memo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { onboardingSteps } from "@/features/onboarding"
function OnboardingProgressComponent(): ReactElement {
    const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const currentIndex = onboardingSteps.findIndex(
    (step) => step.path === pathname,
  );
  const currentStep = currentIndex !== -1 ? currentIndex + 1 : 1;
  const totalSteps = onboardingSteps.length;
  const progress = ((currentStep / totalSteps) * 100);
  const activeTitle = onboardingSteps[currentIndex]?.title ?? onboardingSteps[0].title;
  return (
    <div className="w-full space-y-3">
      <div className="w-full md:px-6 flex items-center justify-between text-sm p-4">
        <span className="font-medium">
          {activeTitle}
        </span>

        <span className="text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden  bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export const OnboardingProgress = memo(OnboardingProgressComponent);
export default OnboardingProgress;