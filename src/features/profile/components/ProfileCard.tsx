import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfileAvatarBackgroundColor } from "./profileAvatarColor";
export const PROFILE_INFORMATION_SECTION_ID = "profile-information";
interface ProfileCardProps {
    fullName: string;
    userId: string;
    targetSectionId?: string;
    onGetStartedClick?: () => void;
}
export default function ProfileCard({fullName, userId, targetSectionId = PROFILE_INFORMATION_SECTION_ID,
  onGetStartedClick}: ProfileCardProps){
    const { initials, backgroundColor } = useMemo(() => {
    const cleanName = fullName.trim();
    const extractedInitials = cleanName
      ? cleanName
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join("")
      : "";

    return {
      initials: extractedInitials,
      backgroundColor: getProfileAvatarBackgroundColor(userId.trim() || cleanName),
    };
  }, [fullName, userId]);
  const handleScrollToProfileInformation = (): void => {
    if (onGetStartedClick) {
      onGetStartedClick();
      return;
    }
   const targetElement = document.getElementById(targetSectionId);
    if (!targetElement) {
      return;
    }
   const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };
    return(
    <div className="flex flex-col gap-3">
    <div className="w-full flex flex-1 flex-col items-center gap-8 lg:flex-row lg:items-stretch">
    <div className="flex w-full flex-col items-center gap-4 lg:w-[400px] lg:items-start">
    <div className="flex items-center gap-2.5">
    <h1 className="text-[32px] leading-[36px] tracking-tight font-semibold">About me</h1>
    <Button 
      type="button"
      variant="ghost"
      onClick={handleScrollToProfileInformation}
      className="cursor-pointer text-[12px] leading-[16px] font-medium">
        Edit
      </Button>
    </div>
    <Card className="w-full dark:bg-[#0C1016] overflow-hidden shadow-md lg:w-[400px]">
        <CardContent className="flex w-full flex-col items-center justify-center gap-2.5 p-4">
         <Avatar className="size-24">
            <AvatarFallback style={{backgroundColor}} className="font-semibold text-white select-none text-[32px] leading-[36px]">
                {initials}
            </AvatarFallback>
         </Avatar>
         <div className="min-w-0 flex-1 flex flex-col items-center space-y-1">
            <span className="text-[32px] tracking-tight leading-[36px] font-semibold capitalize">{fullName}</span>
            <span className="text-[12px] leading-[16px] text-muted-foreground font-normal tracking-normal">Host</span>
         </div>
        </CardContent>
     </Card>
     </div>
     <div className="max-w-xs hidden lg:flex flex-col justify-center gap-2.5">
        <h2 className="text-[22px] leading-[26px] font-medium">Complete your profile</h2>
        <p className="text-[15px] leading-[20px] text-[#3e3529] dark:text-[#cec8b2] font-normal">Your Airbnb profile is an important part of every reservation. Complete yours to help other hosts and guests get to know you.</p>
        <Button type="button"
                 variant="default"
                 onClick={handleScrollToProfileInformation}
                 className="cursor-pointer text-[16px] leading-[20px] font-medium w-fit bg-[#69bc75] text-white">
                  Get started
                 </Button>
    </div>
   </div>
   <div className="hidden lg:block border border-b dark:border-[#CDC6B9] mt-4" />
   </div> 
    );
}