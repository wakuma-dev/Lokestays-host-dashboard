import { memo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  AirVent,
  BriefcaseBusiness,
  CarFront,
  Coffee,
  CookingPot,
  Dumbbell,
  Flame,
  Heater,
  Refrigerator,
  Shirt,
  ShowerHead,
  Tv,
  Waves,
  Wifi,
  Wind,
  Baby,
  Bath,
  Droplets,
  Package,
  Plug,
  ShieldAlert,
  ShieldCheck,
  Sofa,
  Sun,
  WashingMachine,
  Utensils,
  WavesLadder,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import type { RoomAmenities } from "@/features/onboarding/types/onboarding.types";

interface AmenityOption {
  readonly title: RoomAmenities;
  readonly icon: LucideIcon;
}

interface AmenityCategory {
  readonly title: string;
  readonly amenities: readonly AmenityOption[];
}

const AMENITY_CATEGORIES: readonly AmenityCategory[] = [
  {
    title: "Basics",
    amenities: [
      { title: "Air conditioning", icon: AirVent },
      { title: "Dryer", icon: Wind },
      { title: "Essentials", icon: Package },
      {
        title: "Towels, bed sheets, soap, and toilet paper",
        icon: Bath,
      },
      { title: "Heating", icon: Heater },
      { title: "Hot water", icon: Droplets },
      { title: "Kitchen", icon: CookingPot },
      { title: "Refrigerator", icon: Refrigerator },
      { title: "TV", icon: Tv },
      { title: "Washer", icon: WashingMachine },
      { title: "Wifi", icon: Wifi },
    ],
  },
  {
    title: "Popular",
    amenities: [
      { title: "Coffee maker", icon: Coffee },
      { title: "Cooking basics", icon: Utensils },
      { title: "Hair dryer", icon: Wind },
      { title: "Hangers", icon: Shirt },
      { title: "Iron", icon: Flame },
      { title: "Shampoo", icon: ShowerHead },
    ],
  },
  {
    title: "Features",
    amenities: [
      { title: "Crib", icon: Baby },
      { title: "Dedicated workspace", icon: BriefcaseBusiness },
      { title: "EV charger", icon: Plug },
      { title: "Free parking on premises", icon: CarFront },
      { title: "Gym", icon: Dumbbell },
      { title: "Hot tub", icon: Waves },
      { title: "Indoor fireplace", icon: Flame },
      { title: "Outdoor furniture", icon: Sofa },
      { title: "Pool", icon: WavesLadder },
    ],
  },
  {
    title: "Location",
    amenities: [
      { title: "Beach access", icon: Sun },
      { title: "Waterfront", icon: Waves },
    ],
  },
  {
    title: "Safety",
    amenities: [
      { title: "Carbon monoxide alarm", icon: ShieldAlert },
      { title: "Smoke alarm", icon: ShieldCheck },
    ],
  },
];

interface AmenityCardProps {
  readonly amenity: AmenityOption;
  readonly isSelected: boolean;
  readonly onToggle: (amenity: RoomAmenities) => void;
}

const AmenityCard = memo(function AmenityCard({
  amenity,
  isSelected,
  onToggle,
}: AmenityCardProps) {
  const Icon = amenity.icon;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onToggle(amenity.title)}
      className={[
        "group flex min-h-24 w-full flex-col items-start justify-between",
        "rounded-xl border p-4 text-left transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-black dark:focus-visible:ring-white",
        isSelected
          ? "border-[#222222] bg-[#F5F5F5] dark:border-white dark:bg-[#202020]"
          : "border-[#DDDDDD] bg-transparent hover:border-[#222222] dark:border-[#3A3A3A] dark:hover:border-white",
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        size={24}
        strokeWidth={1.7}
        className="text-[#222222] dark:text-white"
      />

      <span className="mt-4 text-[14px] leading-[20px] font-medium leading-5 text-[#222222] dark:text-white">
        {amenity.title}
      </span>
    </button>
  );
});

function RoomsComponent() {
  const roomAmenities = useOnboardingStore(
    (state) => state.roomAmenities,
  );

  const toggleRoomAmenity = useOnboardingStore(
    (state) => state.toggleRoomAmenity,
  );

  const handleToggle = useCallback(
    (amenity: RoomAmenities) => {
      toggleRoomAmenity(amenity);
    },
    [toggleRoomAmenity],
  );

  return (
    <main className="min-h-0 w-full overflow-x-hidden bg-[#FDFDFD] p-4 text-[#201b15] dark:bg-[#0A0A0A] dark:text-white">
      <Helmet>
        <title>Room amenities | Lokestays</title>
        <meta
          name="description"
          content="Select the amenities available at your property."
        />
      </Helmet>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6 md:gap-8">
        <header className="flex w-full flex-col items-start space-y-2">
          <h1 className="text-[26px] font-semibold leading-[30px] tracking-tight md:text-[32px] md:leading-[36px]">
            Tell guests which amenities they'll find at your place
          </h1>

          <p className="text-[16px] font-normal leading-[20px] text-[#6c6c6c] md:text-[18px] md:leading-[24px]">
            You can add more amenities after you publish your listing.
          </p>
        </header>

        <div className="flex w-full flex-col pb-44 md:pb-40 gap-8">
          {AMENITY_CATEGORIES.map((category) => (
            <section
              key={category.title}
              className="flex w-full flex-col gap-4"
            >
              <h2 className="text-[16px] leading-[24px] font-semibold tracking-tight">
                {category.title}
              </h2>

              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                {category.amenities.map((amenity) => (
                  <AmenityCard
                    key={amenity.title}
                    amenity={amenity}
                    isSelected={roomAmenities.includes(amenity.title)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-sm text-[#6c6c6c]">
          {roomAmenities.length} amenities selected
        </p>
      </div>
    </main>
  );
}

export const Rooms = memo(RoomsComponent);

export default Rooms;