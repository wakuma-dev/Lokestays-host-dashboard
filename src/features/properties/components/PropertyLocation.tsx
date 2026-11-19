import type { PropertyDetailsParams } from "../types/propertyDetails.types";
import { MapPin } from "lucide-react";
interface DetailItemProps {
    label: string;
    value: string | number | null | undefined;
}
function DetailItem({label,value,}: DetailItemProps){
    return(
     <div className="flex flex-col space-y-0.5">
        <span className="text-[#953800] dark:text-[#ffa657] font-medium tracking-tight text-[16px] leading-[22px]">{label}</span>
        <p className="break-words text-[#0a7f64] dark:text-[#a5d6ff]  font-normal text-[12px] leading-[15px] tracking-normal">
            {value ?? "—"}</p>
     </div>
    )
}
export default function PropertyLocation({property}: PropertyDetailsParams){
    return(
        <section className="w-full flex flex-col space-y-2.5">
            <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
                <span className="text-[16px] leading-[22px] tracking-tight font-medium">
                    Location
                </span>
             </div>
             <div className="w-full dark:border-[#CDC6B9] dark:bg-[#0C1016] rounded-lg border shadow-md px-2 py-4  grid grid-cols-2 gap-2.5 lg:gap-4 md:grid-cols-5">
            <DetailItem label="City" value={property.location?.city} />
            <DetailItem label="Neighborhood" value={property.location?.neighborhood} />
            <DetailItem label="Address" value={property.location?.address} />
            <DetailItem label="Latitude" value={property.location?.latitude} />
            <DetailItem label="Longitude"value={property.location?.longitude} />
             </div>
        </section>
    )
}