import { Helmet } from "react-helmet-async";
import {
  ProfileCard,
  useProfileQuery,
  ProfileInformation,
  PROFILE_INFORMATION_SECTION_ID,
  ProfileSkeleton
} from "@/features/profile";
import { useAuthStore } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
export default function Profile(){
    const user = useAuthStore((state) => state.user);
    const { data: profile, 
            isPending, 
            isError,
            error, 
            refetch, 
            isFetching } = useProfileQuery(user?.uid ?? "");
    if(isPending){
      return <ProfileSkeleton />
    }
    return(
    <main className="min-w-0 p-4 lg:px-6 h-auto min-h-screen h-auto text-[#111] dark:text-[#fff] bg-[#ffffff] dark:bg-[#141A15]">
    <Helmet>
        <title></title>
        <meta name="description"
              content="" />
    </Helmet>
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
      ) : (
      <div className="flex flex-col gap-3">
        <ProfileCard
          fullName={profile?.fullName ?? user?.displayName ?? "User"}
          userId={user?.uid ?? profile?.uid ?? ""}
        />
        <section id={PROFILE_INFORMATION_SECTION_ID} className="lg:py-2">
        <ProfileInformation
          uid={user?.uid ?? ""}
          fullName={profile?.fullName ?? user?.displayName ?? "User"}
          email={profile?.email ?? user?.email ?? ""}
          phoneNumber=""
          />
          </section>
      </div>
      )}
 </main>
    );
}