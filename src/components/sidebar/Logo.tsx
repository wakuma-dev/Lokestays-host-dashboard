import { Link } from "@tanstack/react-router";
import { useMenuStore } from "./sidebar.store";
import type { JSX } from "react";
export default function Logo(): JSX.Element {
  const isCollapsed = useMenuStore((state) => state.isCollapsed);
  return (
    <Link
      to="/en"
      aria-label="Lokestays host dashboard"
      className="inline-flex w-full items-center px-4 font-serif font-semibold tracking-tight text-[#0F766E] text-[30px] leading-[36px] h-16 shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-inset"
    >
      <span className="truncate">
        {isCollapsed ? "L" : "Lokestays"}
      </span>
    </Link>
  );
}