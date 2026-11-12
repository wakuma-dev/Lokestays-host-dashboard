import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/reservations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/reservations/"!</div>
}
