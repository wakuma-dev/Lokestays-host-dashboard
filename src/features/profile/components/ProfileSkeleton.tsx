import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
export default function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading profile"
      className="flex flex-col space-y-4">
      <div aria-hidden="true" className="flex flex-col gap-3">
        <div className="w-full flex flex-1 flex-col items-center gap-8 lg:flex-row lg:items-stretch">
          <div className="flex w-full flex-col items-center gap-4 lg:w-[400px] lg:items-start">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-9 w-36 rounded-md" />
              <Skeleton className="h-7 w-10 rounded-md" />
            </div>
            <Card className="w-full dark:bg-[#0C1016] overflow-hidden shadow-md lg:w-[400px]">
              <CardContent className="flex w-full flex-col items-center justify-center gap-2.5 p-4">
                <Skeleton className="size-24 rounded-full" />
                <div className="min-w-0 flex-1 flex flex-col items-center space-y-1">
                  <Skeleton className="h-9 w-48 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="max-w-xs hidden lg:flex flex-col justify-center gap-2.5">
            <Skeleton className="h-[26px] w-48 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-72 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
              <Skeleton className="h-4 w-52 rounded-md" />
            </div>
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>
        <div className="hidden lg:block border border-b dark:border-[#CDC6B9] mt-4" />
      </div>
      { }
      <div aria-hidden="true" className="lg:py-2">
        <Card className="border-0 ring-0 shadow-none">
          <CardHeader>
            <Skeleton className="h-[30px] w-52 rounded-md" />
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col space-y-1.5">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-[18px] w-40 rounded-md" />
              </div>
              <Skeleton className="h-5 w-8 rounded-md" />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col space-y-1.5">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-[18px] w-52 rounded-md" />
              </div>
              <Skeleton className="h-5 w-8 rounded-md" />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col space-y-1.5">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-[18px] w-28 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}