import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/finance/transactions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/finance/transactions"!</div>
}
