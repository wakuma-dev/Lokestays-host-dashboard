import { createLazyFileRoute } from '@tanstack/react-router'
import AllProperties from '@/pages/AllProperties'
export const Route = createLazyFileRoute('/_main/properties/')({
  component: AllProperties,
})

