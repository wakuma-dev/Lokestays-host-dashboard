import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsSkeleton() {
  return (
    <div className="w-full flex flex-col space-y-6 md:space-y-8">

      {/* Header */}
      <header className="w-full flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-9 w-36" />

          <div className="flex flex-col items-start space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-64 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-px w-full" />
      </header>

      {/* Property Photos */}
      <section className="w-full flex flex-col space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-32" />

        <div className="w-full grid grid-cols-2 gap-2.5 md:gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full aspect-video rounded-lg max-w-[12rem]"
            />
          ))}
        </div>
      </section>

      {/* Basic Information */}
      <section className="w-full flex flex-col space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-36" />

        <div className="w-full grid grid-cols-3 gap-2.5 lg:gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-5 w-24 max-w-full" />
              <Skeleton className="h-5 w-20 max-w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Rooms and Capacity */}
      <section className="w-full flex flex-col space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-40" />

        <div className="w-full grid grid-cols-2 gap-2.5 lg:gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-md shrink-0" />

              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="w-full flex flex-col space-y-4 md:space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="w-full grid grid-cols-2 gap-2.5 lg:gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-5 w-24 max-w-full" />
              <Skeleton className="h-5 w-20 max-w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="w-full flex flex-col space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-24" />

        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-8 w-20 rounded-md"
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-8 w-20 rounded-md"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Submission Information */}
      <section className="w-full flex flex-col space-y-4 md:space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-5 w-44" />
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-36 max-w-full" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}