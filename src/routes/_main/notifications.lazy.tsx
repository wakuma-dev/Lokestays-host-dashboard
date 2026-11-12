import { createLazyFileRoute } from '@tanstack/react-router'
export const Route = createLazyFileRoute('/_main/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/messages"!</div>
}