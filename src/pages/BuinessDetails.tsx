import { Helmet } from "react-helmet-async";

import {
  BusinessInformationFields,
  BusinessTypeSelector,
  useBusinessForm,
} from "@/features/Business";
import type { BusinessType } from "@/features/Business/types/business.types";

export default function BusinessDetails() {
  const form = useBusinessForm();

  const handleBusinessTypeChange = (nextBusinessType: BusinessType) => {
    form.setFieldValue("businessType", nextBusinessType);

    if (nextBusinessType === "individual") {
      form.setFieldValue("legal.legalStructure", null);
      form.setFieldValue("legal.registeredName", "");
      form.setFieldValue("legal.registrationNumber", "");
    }
  };

  return (
    <main className="min-w-0 min-h-screen bg-[#ffffff] p-4 text-[#111] dark:bg-[#141A15] dark:text-[#fff] lg:px-6">
      <Helmet>
        <title>Business Details | Lokestays</title>
        <meta
          name="description"
          content="Manage your Lokestays business information."
        />
      </Helmet>

      <section className="flex w-full flex-col gap-6">
        <header className="flex flex-col items-start gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Business Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Provide information about your rental business.
          </p>
        </header>

        <div role="separator" className="w-full border-b" />

        <form.Subscribe selector={(state) => state.values.businessType}>
          {(businessType) => (
            <BusinessTypeSelector
              value={businessType}
              onChange={handleBusinessTypeChange}
            />
          )}
        </form.Subscribe>

        <BusinessInformationFields form={form} />
      </section>
    </main>
  );
}