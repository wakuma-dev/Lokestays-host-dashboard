// Home.tsx
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <main className="min-w-0 text-[#fff] min-h-screen h-auto bg-[#FDFDFD] dark:bg-[#0A0A0A] ">
      <Helmet>
        <title>Dashboard | Lokestays Host</title>
        <meta
          name="description"
          content="Manage your rental properties, track reservations, monitor your earnings, and grow your hosting business with the Lokestays Host Dashboard."
        />
      </Helmet>
        <p>
          Welcome back. Here is what's happening with your properties today.
        </p>
      </main>
    );
}