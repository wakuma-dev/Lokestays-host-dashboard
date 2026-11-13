import { memo } from "react";
import { Helmet } from "react-helmet-async";
import {
  House,
  Building2,
  Warehouse,
  BedDouble,
  Ship,
  Tent,
  Castle,
  Mountain,
  Container,
  HousePlus,
  Tractor,
  Hotel,
  Sailboat,
  Landmark,
  CarFront,
  Globe,
  Building,
  Home,
  TreePine,
  Wind,
  type LucideIcon,
} from "lucide-react";

import type { PropertyStructure } from "@/features/onboarding";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

interface PropertyStructureOption {
  readonly value: PropertyStructure;
  readonly label: string;
  readonly icon: LucideIcon;
}

const propertyStructureOptions: readonly PropertyStructureOption[] = [
  { value: "House", label: "House", icon: House },
  { value: "Apartment", label: "Apartment", icon: Building2 },
  { value: "Barn", label: "Barn", icon: Warehouse },
  { value: "Bed & breakfast", label: "Bed & breakfast", icon: BedDouble },
  { value: "Boat", label: "Boat", icon: Ship },
  { value: "Cabin", label: "Cabin", icon: Home },
  { value: "Camper/RV", label: "Camper/RV", icon: CarFront },
  { value: "Casa particular", label: "Casa particular", icon: House },
  { value: "Castle", label: "Castle", icon: Castle },
  { value: "Cave", label: "Cave", icon: Mountain },
  { value: "Container", label: "Container", icon: Container },
  { value: "Cycladic home", label: "Cycladic home", icon: Globe },
  { value: "Dammuso", label: "Dammuso", icon: HousePlus },
  { value: "Dome", label: "Dome", icon: Globe },
  { value: "Earth home", label: "Earth home", icon: Mountain },
  { value: "Farm", label: "Farm", icon: Tractor },
  { value: "Guesthouse", label: "Guesthouse", icon: Home },
  { value: "Hotel", label: "Hotel", icon: Hotel },
  { value: "Houseboat", label: "Houseboat", icon: Sailboat },
  { value: "Minsu", label: "Minsu", icon: Building },
  { value: "Riad", label: "Riad", icon: Home },
  { value: "Ryokan", label: "Ryokan", icon: Landmark },
  { value: "Shepherd’s hut", label: "Shepherd’s hut", icon: HousePlus },
  { value: "Tent", label: "Tent", icon: Tent },
  { value: "Tiny home", label: "Tiny home", icon: Home },
  { value: "Tower", label: "Tower", icon: Building2 },
  { value: "Treehouse", label: "Treehouse", icon: TreePine },
  { value: "Trullo", label: "Trullo", icon: House },
  { value: "Windmill", label: "Windmill", icon: Wind },
  { value: "Yurt", label: "Yurt", icon: Tent },
];

function StructureComponent() {
  const structure = useOnboardingStore((state) => state.structure);
  const setStructure = useOnboardingStore((state) => state.setStructure);

  return (
    <main className="min-h-dvh w-full bg-[#FDFDFD] p-4 pb-14 text-[#201b15] dark:bg-[#0A0A0A] dark:text-white">
      <Helmet>
        <title>Property structure | Lokestays</title>
        <meta
          name="description"
          content="Choose the type of property you want to list on Lokestays."
        />
      </Helmet>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* Page heading */}
        <header className="flex flex-col items-center space-y-1 text-center">
          <h1 className="text-[26px] leading-[30px] tracking-tight font-semibold md:text-[32px] md:leading-[36px]">
            Which of these best describes your place?
          </h1>

          <p className="text-[18px] leading-[24px] text-[#6c6c6c] font-normal">
            Select the property type you want to host.
          </p>
        </header>

        {/* Property structure options */}
        <div
          role="group"
          aria-label="Property structure"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {propertyStructureOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = structure === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setStructure(option.value)}
                className={`
                  flex min-h-14 flex-col items-start justify-between
                  gap-2 rounded-xl border p-4 text-left
                  transition-colors duration-200
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-[#222222]
                  dark:focus-visible:outline-white
                  ${
                    isSelected
                      ? "border-[#222222] bg-[#F3F3F3] dark:border-white dark:bg-[#242424]"
                      : "border-[#E5E5E5] hover:border-[#777777] dark:border-[#303030] dark:hover:border-[#777777]"
                  }
                `}
              >
                <Icon
                  size={25}
                  strokeWidth={1.7}
                  aria-hidden="true"
                  className="shrink-0"
                />

                <span className="text-[16px] leading-[20px] font-medium">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export const Structure = memo(StructureComponent);

export default Structure;