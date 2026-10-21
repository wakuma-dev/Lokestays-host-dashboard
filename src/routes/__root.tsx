import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { type RouterContext } from "@/app/router/router";
import NotFound from "@/pages/NotFound";
export function RootLayout(){
    return(
    <ErrorBoundary onError={(error, info) => console.error("Render Error", error, info)}>
    <Outlet />
   </ErrorBoundary>
    );
}
export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
    notFoundComponent: NotFound,
    errorComponent: RouteErrorBoundary
});