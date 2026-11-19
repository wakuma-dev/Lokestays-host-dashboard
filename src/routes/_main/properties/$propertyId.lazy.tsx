import { createLazyFileRoute } from '@tanstack/react-router'
import PropertyDetails from '@/pages/PropertyDetails'
export const Route = createLazyFileRoute('/_main/properties/$propertyId')({
  component: PropertyDetails,
});


