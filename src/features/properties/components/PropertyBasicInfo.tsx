import type { PropertyDetailsParams } from "../types/propertyDetails.types"
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
export default function PropertyBasicInfo({property}: PropertyDetailsParams){
    return(
       <section className="w-full flex flex-col space-y-2.5">
         <p className="text-[16px] leading-[22px] tracking-tight font-medium">Basic Information</p>
              <div className="w-full dark:bg-[#0C1016] shadow-sm border dark:border-[#CDC6B9] px-2 py-4 rounded-lg grid grid-cols-2 gap-2.5 lg:gap-4 lg:grid-cols-6">
                <DetailItem label="Property type" value={property.structure} />
                <DetailItem label="Privacy type" value={property.privacyType} />
                <DetailItem label="Status" value={property.status} />
                <DetailItem label="Price per night"
                 value={
                  property.pricePerNight != null
                    ? `${property.pricePerNight.toLocaleString()} ${property.currency ?? "ETB"}`
                    : "—"
                }
              />
               <DetailItem
                label="Current onboarding step"
                value={property.currentStep}
               />
                <DetailItem
                label="Guest capacity"
                value={property.guestCapacity}
              />
              </div>
        </section>
    )
}