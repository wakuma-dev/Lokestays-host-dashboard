import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/finance/earnings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/finance/earning"!</div>
}
