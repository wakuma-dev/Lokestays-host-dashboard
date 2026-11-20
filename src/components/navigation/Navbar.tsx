import { useState } from "react"
import { MobileMenu } from "./MobileMenu";
import { ProfileAvatar, useProfileQuery } from "@/features/profile";
import { useAuthStore } from "@/features/auth";
import ThemeToggle from "./ThemeToggle";
export default function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
    const { data: profile } = useProfileQuery(user?.uid ?? "");
    const fullName = profile?.fullName ?? user?.displayName ?? "";
   return (
        <header className="sticky top-0 z-50 backdrop-blur-md p-4 lg:p-6 h-16 
         flex h-16 shrink-0 items-center justify-between  dark:bg-[#111111] 
        dark:text-[#cec8b2] bg-[#FFFFFF] text-[#3e3529] border-b bg-background w-full">
        <div className="flex items-center gap-3">
         <MobileMenu 
           isOpen={isMenuOpen}
           onOpenChange={setIsMenuOpen}
           />
         </div>
            <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <ProfileAvatar fullName={fullName} userId={user?.uid} />
            </div>
        </header>
    );
}