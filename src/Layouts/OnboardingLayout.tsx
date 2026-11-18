import { OnboardingProgress } from "@/features/onboarding";
import OnboardingNavigation from "@/features/onboarding/components/OnboardingNavigation";
import { Outlet } from "@tanstack/react-router";

export default function OnBoardingLayout() {
  return (
    <main className="min-h-dvh w-full">
      {/* Fixed navbar */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 w-full border-b bg-[#FDFDFD] dark:bg-[#0A0A0A]">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <span className="font-medium tracking-tight">Lokestays</span>
        </div>
      </header>
      <div className="w-full pt-16">
        <Outlet />
      </div>

      {/* Fixed onboarding navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#FDFDFD] pb-4 dark:bg-[#0A0A0A]">
        <OnboardingProgress />
        <OnboardingNavigation />
      </div>
    </main>
  );
}
