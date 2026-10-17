import { createRouter, createBrowserHistory } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

const history = createBrowserHistory();
export const router = createRouter({
    routeTree,
    basepath: "/Lokestays-host-dashboard",
    defaultPreload: "intent",
    scrollRestoration: true,
    history
});
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}