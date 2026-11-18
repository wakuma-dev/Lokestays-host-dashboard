import { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  AirVent,
  AlarmSmoke,
  Bath,
  BriefcaseBusiness,
  Coffee,
  CookingPot,
  Dumbbell,
  Flame,
  Heater,
  Refrigerator,
  Shirt,
  ShowerHead,
  Sparkles,
  Tv,
  Waves,
  Wifi,
  Wind,
  Baby,
  Plug,
  Sofa,
  Droplets,
  ParkingCircle,
  type LucideIcon,
} from "lucide-react";

import { AMENITY_CATEGORIES } from "@/features/onboarding/constants/amenities.constants";
import type { PropertyAmenity } from "@/features/onboarding/types/onboarding.types";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

const AMENITY_ICONS: Record<PropertyAmenity, LucideIcon> = {
  "air-conditioning": AirVent,
  dryer: Wind,
  essentials: Sparkles,
  heating: Heater,
  "hot-water": ShowerHead,
  kitchen: CookingPot,
  refrigerator: Refrigerator,
  tv: Tv,
  washer: Shirt,
  wifi: Wifi,
  "coffee-maker": Coffee,
  "cooking-basics": CookingPot,
  "hair-dryer": Wind,
  hangers: Shirt,
  iron: Shirt,
  shampoo: Droplets,
  crib: Baby,
  "dedicated-workspace": BriefcaseBusiness,
  "ev-charger": Plug,
  "free-parking": ParkingCircle,
  gym: Dumbbell,
  "hot-tub": Bath,
  "indoor-fireplace": Flame,
  "outdoor-furniture": Sofa,
  pool: Waves,
  "beach-access": Waves,
  waterfront: Waves,
  "carbon-monoxide-alarm": AlarmSmoke,
  "smoke-alarm": AlarmSmoke,
};

function AmenitiesComponent() {
  const amenities = useOnboardingStore((state) => state.amenities);
  const toggleAmenity = useOnboardingStore((state) => state.toggleAmenity);

  useEffect(() => {
    if (amenities.length === 0) {
      toggleAmenity(AMENITY_CATEGORIES[0].amenities[0].value);
    }
  }, [amenities.length, toggleAmenity]);

  return (
    <main
      className="min-h-0 w-full overflow-x-hidden bg-[#FDFDFD]  p-4 text-[#201b15]
        dark:bg-[#0A0A0A] dark:text-white"
    >
      <Helmet>
        <title>Choose your amenities | Lokestays</title>
        <meta
          name="description"
          content="Tell guests which amenities they'll find at your property."
        />
      </Helmet>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-8 ">
        <header className="flex w-full flex-col items-start space-y-1">
          <h1 className="text-[26px] leading-[30px] tracking-tight font-semibold md:text-[32px] md:leading-[36px]">
            Tell guests which amenities they'll find at your place
          </h1>

          <p className="text-[16px] leading-[20px] text-[#6c6c6c] font-normal md:text-[18px] md:leading-[24px]">
            You can add more amenities after you publish your listing.
          </p>
        </header>

        <div className="flex w-full flex-col gap-8 pb-42 md:pb-40">
          {AMENITY_CATEGORIES.map((category) => (
            <section
              key={category.title}
              className="flex w-full flex-col gap-4"
              aria-labelledby={`amenity-category-${category.title}`}
            >
              <h2
                id={`amenity-category-${category.title}`}
                className="text-lg font-semibold tracking-tight"
              >
                {category.title}
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {category.amenities.map((amenity) => {
                  const AmenityIcon = AMENITY_ICONS[amenity.value];
                  const selected = amenities.includes(amenity.value);

                  return (
                    <button
                      key={amenity.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleAmenity(amenity.value)}
                      className={`flex min-h-[112px] flex-col items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#0A0A0A]
                        ${
                          selected
                            ? "border-[#222222] bg-[#F5F5F5] dark:border-white dark:bg-[#202020]"
                            : "border-[#DDDDDD] bg-transparent hover:border-[#222222] dark:border-[#383838] dark:hover:border-white"
                        }`}
                    >
                      <AmenityIcon
                        size={25}
                        strokeWidth={1.7}
                        className="shrink-0"
                        aria-hidden="true"
                      />

                      <span className="text-[16px] leading-[20px] font-medium text-[#222222]">
                        {amenity.label}
                      </span>

                      {amenity.description && (
                        <span className="text-[14px] leading-[20px] font-normal text-[#777777] dark:text-[#A1A1AA]">
                          {amenity.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

export const Amenities = memo(AmenitiesComponent);

export default Amenities;
