import { createFileRoute } from '@tanstack/react-router'
import Amenities from '@/pages/Amenities'
export const Route = createFileRoute('/_onboarding/properties/amenities')({
  component: Amenities,
})

