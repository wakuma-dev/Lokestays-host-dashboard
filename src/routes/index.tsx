import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '@/Layouts/MainLayout';
import Home from '@/pages/Home';

function Dashboard() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}

export const Route = createFileRoute('/')({
   component: Dashboard
});
