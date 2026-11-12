import { createFileRoute } from '@tanstack/react-router'
import ReservationsLayout from '@/Layouts/ReservationsLayout';
export const Route = createFileRoute('/_main/reservations/router')({
  component: ReservationsLayout,
});

