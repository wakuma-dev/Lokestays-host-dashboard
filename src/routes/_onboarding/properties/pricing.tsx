import { createFileRoute } from '@tanstack/react-router'
import Pricing from '@/pages/Pricing'
export const Route = createFileRoute('/_onboarding/properties/pricing')({
  component: Pricing,
})
