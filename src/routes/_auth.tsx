import { createFileRoute } from '@tanstack/react-router'
import AuthLayout from '@/Layouts/AuthLayout'
export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});
