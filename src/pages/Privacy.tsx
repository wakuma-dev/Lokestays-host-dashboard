import { memo } from "react";
import { Helmet } from "react-helmet-async";
import { useOnboardingStore } from "../features/onboarding/store/onboardingStore";
import { PRIVACY_TYPE_OPTIONS } from "@/features/onboarding/constants/privacy.constants";
function PrivacyComponent() {
  const privacyType = useOnboardingStore(
    (state) => state.privacyType,
  );

  const setPrivacyType = useOnboardingStore(
    (state) => state.setPrivacyType,
  );

  function handlePrivacySelection(
    value: (typeof PRIVACY_TYPE_OPTIONS)[number]["value"],
  ) {
    setPrivacyType(value);
  }

  return (
    <main
      className="fixed inset-0 flex items-center justify-center h-dvh w-full overflow-hidden overscroll-none
        bg-[#FDFDFD] p-4 text-[#201b15]
        dark:bg-[#0A0A0A] dark:text-white md:pb-4"
    >
      <Helmet>
        <title>Privacy Type | Lokestays</title>
        <meta
          name="description"
          content="Choose the type of accommodation your guests will have."
        />
      </Helmet>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-8">
        <header className="flex flex-col items-start space-y-1">
          <h1 className="text-[26px] leading-[30px] tracking-tight font-semibold md:text-[32px] md:leading-[36px]">
            What type of place will guests have?
          </h1>

          <p className="text-[18px] leading-[24px] text-[#6c6c6c] font-normal">
            Choose the type of accommodation you want to offer.
          </p>
        </header>

        <div className="flex w-full flex-col gap-4">
          {PRIVACY_TYPE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = privacyType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handlePrivacySelection(option.value)}
                className={`flex w-full items-center justify-between gap-2
                  rounded-xl border p-5 text-left transition-all duration-200
                  ${
                    isSelected
                      ? "border-2 border-[#222222] bg-[#F7F7F7] dark:border-white dark:bg-[#181818]"
                      : "border-[#DDDDDD] hover:border-[#222222] dark:border-[#333333] dark:hover:border-white"
                  }`}
              >
                <div className="flex min-w-0 flex-col gap-2">
                  <h2 className="text-[18px] leading-[24px] text-[#222222] font-medium tracking-normal">
                    {option.label}
                  </h2>

                  <p className="max-w-sm text-[14px] leading-[18px] text-[#717171] dark:text-[#A1A1AA]">
                    {option.description}
                  </p>
                </div>

                <Icon
                  size={32}
                  strokeWidth={1.6}
                  className="shrink-0"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export const Privacy = memo(PrivacyComponent);

export default Privacy;