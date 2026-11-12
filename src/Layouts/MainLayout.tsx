import type { ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/navigation";
import { Sidebar } from "@/components/sidebar";

type MainLayoutProps = {
  readonly children?: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 flex-1">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}