// Home.tsx
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <div className=" bg-white  min-h-full">
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
      </div>
    
  );
}