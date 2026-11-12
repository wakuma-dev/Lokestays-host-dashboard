import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/properties/$propertyId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/properties/$propertyId/edit"!</div>
}
