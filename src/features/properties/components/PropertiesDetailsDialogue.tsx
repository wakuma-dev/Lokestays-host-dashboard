import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Properties } from "../types/properties.types";
import type { PaymentProvider } from "@/features/onboarding/types/payment.types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  House,
  CalendarDays,
  ImageIcon,
  type LucideIcon,
 } from "lucide-react";
interface PropertiesDetailsDialogueParams {
    property: Properties | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
interface RoomDetailsProps {
  icon: LucideIcon;
  title: string;
  desc: string | number | null | undefined;
}
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});
const paymentProviderLabels: Record<PaymentProvider, string> = {
  telebirr: "Telebirr",
  mpesa: "M-Pesa",
  cbe: "Commercial Bank of Ethiopia",
  awash: "Awash Bank",
  dashen: "Dashen Bank",
  abyssinia: "Bank of Abyssinia",
};
function formatDate(value: Properties["createdAt"]): string {
  if (!value || typeof value.toDate !== "function") {
    return "—";
  }
  return dateFormatter.format(value.toDate());
}
function DetailItem({label,value,}: {label: string; value: string | number | null | undefined;}){
    return(
     <div className="flex flex-col space-y-0.5">
        <span className="text-muted-foreground tracking-tight text-[18px] leading-[24px]">{label}</span>
        <p className="break-words font-medium text-[14px] leading-[20px] tracking-normal">
            {value ?? "—"}</p>
     </div>
    )
}
function RoomDetails({icon: Icon, title, desc}: RoomDetailsProps){
    return(
    <div className="flex items-center gap-3">
        <Icon className="shrink-0 size-5" />
        <div className="flex flex-col -space-y-1">
            <span className="text-[18px] leading-[24px] font-medium tracking-tight">{title}</span>
            <p className="text-[14px] leading-[20px] font-normal tracking-normal">{desc}</p>
        </div>
    </div>
    );
}
export default function PropertiesDetailsDialogue({
    property,
    open,
    onOpenChange
}: PropertiesDetailsDialogueParams){
if(!property) return null;
    return(
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
           className="sm:max-w-2xl overflow-y-auto">
        <DialogHeader className="flex flex-col items-start">
            <DialogTitle className="text-[18px] leading-[24px] 
            tracking-tight font-medium">Property Details</DialogTitle>
            <DialogDescription className="text-[14px] leading-[20px]
             tracking-normal font-normal">
                Complete information submitted by the host.
             </DialogDescription>
        </DialogHeader>
        <section className="w-full flex flex-col space-y-4 md:space-y-6">
             <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                <span className="text-[14px] leading-[20px]
             tracking-normal font-normal">
                     Property Photos ({property.photos?.length ?? 0})
                </span>
             </div>
             {property.photos.length ? (
                <div className="w-full grid grid-cols-2 gap-2.5 md:gap-4 md:grid-cols-5">
                     {property.photos
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map((photo, index) => (
                    <AspectRatio ratio={1/1}
                                 key={`${photo.id}-${photo.publicId}-${photo.position}-${index}`}
                                 className="w-full bg-muted rounded-lg max-w-[12rem]">
                    <img 
                      src={photo.url}
                      alt={`Property photo ${photo.position + 1}`}
                      loading="eager"
                      className="rounded-lg object-cover grayscale dark:brightness-20"
                      />
                    </AspectRatio>
                  ))}
                </div>
                ) : (
                <p className="text-center text-[18px] leading-[24px] tracking-tight font-medium text-muted-foreground">
                 No Photos uploaded
                </p>)}
        </section>
        <section className="w-full flex flex-col space-y-4 md:space-y-6">
         <p className="text-[14px] leading-[20px]
             tracking-normal font-normal">Basic Information</p>
              <div className="w-full grid grid-cols-3 gap-2.5 lg:gap-4 lg:grid-cols-6">
                <DetailItem label="Property type" value={property.structure} />
                <DetailItem label="Privacy type" value={property.privacyType} />
                <DetailItem label="Status" value={property.status} />
                <DetailItem
                  label="Payment method"
                  value={
                    property.paymentProvider
                      ? paymentProviderLabels[property.paymentProvider]
                      : null
                  }
                />
                <DetailItem
                  label="Payment account"
                  value={property.paymentAccount}
                />
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
        <section className="w-full flex flex-col space-y-4 md:space-y-6">
            <p className="text-[14px] leading-[20px]
             tracking-normal font-normal">Rooms and Capacity</p> 
             <div className="w-full grid grid-cols-2 gap-2.5 lg:gap-4 md:grid-cols-4">
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
                <RoomDetails 
                 icon={House}
                 title="Bedrooms"
                 desc={property.bedrooms} />
             </div>
        </section>
        <section className="w-full flex flex-col space-y-4 md:space-y-6">
            <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-[14px] leading-[20px]
             tracking-normal font-normal">
                    Location
                </span>
             </div>
             <div className="w-full grid grid-cols-2 gap-2.5 lg:gap-4 md:grid-cols-4">
            <DetailItem label="City" 
                       value={property.location?.city} />
            <DetailItem
                label="Neighborhood"
                value={property.location?.neighborhood}
              />
            <DetailItem
                label="Address"
                value={property.location?.address}
              />
              <DetailItem
                label="Latitude"
                value={property.location?.latitude}
              />
              <DetailItem
                label="Longitude"
                value={property.location?.longitude}
              />
             </div>
        </section>
         <section className="w-full flex flex-col space-y-4 md:space-y-6">
             <span className="text-[14px] leading-[20px]
             tracking-normal font-normal">
                 Amenities
                </span>
                <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Property amenities
              </p>
              {property.amenities?.length ? (
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md border px-3 py-1.5 text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No property amenities added.
                </p>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Room amenities
              </p>
              {property.roomAmenities?.length ? (
                <div className="flex flex-wrap gap-2">
                  {property.roomAmenities.map((amenity, index) => (
                    <span
                      key={`${amenity}-${index}`}
                      className="rounded-md border px-3 py-1.5 text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No room amenities added.
                </p>
              )}
              </div>
         </section>
         <section className="w-full flex flex-col space-y-4 md:space-y-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <span className="text-[14px] leading-[20px]
             tracking-normal font-normal">
                    Submission Information
                </span>
             </div>
             <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
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
        </DialogContent>
    </Dialog>
    )
}