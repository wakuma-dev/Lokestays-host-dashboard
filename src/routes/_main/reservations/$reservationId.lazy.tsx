import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/reservations/$reservationId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/reservations/$reservationId"!</div>
}
