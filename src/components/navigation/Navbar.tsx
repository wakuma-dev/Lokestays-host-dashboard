import { useState } from "react"
import { MobileMenu } from "./MobileMenu";
import { ProfileMenu } from "@/features/profile";
import ThemeToggle from "./ThemeToggle";

export default function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            <div className="flex items-center gap-5">
            <ThemeToggle />
            <ProfileMenu />
            </div>
        </header>
    );
}