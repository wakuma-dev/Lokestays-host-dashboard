import { OnboardingProgress } from "@/features/onboarding"
import OnboardingNavigation from "@/features/onboarding/components/OnboardingNavigation"
import { Outlet } from "@tanstack/react-router"
export default function OnBoardingLayout(){
    return(
        <main className="flex flex-col py-4 md:h-dvh md:overflow-hidden md:py-0 md:pb-3">
            <div className="md:min-h-0 md:flex-1 md:overflow-hidden">
                <Outlet />
            </div>
            <div className="fixed inset-x-0 bottom-0 z-10 bg-[#FDFDFD] px-4 pb-4 dark:bg-[#0A0A0A] md:static md:shrink-0 md:px-0 md:pb-0">
                <OnboardingProgress />
                <OnboardingNavigation />
            </div>
        </main>
    )
}