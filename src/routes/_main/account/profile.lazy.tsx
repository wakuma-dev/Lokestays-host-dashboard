import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/account/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/account/profile"!</div>
}
