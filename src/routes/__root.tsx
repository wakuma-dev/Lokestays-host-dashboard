import { createRootRoute, Outlet } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export function RootLayout(){
    return(
    <ErrorBoundary onError={(error, info) => console.error("Render Error", error, info)}>
    <Outlet />
   </ErrorBoundary>
    );
}
export const Route = createRootRoute({
    component: RootLayout,
    errorComponent: RouteErrorBoundary
});