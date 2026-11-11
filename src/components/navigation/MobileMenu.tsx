import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import SidebarMenu from "../sidebar/SidebarMenu";
import { useMenuStore } from "../sidebar/sidebar.store";
import { Button } from "../ui/button";

interface MobileMenuProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
}
export function MobileMenu({
  isOpen,
  onOpenChange,
}: MobileMenuProps): React.JSX.Element {
  const toggleSidebar = useMenuStore((state) => state.toggleCollapse);

  return (
    <>
      {/* Desktop sidebar toggle */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle navigation sidebar"
        className="
          hidden size-10 shrink-0 items-center justify-center
          bg-white  text-[#222222] dark:bg-[#0a0a0a] cursor-pointer
          rounded-lg text-gray-700
          hover:bg-[#f3f4f6]
          hover:dark:bg-[#18181b]
          dark:text-gray-200 
          lg:inline-flex
        "
      >
        <Menu className="size-5" aria-hidden="true" />
      </Button>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(true)}  
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="
            inline-flex size-10 shrink-0
            items-center justify-center border-none
             text-[#222222] dark:text-[#a6adbb] bg-transparent cursor-pointer"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>

      </div>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
                className="fixed inset-0 z-[100] "
              />
              <motion.aside
                key="mobile-menu-drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                }}
                aria-label="Mobile navigation"
                className="
                  fixed inset-y-0 left-0 z-[100]
                  flex w-72 max-w-[85vw] flex-col
                  justify-between border-r border-gray-200
                  bg-white text-gray-900 shadow-2xl
                  dark:border-gray-800
                  dark:bg-[#000000] dark:text-white
                "
              >
                <div className="flex min-h-0 flex-1 flex-col">
                  <div
                    className="
                      flex h-16 p-4 shrink-0 items-center
                      justify-between border-b border-gray-200 pb-4
                      dark:border-gray-800
                    "
                  >
                    <h2 className="text-xl font-bold tracking-wide">
                      Lokestays 
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      aria-label="Close navigation menu"
                      className="
                        size-9 shrink-0 rounded-lg bg-transparent
                        text-[#222222] border-none dark:text-[#A6ADBB]"
                    >
                      <X className="size-5" aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <SidebarMenu
                      variant="mobile"
                      onItemClick={() => onOpenChange(false)}
                    />
                  </div>
                </div>
                <div
                  className="
                    shrink-0 border-t border-gray-200 pt-4
                    dark:border-gray-800
                  "
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Lokestays Admin · v1.0
                  </p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}