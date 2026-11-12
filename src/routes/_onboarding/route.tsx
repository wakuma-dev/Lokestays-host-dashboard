import { createFileRoute } from '@tanstack/react-router'
import OnBoardingLayout from '@/Layouts/OnboardingLayout'
export const Route = createFileRoute('/_onboarding')({
  component: OnBoardingLayout,
});
