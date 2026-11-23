import { useForm } from "@tanstack/react-form";
import {
  businessDraftSchema,
  type BusinessDraftValues,
} from "../schema/businessDraftSchema";
import { saveBusinessDraft } from "../api/business.api";
export const DEFAULT_BUSINESS_DRAFT_VALUES: BusinessDraftValues = {
  businessType: "individual",
  businessName: "",
  description: "",
  contact: {
    email: "",
    phone: "",
  },
  address: {
    country: "",
    city: "",
    subCity: "",
    streetAddress: "",
  },
  legal: {
    legalStructure: null,
    registeredName: "",
    registrationNumber: "",
  },
};
export function useBusinessForm(
  initialValues: BusinessDraftValues = DEFAULT_BUSINESS_DRAFT_VALUES
) {
  return useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: businessDraftSchema,
    },
    onSubmit: async ({ value }) => {
      const parsedDraft = businessDraftSchema.parse(value);
      await saveBusinessDraft(parsedDraft);
    },
  });
}
export type BusinessFormApi = ReturnType<typeof useBusinessForm>;