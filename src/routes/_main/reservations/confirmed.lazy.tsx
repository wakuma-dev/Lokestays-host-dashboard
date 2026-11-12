import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/reservations/confirmed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/reservations/confirmed"!</div>
}
