import { Helmet } from "react-helmet-async";
import { PropertiesTable } from "@/features/properties";
export default function AllProperties(){
    const header = "Your properties";
    const paragraph = "Manage your listings, update property details, and keep track of your accommodation on Lokestays.";
    return(
        <main 
          className="min-w-0 text-[#fff] min-h-screen h-auto bg-[#FDFDFD] dark:bg-[#0A0A0A]">
        <Helmet>
            <title></title>
            <meta name="description"
                  content=""
                  />
        </Helmet>
        <div className="flex flex-col gap-1 p-4 pb-2">
                <h1 className="text-xl font-semibold tracking-tight">{header}</h1>
                <span className="text-[15px] font-normal leading-[20px] tracking-normal">
                  {paragraph}
                </span>
            </div>

            <div className="w-full border-b border-b-[#E5E7EB] dark:border-b-[#27272a]" />

            <section className="flex flex-col gap-3 p-4">
                <PropertiesTable />
            </section>
        </main>
    )
}