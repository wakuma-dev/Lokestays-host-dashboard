import {
  memo,
  useCallback,
  useState,
  type ChangeEvent,
} from "react";
import { Helmet } from "react-helmet-async";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

import {
  PAYMENT_PROVIDERS,
  type PaymentProvider,
} from "@/features/onboarding/types/payment.types";

const paymentProviderDetails: Record<
  PaymentProvider,
  {
    label: string;
    description: string;
    accountLabel: string;
    placeholder: string;
    inputType: "tel" | "text";
  }
> = {
  telebirr: {
    label: "Telebirr",
    description: "Pay using your Telebirr account.",
    accountLabel: "Telebirr phone number",
    placeholder: "09XXXXXXXX",
    inputType: "tel",
  },
  mpesa: {
    label: "M-Pesa",
    description: "Pay using your M-Pesa account.",
    accountLabel: "M-Pesa phone number",
    placeholder: "Enter your M-Pesa number",
    inputType: "tel",
  },
  cbe: {
    label: "Commercial Bank of Ethiopia",
    description: "Pay through CBE banking services.",
    accountLabel: "CBE account number",
    placeholder: "Enter your CBE account number",
    inputType: "text",
  },
  awash: {
    label: "Awash Bank",
    description: "Pay using Awash Bank services.",
    accountLabel: "Awash Bank account number",
    placeholder: "Enter your Awash account number",
    inputType: "text",
  },
  dashen: {
    label: "Dashen Bank",
    description: "Pay using Dashen Bank services.",
    accountLabel: "Dashen Bank account number",
    placeholder: "Enter your Dashen account number",
    inputType: "text",
  },
  abyssinia: {
    label: "Bank of Abyssinia",
    description: "Pay using Bank of Abyssinia services.",
    accountLabel: "Bank of Abyssinia account number",
    placeholder: "Enter your account number",
    inputType: "text",
  },
};

function PaymentComponent() {
  const paymentProvider = useOnboardingStore(
    (state) => state.paymentProvider,
  );

  const setPaymentProvider = useOnboardingStore(
    (state) => state.setPaymentProvider,
  );

  const [accountNumber, setAccountNumber] = useState("");

  const selectedProvider = paymentProvider
    ? paymentProviderDetails[paymentProvider]
    : null;

  const handleProviderChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const provider = event.target.value;

      if (!PAYMENT_PROVIDERS.includes(provider as PaymentProvider)) {
        return;
      }

      setPaymentProvider(provider as PaymentProvider);
      setAccountNumber("");
    },
    [setPaymentProvider],
  );

  const handleAccountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAccountNumber(event.target.value);
    },
    [],
  );

  return (
    <main
      className="min-h-0 w-full overflow-x-hidden bg-[#FDFDFD] p-4 text-[#201b15]
        dark:bg-[#0A0A0A] dark:text-white"
    >
      <Helmet>
        <title>Payment details | Lokestays</title>
        <meta
          name="description"
          content="Select your preferred payment provider and enter your payment account details."
        />
      </Helmet>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-40 md:gap-8">
        <header className="flex flex-col items-start space-y-1 pt-16 md:pt-0">
          <h1 className="text-[26px] font-semibold leading-[30px] tracking-tight md:text-[32px] md:leading-[36px]">
            Add your payment details
          </h1>

          <p className="text-[16px] font-normal leading-[20px] text-[#6c6c6c] dark:text-[#A1A1AA] md:text-[18px] md:leading-[24px]">
            Select the payment account you want to use for your property
            listing.
          </p>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="payment-provider"
              className="text-sm font-semibold"
            >
              Payment provider
            </label>

            <select
              id="payment-provider"
              value={paymentProvider ?? ""}
              onChange={handleProviderChange}
              className="h-12 w-full rounded-xl border border-[#D4D4D4]
                bg-white px-4 text-[15px] text-[#201b15] outline-none
                transition-colors focus:border-black
                dark:border-[#404040] dark:bg-[#111111]
                dark:text-white dark:focus:border-white"
            >
              <option value="" disabled>
                Select a payment provider
              </option>

              {PAYMENT_PROVIDERS.map((provider) => (
                <option key={provider} value={provider}>
                  {paymentProviderDetails[provider].label}
                </option>
              ))}
            </select>

            {selectedProvider && (
              <p className="text-sm text-[#777777] dark:text-[#A1A1AA]">
                {selectedProvider.description}
              </p>
            )}
          </div>

          {selectedProvider && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="payment-account"
                className="text-sm font-semibold"
              >
                {selectedProvider.accountLabel}
              </label>

              <input
                id="payment-account"
                type={selectedProvider.inputType}
                value={accountNumber}
                onChange={handleAccountChange}
                placeholder={selectedProvider.placeholder}
                autoComplete="off"
                maxLength={50}
                className="h-12 w-full rounded-xl border border-[#D4D4D4]
                  bg-white px-4 text-[15px] text-[#201b15]
                  outline-none transition-colors placeholder:text-[#999999]
                  focus:border-black dark:border-[#404040]
                  dark:bg-[#111111] dark:text-white
                  dark:placeholder:text-[#666666]
                  dark:focus:border-white"
              />

              <p className="text-sm text-[#777777] dark:text-[#A1A1AA]">
                Enter the account number or phone number associated with
                your selected payment provider.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export const Payment = memo(PaymentComponent);

export default Payment;