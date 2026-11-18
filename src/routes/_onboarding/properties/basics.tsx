import { createFileRoute } from '@tanstack/react-router'
import Basics from '@/pages/Basics'
export const Route = createFileRoute('/_onboarding/properties/basics')({
  component: Basics,
});
