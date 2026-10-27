import { createFileRoute, redirect } from "@tanstack/react-router";
import MainLayout from "@/Layouts/MainLayout";

export const Route = createFileRoute("/_main")({
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: "/login" });
    }
  },
  component: MainLayout,
});