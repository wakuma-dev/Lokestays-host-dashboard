import { Helmet } from "react-helmet-async";
import { PropertiesTable } from "@/features/properties";
export default function AllProperties(){
    const header = "Your properties";
    const paragraph = "Manage your listings, update property details, and keep track of your accommodation on Lokestays.";
    return(
        <main 
          className="p-4 md:px-6 h-auto min-w-0 bg-[#ffffff] text-[#201b15]
     dark:bg-[#0A0A0A] dark:text-[#FFFFFF]">
        <Helmet>
            <title></title>
            <meta name="description"
                  content=""
                  />
        </Helmet>
        <div className="flex flex-col gap-1">
                <h1 className="text-[20px] leading-[25px] text-[#111] dark:text-[#fff] font-semibold tracking-tight">{header}</h1>
                <span className="text-[15px] text-[#3e3529] dark:text-[#cec8b2] font-normal leading-[20px] tracking-normal">
                  {paragraph}
                </span>
            </div>
            <div className="w-full border-b my-3 border-b-[#E5E7EB] dark:border-b-[#27272a]" />
            <section className="flex flex-col gap-3 ">
                <PropertiesTable />
            </section>
        </main>
    )
}