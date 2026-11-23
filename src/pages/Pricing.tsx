import { memo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Minus, Plus, Banknote } from "lucide-react";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "../features/onboarding/store/onboardingStore";
function PricingComponent() {
  const storedPrice = useOnboardingStore((state) => state.pricePerNight);
  const setPricing = useOnboardingStore((state) => state.setPricing);
  const [price, setPrice] = useState(
    storedPrice > 0 ? String(storedPrice) : "",
  );
  const numericPrice = Number(price);
  const isValidPrice =
    price.trim() !== "" &&
    Number.isSafeInteger(numericPrice) &&
    numericPrice >= 1 &&
    numericPrice <= 1_000_000_000;
  const formattedPrice = new Intl.NumberFormat("en-ET", {
    maximumFractionDigits: 0,
  }).format(isValidPrice ? numericPrice : 0);
  function handlePriceChange(value: string): void {
    if (!/^\d*$/.test(value)) {
      return;
    }
    setPrice(value);
    const nextPrice = Number(value);
    if (
      value !== "" &&
      Number.isSafeInteger(nextPrice) &&
      nextPrice >= 1 &&
      nextPrice <= 1_000_000_000
    ) {
      setPricing(nextPrice);
    } else {
      setPricing(0);
    }
  }
  function handleIncrement(): void {
    const currentPrice = Number(price) || 0;
    if (currentPrice >= 1_000_000_000) {
      return;
    }
    handlePriceChange(String(currentPrice + 100));
  }
  function handleDecrement(): void {
    const currentPrice = Number(price) || 0;
    handlePriceChange(String(Math.max(0, currentPrice - 100)));
  }
  return (
    <main className="min-h-0 w-full overflow-x-hidden bg-[#FDFDFD] p-4 text-[#201b15] dark:bg-[#0A0A0A] dark:text-white">
      <Helmet>
        <title>Pricing | Lokestays</title>
        <meta
          name="description"
          content="Set the nightly price for your Lokestays property."
        />
      </Helmet>
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8 md:pb-44">
        <header className="col-span-full flex w-full flex-col items-start space-y-1">
          <h1 className="text-[26px] font-semibold leading-[30px] tracking-tight md:text-[32px] md:leading-[36px]">
            Now, set your price
          </h1>
          <p className="text-[16px] font-normal leading-[20px] text-[#6c6c6c] md:text-[18px] md:leading-[24px]">
            You can change your price anytime. Choose a nightly price that
            works for you and your guests.
          </p>
        </header>
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-4 dark:border-[#27272A] dark:bg-[#111111] sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-[18px] leading-[24px] font-semibold">
                Nightly price
              </h2>
              <p className="text-[14px] leading-[20px] text-[#717171] dark:text-[#A6ADBB]">
                Price per night for your property
              </p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-full bg-[#F5F5F5] dark:bg-[#27272A]">
              <Banknote size={21} strokeWidth={1.7} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DADADA] p-4 dark:border-[#3F3F46]">
            <div className="min-w-0 flex-1">
              <FieldLabel
                htmlFor="pricePerNight"
                className="mb-2 block text-xs font-medium text-[#717171] dark:text-[#A6ADBB]"
              >
                Price per night (ETB)
              </FieldLabel>
              <div className="flex items-center gap-2">
                <span className="text-xl font-medium">ETB</span>
                <Input
                  id="pricePerNight"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={price}
                  onChange={(event) =>
                    handlePriceChange(event.target.value)
                  }
                  className="min-w-0 w-full border-none bg-transparent text-3xl font-semibold outline-none active:border-none placeholder:text-[#BDBDBD] dark:placeholder:text-[#52525B]"
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDecrement}
                disabled={!price || Number(price) <= 0}
                aria-label="Decrease nightly price"
                className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E5E5] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3F3F46] dark:hover:bg-[#27272A]"
              >
                <Minus size={17} />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleIncrement}
                disabled={Number(price) >= 1_000_000_000}
                aria-label="Increase nightly price"
                className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E5E5] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3F3F46] dark:hover:bg-[#27272A]"
              >
                <Plus size={17} />
              </Button>
            </div>
          </div>
          <p className="mt-3 text-[14px] leading-[20px] text-[#717171] dark:text-[#A6ADBB]">
            Enter the amount guests will pay for one night.
          </p>
        </section>
        <section className="rounded-2xl border border-[#E5E5E5] p-5 dark:border-[#27272A] sm:p-6">
          <h2 className="mb-5 text-[14px] leading-[20px] font-semibold">
            Price preview
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] leading-[20px] text-[#717171] dark:text-[#A6ADBB]">
                Your nightly price
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {formattedPrice} ETB
              </p>
            </div>
            <div className="rounded-xl bg-[#F5F5F5] px-4 py-3 text-xs font-medium dark:bg-[#27272A]">
              Per night
            </div>
          </div>
          <div className="my-5 border-t border-[#E5E5E5] dark:border-[#27272A]" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#717171] dark:text-[#A6ADBB]">
              7 nights
            </span>
            <span className="font-semibold">
              {new Intl.NumberFormat("en-ET").format(
                isValidPrice ? numericPrice * 7 : 0,
              )}{" "}
              ETB
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
export const Pricing = memo(PricingComponent);
export default Pricing;
