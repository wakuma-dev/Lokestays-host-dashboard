import { ImageIcon } from "lucide-react";
import type { PropertyDetailsParams } from "../types/propertyDetails.types";
export default function Photos({property}: PropertyDetailsParams){
    return(
    <section className="w-full flex flex-col space-y-2.5">
    <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                <span className="text-[16px] leading-[22px] tracking-tight font-medium">
                     Property Photos ({property.photos?.length ?? 0})
                </span>
    </div>
     {property.photos.length ? (
                <div className="w-full grid grid-cols-2 gap-2.5 md:gap-4 md:grid-cols-5">
                     {property.photos
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map((photo, index) => (
                    <div
                      key={`${photo.id}-${photo.publicId}-${photo.position}-${index}`}
                      className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted max-w-[14rem]"
                    >
                      <img
                        src={photo.url}
                        alt={`Property photo ${photo.position + 1}`}
                        loading="eager"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
                ) : (
                <p className="text-center text-[18px] leading-[24px] tracking-tight font-medium text-muted-foreground">
                 No Photos uploaded
                </p>)}
    </section>
    )
}