import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LinkItem } from "./sidebar.types";
import { useMenuStore } from "./sidebar.store";
import type { JSX } from "react";
import {
  ChevronRight,
  LayoutDashboard,
  ChartNoAxesCombined,
  House,
  Plus,
  CalendarDays,
  Clock,
  CircleCheck,
  CircleX,
  ClipboardList,
  Wallet,
  ArrowLeftRight,
  Banknote,
  MessageCircle,
  Bell,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
  Settings,
  Headset,
} from "lucide-react";

/**
 * @constant sidebarLinks
 * @description Centralized navigation configuration structured with correct semantic mappings 
 * (label for display, path for route resolution) and hierarchical sub-links.
 */
const sidebarLinks: readonly LinkItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/dashboard/analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
  },
  {
    path: "/properties",
    label: "Properties",
    icon: House,
    subLinks: [
      {
        path: "/properties",
        label: "All Properties",
        icon: House,
      },
      {
        path: "/properties/create",
        label: "Add Property",
        icon: Plus,
      },
      {
        path: "/properties/availability",
        label: "Availability",
        icon: CalendarDays,
      },
    ],
  },
  {
    path: "/reservations",
    label: "Reservations",
    icon: ClipboardList,
    subLinks: [
      {
        path: "/reservations",
        label: "All Reservations",
        icon: ClipboardList,
      },
      {
        path: "/reservations/pending",
        label: "Pending",
        icon: Clock,
      },
      {
        path: "/reservations/confirmed",
        label: "Confirmed",
        icon: CircleCheck,
      },
      {
        path: "/reservations/cancelled",
        label: "Cancelled",
        icon: CircleX,
      },
    ],
  },
  {
    path: "/finance/earnings",
    label: "Finance",
    icon: Wallet,
    subLinks: [
      {
        path: "/finance/earnings",
        label: "Earnings",
        icon: Wallet,
      },
      {
        path: "/finance/transactions",
        label: "Transactions",
        icon: ArrowLeftRight,
      },
      {
        path: "/finance/payouts",
        label: "Payouts",
        icon: Banknote,
      },
    ],
  },
  {
    path: "/messages",
    label: "Messages",
    icon: MessageCircle,
  },
  {
    path: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    path: "/account/profile",
    label: "Account",
    icon: UserRound,
    subLinks: [
      {
        path: "/account/profile",
        label: "Profile",
        icon: UserRound,
      },
      {
        path: "/account/business",
        label: "Business Details",
        icon: BriefcaseBusiness,
      },
      {
        path: "/account/verification",
        label: "Verification",
        icon: ShieldCheck,
      },
    ],
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    path: "/support",
    label: "Help & Support",
    icon: Headset,
  },
];

interface SidebarMenuProps {
  readonly onItemClick?: () => void;
  readonly variant?: "desktop" | "mobile";
}

/**
 * @component SidebarMenu
 * @description Production-grade navigation menu supporting responsive collapsing, 
 * active route matching, and recursive expandable sub-navigation groups.
 * 
 * Algorithmic Complexity:
 * - Tree traversal & path matching: O(N + M) where N is top-level items and M is total sub-links.
 */
export default function SidebarMenu({ onItemClick, variant }: SidebarMenuProps): JSX.Element {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const isMobile = variant === "mobile";
  const isCollapsed = useMenuStore((state) => state.isCollapsed) && !isMobile;

  // Track expanded accordion state for parent items containing subLinks
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    if (isCollapsed) return; // Prevent expansion when sidebar is collapsed
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1.5 px-4 py-2">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const hasSubLinks = link.subLinks && link.subLinks.length > 0;
        const isChildActive = hasSubLinks && link.subLinks?.some((sub) => currentPath === sub.path);
        const isActive = currentPath === link.path || isChildActive;
        const isExpanded = expandedItems[link.label] || isChildActive;

        return (
          <div key={link.label} className="flex flex-col">
            {hasSubLinks ? (
              <button
                type="button"
                onClick={() => toggleExpand(link.label)}
                aria-expanded={isExpanded}
                className={`flex items-center justify-between rounded-lg py-2.5 px-4 text-[15px] leading-[20px] cursor-pointer font-medium transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isMobile
                    ? isActive
                      ? "bg-gray-100 text-gray-900 font-semibold dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    : isActive
                    ? "bg-white/10 text-[#3e3529] font-semibold"
                    : "text-[#222222] dark:text-[#cec8b2] hover:dark:bg-[#1B1B1B] hover:bg-[#FAFAFA] hover:dark:text-white hover:text-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden text-left"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {!isCollapsed && (
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              <Link
                to={link.path}
                onClick={onItemClick}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg py-2.5 px-4 text-[15px] leading-[20px] cursor-pointer font-medium transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isMobile
                    ? isActive
                      ? "bg-gray-100 text-gray-900 font-semibold dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    : isActive
                    ? "bg-white/10 text-white font-semibold"
                    : "text-[#222222] dark:text-[#cec8b2] hover:dark:text-white hover:dark:bg-[#1b1b1b] hover:bg-[#FAFAFA] hover:text-black"
                }`}
              >
                {Icon && <Icon className="h-5 w-5 shrink-0" />}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}

            {/* Sub-links / Accordion tree */}
            {hasSubLinks && !isCollapsed && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col gap-1 pl-9 pr-2 py-1"
                  >
                    {link.subLinks!.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentPath === sub.path;
                      return (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={onItemClick}
                          aria-current={isSubActive ? "page" : undefined}
                          className={`flex items-center gap-2.5 rounded-md py-2 px-3 text-[14px] leading-[18px] font-medium transition-colors ${
                            isSubActive
                              ? "bg-white/15 text-white font-semibold"
                              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
                          }`}
                        >
                          {SubIcon && <SubIcon className="h-4 w-4 shrink-0" />}
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </nav>
  );
}