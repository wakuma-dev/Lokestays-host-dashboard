import type { ComponentType, SVGProps } from "react";
export type SafeIcon = ComponentType<SVGProps<SVGSVGElement>>;
export interface LinkItem {
    readonly path: string;
    readonly label: string;
    readonly icon?: SafeIcon;
    readonly subLinks?: readonly LinkItem[]
}
export interface SidebarState {
    readonly isOpen: boolean;
    readonly isCollapsed: boolean;
    readonly setIsCollapsed: (isCollapsed: boolean) => void;
    readonly activePath: string;
    readonly toggleCollapse: () => void;
    readonly setActivePath: (path: string) => void;
    readonly toggleMenu: () => void;
    readonly setIsOpen: (isOpen: boolean) => void;
}