import { createLazyFileRoute } from '@tanstack/react-router'
import Profile from '@/pages/Profile'
export const Route = createLazyFileRoute('/_main/account/profile')({
  component: Profile,
});


