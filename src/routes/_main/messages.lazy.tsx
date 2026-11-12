import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/messages"!</div>
}
