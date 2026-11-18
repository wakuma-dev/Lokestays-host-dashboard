import { createFileRoute } from '@tanstack/react-router'
import Photos from '@/pages/Photos'
export const Route = createFileRoute('/_onboarding/properties/photos')({
  component: Photos,
})


