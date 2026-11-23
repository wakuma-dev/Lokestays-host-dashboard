import type { PropertyDetailsParams } from "../types/propertyDetails.types"
export default function PropertyAmenities({property}: PropertyDetailsParams){
    return(
     <section className="w-full flex flex-col space-y-2.5">
        <span className="text-[16px] leading-[22px] tracking-tight font-medium">
                 Amenities
                </span>
                <div className="space-y-3">
              <p className="text-[#3e3529] dark:text-[#cec8b2] font-medium text-[14px] leading-[18px] tracking-tight">
                Property amenities
              </p>
      {property.amenities?.length ? (
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md font-normal text-[13px] tracking-tight leading-[16px] capitalize dark:border-[#CDC6B9] border px-3 py-1.5"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] leading-[16px] text-muted-foreground">
                  No property amenities added.
                </p>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-[#3e3529] dark:text-[#cec8b2] font-medium text-[14px] leading-[18px]">
                Room amenities
              </p>
              {property.roomAmenities?.length ? (
                <div className="flex flex-wrap gap-2">
                  {property.roomAmenities.map((amenity, index) => (
                    <span
                      key={`${amenity}-${index}`}
                      className="rounded-md font-normal text-[13px] leading-[16px] capitalize dark:border-[#CDC6B9] border px-3 py-1.5"
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
    )
}