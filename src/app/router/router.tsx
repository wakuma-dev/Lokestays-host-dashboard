import { createRouter, createBrowserHistory } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { type User } from "firebase/auth";
export interface RouterContext {
  authUser: User | null;
  authLoading: boolean;
}
const history = createBrowserHistory();
export const router = createRouter({
    routeTree,
    context: {
        authUser: null,
        authLoading: false
    },
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