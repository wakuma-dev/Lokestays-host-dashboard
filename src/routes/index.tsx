import { createFileRoute } from '@tanstack/react-router'
import Home from '@/pages/Home';
import MainLayout from '@/Layouts/MainLayout';

export const Route = createFileRoute('/')({
   component: () => (
      <MainLayout>
         <Home />
      </MainLayout>
   )
});
