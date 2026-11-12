import { createLazyFileRoute } from '@tanstack/react-router'
import Create from '@/pages/Create'
export const Route = createLazyFileRoute('/_main/properties/create')({
  component: Create,
})


