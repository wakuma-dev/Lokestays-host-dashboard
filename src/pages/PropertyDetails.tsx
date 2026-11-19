import { useParams } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  usePropertyQuery,
  PropertyDetailsHeader,
  PropertyAmenities,
  PropertyLocation,
  PropertyPhotos,
  PropertyRooms,
  PropertyDetailsSkeleton,
  PropertySubmissionInfo,
  PropertyBasicInfo,
} from "@/features/properties";
export default function PropertyDetails() {
  const { propertyId } = useParams({
    from: "/_main/properties/$propertyId",
  });

  const {
    data: property,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = usePropertyQuery(propertyId);

  if (isPending) {
    return <PropertyDetailsSkeleton />;
  }

  return (
    <main className="p-4 min-w-0 min-h-screen h-auto text-[#111] dark:text-[#fff] bg-[#ffffff] dark:bg-[#141A15]">
      <Helmet>
        <title>Property Details | Lokestays</title>
        <meta
          name="description"
          content="View complete property information, photos, location, amenities, and submission details."
        />
      </Helmet>

      <div className="w-full flex flex-col space-y-6 md:space-y-8">
        {isError ? (
          <section className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
            <AlertCircle className="size-10 text-destructive" />

            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-[18px] leading-[24px] font-medium">
                Unable to load property
              </h2>

              <p className="text-[14px] leading-[20px] text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while loading this property."}
              </p>
            </div>

            <Button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Try Again
            </Button>
          </section>
        ) : !property ? (
          <section className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
            <AlertCircle className="size-10 text-muted-foreground" />

            <h2 className="text-[18px] leading-[24px] font-medium">
              Property Not Found
            </h2>

            <p className="text-[14px] leading-[20px] text-muted-foreground">
              This property doesn't exist or is no longer available.
            </p>
          </section>
        ) : (
          <>
            <PropertyDetailsHeader />
            <PropertyPhotos property={property} />
            <PropertyBasicInfo property={property} />
            <PropertyRooms property={property} />
            <PropertyLocation property={property} />
            <PropertyAmenities property={property} />
            <PropertySubmissionInfo property={property} />
          </>
        )}
      </div>
    </main>
  );
}