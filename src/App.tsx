import { useEffect } from "react";
import useAuth from "./features/auth/hooks/useAuth";
import { useAuthStore } from "./features/auth/store/authStore";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router/router";
export default function App(){
  const authUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  useEffect(() => {
  const unsubscribe = useAuth();
  return unsubscribe;
  }, []);
  return(
  <RouterProvider router={router}
   context={{authUser, authLoading}}
  />
  )
}