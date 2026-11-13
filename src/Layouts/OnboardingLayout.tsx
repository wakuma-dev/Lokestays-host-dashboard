import { OnboardingProgress } from "@/features/onboarding"
import OnboardingNavigation from "@/features/onboarding/components/OnboardingNavigation"
import { Outlet } from "@tanstack/react-router"
export default function OnBoardingLayout(){
    return(
        <main className="flex flex-col py-4 md:h-dvh md:py-0 md:pb-3">
        <header className="sticky top-0 z-50 h-16 w-full border-b bg-[#FDFDFD] dark:bg-[#0A0A0A] md:bg-[#FDFDFD]/90 md:backdrop-blur-sm md:dark:bg-[#0A0A0A]/90">
        <div className="h-full flex items-center justify-between px-4 md:px-6">
            <span className="text-[] font-medium tracking-tight">Lokestays</span>
        </div>
        </header>
            <div className="md:min-h-0 md:flex-1 md:overflow-y-auto">
                <Outlet />
            </div>
            <div className="fixed inset-x-0 bottom-0 z-10 bg-[#FDFDFD] pb-4 dark:bg-[#0A0A0A] md:static md:shrink-0 md:px-0 md:pb-0">
                <OnboardingProgress />
                <OnboardingNavigation />
            </div>
        </main>
    )
}