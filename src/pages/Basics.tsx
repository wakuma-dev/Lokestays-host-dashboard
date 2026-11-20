import { memo } from "react";
import { Helmet } from "react-helmet-async";
import { Minus, Plus } from "lucide-react";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

interface CounterConfig {
  readonly key: "guestCapacity" | "bedrooms" | "beds" | "bathrooms";
  readonly label: string;
  readonly description?: string;
  readonly min: number;
  readonly max: number;
}

const COUNTERS: readonly CounterConfig[] = [
  {
    key: "guestCapacity",
    label: "Overnight guests",
    min: 1,
    max: 16,
  },
  {
    key: "bedrooms",
    label: "Bedrooms",
    min: 0,
    max: 50,
  },
  {
    key: "beds",
    label: "Beds",
    min: 0,
    max: 50,
  },
  {
    key: "bathrooms",
    label: "Bathrooms",
    min: 0,
    max: 50,
  },
];

function BasicsComponent() {
  const {
    guestCapacity,
    bedrooms,
    beds,
    bathrooms,
    setPropertyBasics,
  } = useOnboardingStore();

  const basics = {
    guestCapacity,
    bedrooms,
    beds,
    bathrooms,
  };

  function handleCounterChange(
    key: CounterConfig["key"],
    direction: "increment" | "decrement",
  ) {
    const config = COUNTERS.find((counter) => counter.key === key);

    if (!config) return;

    const currentValue = basics[key];

    const nextValue =
      direction === "increment"
        ? Math.min(currentValue + 1, config.max)
        : Math.max(currentValue - 1, config.min);

    if (nextValue === currentValue) return;

    setPropertyBasics({
      ...basics,
      [key]: nextValue,
    });
  }

  return (
    <main
      className="
        flex flex-1 h-full min-h-full overflow-hidden
        overscroll-none w-full flex-col justify-start
        bg-[#FDFDFD] p-4 text-[#201b15]
        dark:bg-[#0A0A0A] dark:text-white
        md:items-center md:justify-center md:pb-4
      "
    >
      <Helmet>
        <title>Select the total guest | Lokestays</title>

        <meta
          name="description"
          content="Tell us about the guest capacity, bedrooms, beds and bathrooms of your property."
        />

        <html className="overflow-hidden overscroll-none h-dvh" />
        <body className="overflow-hidden overscroll-none h-dvh" />
      </Helmet>

      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-6 md:gap-8">
        <header className="flex flex-col items-start space-y-1">
          <h1 className="text-[26px] leading-[30px] tracking-tight font-semibold md:text-[32px] md:leading-[36px]">
            Share some basics about your place
          </h1>

          <p className="text-[16px] leading-[20px] md:text-[18px] md:leading-[24px] text-[#6c6c6c] font-normal">
            You'll add more details later, like bed types.
          </p>
        </header>

        <section
          aria-label="Property basics"
          className="flex w-full max-w-2xl mx-auto flex-col"
        >
          {COUNTERS.map((counter, index) => {
            const value = basics[counter.key];

            const isMinimum = value <= counter.min;
            const isMaximum = value >= counter.max;

            return (
              <div
                key={counter.key}
                className={`
                  flex min-h-[88px] items-center
                  justify-between gap-4 py-5
                  ${
                    index !== COUNTERS.length - 1
                      ? "border-b border-[#E5E5E5] dark:border-[#292929]"
                      : ""
                  }
                `}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[18px] leading-6 font-normal text-[#222222] dark:text-white">
                    {counter.label}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <button
                    type="button"
                    aria-label={`Decrease ${counter.label}`}
                    disabled={isMinimum}
                    onClick={() =>
                      handleCounterChange(counter.key, "decrement")
                    }
                    className="
                      flex size-7 cursor-pointer items-center justify-center
                      rounded-full border border-[#B0B0B0]
                      text-[#717171] transition
                      hover:border-black hover:text-black
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                      dark:border-[#717171]
                      dark:text-white
                      dark:hover:border-white
                    "
                  >
                    <Minus size={16} strokeWidth={1.8} />
                  </button>

                  <output
                    aria-live="polite"
                    aria-label={`${counter.label}: ${value}`}
                    className="
                      w-6 text-center text-[16px]
                      font-medium tabular-nums
                    "
                  >
                    {value}
                  </output>

                  <button
                    type="button"
                    aria-label={`Increase ${counter.label}`}
                    disabled={isMaximum}
                    onClick={() =>
                      handleCounterChange(counter.key, "increment")
                    }
                    className="
                      flex size-7 cursor-pointer items-center justify-center
                      rounded-full border border-[#B0B0B0]
                      text-[#717171] transition
                      hover:border-black hover:text-black
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                      dark:border-[#717171]
                      dark:text-white
                      dark:hover:border-white
                    "
                  >
                    <Plus size={16} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export const Basics = memo(BasicsComponent);

export default Basics;
