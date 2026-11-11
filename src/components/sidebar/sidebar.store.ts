import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type { SidebarState} from "./index";
const isDevelopment = typeof import.meta !== "undefined" && import.meta.env 
  ? import.meta.env.DEV 
  : true;
export const useMenuStore = create<SidebarState>()(
    devtools(persist((set) => ({
        isOpen: false,
        isCollapsed: false,
        activePath: "",
        toggleMenu: () => set((state) => ({
            isOpen: !state.isOpen
        }), false, "sidebar/toggleMenu"),
        toggleCollapse: () => set((state) => ({
            isCollapsed: !state.isCollapsed
        }), false, "sidebar/toggleCollapse"),
        setActivePath: (activePath) => set({activePath}, false, "sidebar/setActivePath"),
        setIsOpen: (isOpen) => set({isOpen}, false, "sidebar/setIsOpen"),
        setIsCollapsed: (isCollapsed) => set({isCollapsed})
    }),{
        name: "lokestays-host-sidebar",
        storage: createJSONStorage(() => (typeof window !== undefined ? localStorage : {
        getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        })),
        partialize: (state) => ({
          isCollapsed: state.isCollapsed,
        }),
      }
    ),
    { name: "SidebarStore", enabled: isDevelopment }
  )
);