import { Helmet } from "react-helmet-async";
import { PropertiesTable } from "@/features/properties";
export default function Home() {
  return (
    <main className="p-4 min-w-0 bg-[#ffffff] text-[#201b15] lg:px-6
     dark:bg-[#0A0A0A] dark:text-[#FFFFFF]">
      <Helmet>
        <title>Dashboard | Lokestays Host</title>
        <meta
          name="description"
          content="Manage your rental properties, track reservations, monitor your earnings, and grow your hosting business with the Lokestays Host Dashboard."
        />
      </Helmet>
       <PropertiesTable
         hideCheckbox
         hidePagination
         hideSearch
         hideActions
         hideSorting
         pageSize={5}
       />
      </main>
    );
}