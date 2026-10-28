// MainLayout.tsx
import type { ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex flex-1 flex-col h-full overflow-y-auto">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}