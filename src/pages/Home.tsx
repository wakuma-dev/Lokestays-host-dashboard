// Home.tsx
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <div className="flex-1 bg-white p-6 md:p-8 min-h-full">
      <Helmet>
        <title>Dashboard | Lokestays Host</title>
        <meta
          name="description"
          content="Manage your rental properties, track reservations, monitor your earnings, and grow your hosting business with the Lokestays Host Dashboard."
        />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-neutral-400 mt-1 text-sm md:text-base">
          Welcome back. Here is what's happening with your properties today.
        </p>
      </div>
    </div>
  );
}