import { createFileRoute, redirect } from "@tanstack/react-router";
import MainLayout from "@/Layouts/MainLayout";
import { hasHostProperties } from "@/features/properties";
import { auth } from "@/lib/firebase/auth";

export const Route = createFileRoute("/_main")({
  beforeLoad: async ({ context }) => {
    let user = context.authUser;
    if (context.authLoading) {
      await auth.authStateReady();
      user = auth.currentUser;
    }

    if (!user) {
      throw redirect({ to: "/login" });
    }

    const hasProperties = await hasHostProperties(user.uid);
    if (!hasProperties) {
      throw redirect({ to: "/properties/about" });
    }
  },
  component: MainLayout,
});