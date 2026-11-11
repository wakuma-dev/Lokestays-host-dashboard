import { useMenuStore } from "./sidebar.store";
import SidebarMenu from "./SidebarMenu";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Sidebar(){
      const isCollapsed = useMenuStore((state) => state.isCollapsed);
    return(
       <motion.aside
      role="complementary"
      animate={{ width: isCollapsed ? 80 : 300 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 hidden border-r border-r-[#E5E7EB]
       dark:border-r-[#27272a] h-screen shrink-0 dark:bg-[#111111] 
        dark:text-[#cec8b2] bg-[#FFFFFF] text-[#3e3529]
         flex-col justify-between overflow-hidden lg:flex">
        <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center px-4">
          <Logo />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarMenu />
        </div>
        </div>
         <div className="border-t border-[#e5e7eb] dark:border-[#27272a] p-4">
        <p className="text-xs text-zinc-500 truncate">
          {isCollapsed ? "v1.0" : "System Platform v1.0"}
        </p>
      </div>
      </motion.aside>
    )
}