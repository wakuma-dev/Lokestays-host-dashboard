import { createLazyFileRoute } from '@tanstack/react-router'
import BusinessDetails from '@/pages/BuinessDetails'
export const Route = createLazyFileRoute('/_main/account/businessDetails')({
  component: BusinessDetails,
})
