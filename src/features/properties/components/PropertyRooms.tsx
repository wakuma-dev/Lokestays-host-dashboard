import type { PropertyDetailsParams } from "../types/propertyDetails.types";
import { House, Users, Bath, BedDouble, type LucideIcon } from "lucide-react";
interface RoomDetailsProps {
  icon: LucideIcon;
  title: string;
  desc: string | number | null | undefined;
}
function RoomDetails({icon: Icon, title, desc}: RoomDetailsProps){
    return(
    <div className="flex items-center gap-3">
        <Icon className="shrink-0 text-[#953800] dark:text-[#ffa657] size-5" />
        <div className="flex flex-col space-y-0.5">
            <span className="text-[16px] text-[#953800] dark:text-[#ffa657] leading-[22px] font-medium tracking-tight">{title}</span>
            <p className="text-[12px] leading-[15px] text-[#0a7f64] dark:text-[#a5d6ff] font-normal tracking-normal">{desc}</p>
        </div>
    </div>
    );
}
export default function PropertyRooms({property}: PropertyDetailsParams){
    return(
    <section className="w-full flex flex-col space-y-2.5">
            <p className="text-[16px] leading-[22px] tracking-tight font-medium">Rooms and Capacity</p> 
             <div className="w-full dark:bg-[#0C1016] border shadow-sm  dark:border-[#CDC6B9] px-2 py-4 rounded-lg grid grid-cols-2 gap-2.5 lg:gap-4 md:grid-cols-4">
                <RoomDetails 
                 icon={House}
                 title="Bedrooms"
                 desc={property.bedrooms} />
                  <RoomDetails 
                 icon={BedDouble}
                 title="Beds"
                 desc={property.beds} />
                <RoomDetails 
                 icon={Bath}
                 title="Bath"
                 desc={property.bathrooms} />
                <RoomDetails 
                 icon={Users}
                 title="Guest Capacity"
                 desc={property.guestCapacity} />
                
             </div>
        </section>
    )
}