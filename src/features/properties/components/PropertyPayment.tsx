import { CreditCard } from "lucide-react";
import type { PropertyDetailsParams } from "../types/propertyDetails.types";
interface DetailItemProps {
  label: string;
  value: string | number | null | undefined;
}
function DetailItem({label, value}: DetailItemProps) {
  return (
    <div className="flex flex-col space-y-0.5">
      <span className="text-[16px] font-medium leading-[22px] tracking-tight text-[#953800] dark:text-[#ffa657]">
        {label}
      </span>
      <p className="break-words text-[12px] font-normal leading-[15px] tracking-normal text-[#0a7f64] dark:text-[#a5d6ff]">
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function PropertyPayment({ property }: PropertyDetailsParams) {
  const provider = property.paymentProvider
    ? property.paymentProvider.charAt(0).toUpperCase() +
      property.paymentProvider.slice(1)
    : "—";

  return (
    <section className="flex w-full flex-col space-y-2.5">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        <span className="text-[16px] font-medium leading-[22px] tracking-tight">
          Payment Information
        </span>
      </div>

      <div className="grid w-full grid-cols-2 gap-2.5 rounded-lg border px-2 py-4 shadow-sm md:grid-cols-4 lg:gap-4 dark:border-[#CDC6B9] dark:bg-[#0C1016]">
        <DetailItem label="Payment provider" value={provider} />
        <DetailItem label="Payment account" value={property.paymentAccount} />
        <DetailItem label="Currency" value={property.currency} />
        <DetailItem
          label="Price per night"
          value={
            property.pricePerNight != null
              ? `${property.pricePerNight.toLocaleString()} ${property.currency ?? "ETB"}`
              : "—"
          }
        />
      </div>
    </section>
  );
}