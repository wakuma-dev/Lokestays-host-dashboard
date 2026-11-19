import type { PropertyDetailsParams } from "../types/propertyDetails.types";
import type { Properties } from "../types/properties.types";
import { CalendarDays } from "lucide-react";
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: Properties["createdAt"]): string {
  if (!value || typeof value.toDate !== "function") {
    return "—";
  }
   return dateFormatter.format(value.toDate());
}
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
export default function PropertySubmissionInfo({property}: PropertyDetailsParams){
    return(
         <section className="w-full flex flex-col space-y-2.5">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <span className="text-[16px] leading-[22px] tracking-tight font-medium">
                    Submission Information
                </span>
             </div>
             <div className="w-full dark:bg-[#0C1016] shadow-sm border dark:border-[#CDC6B9] px-2 py-4 rounded-lg grid grid-cols-2 gap-5 sm:grid-cols-3">
              <DetailItem
                label="Created"
                value={formatDate(property.createdAt)}
              />

              <DetailItem
                label="Last updated"
                value={formatDate(property.updatedAt)}
              />

              <DetailItem
                label="Submitted"
                value={
                  property.submittedAt
                    ? formatDate(property.submittedAt)
                    : "Not submitted"
                }
              />
            </div>
         </section>
    )
}