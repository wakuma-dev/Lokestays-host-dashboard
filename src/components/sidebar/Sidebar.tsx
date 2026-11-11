import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Shield, FileText } from "lucide-react";

export default function Sidebar(){
    return (
        <aside className="flex w-16 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground sm:w-60">
            <div className="flex h-16 items-center border-b px-4">
                <span className="truncate text-base font-bold tracking-tight">Lokestays</span>
            </div>
            <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-1 p-2 sm:p-3">
                <Link
                    to="/"
                    activeOptions={{ exact: true }}
                    className="flex items-center justify-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:justify-start"
                    activeProps={{ className: "bg-sidebar-accent font-medium text-sidebar-accent-foreground" }}
                    aria-label="Dashboard"
                >
                    <LayoutDashboard aria-hidden="true" className="size-4 shrink-0" />
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="mt-auto flex flex-col gap-1 border-t pt-3">
                    <Link
                        to="/terms-of-services"
                        className="flex items-center justify-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:justify-start"
                        aria-label="Terms of service"
                    >
                        <FileText aria-hidden="true" className="size-4 shrink-0" />
                        <span className="hidden sm:inline">Terms of service</span>
                    </Link>
                    <Link
                        to="/privacy-policy"
                        className="flex items-center justify-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:justify-start"
                        aria-label="Privacy policy"
                    >
                        <Shield aria-hidden="true" className="size-4 shrink-0" />
                        <span className="hidden sm:inline">Privacy policy</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
}