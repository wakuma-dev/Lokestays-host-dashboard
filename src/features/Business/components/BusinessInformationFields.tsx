import { useCallback, useId, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BusinessFormApi } from "../form/business.form";
import {
  LEGAL_STRUCTURES,
  type LegalStructure,
} from "../types/business.types";
const BUSINESS_NAME_MAX_LENGTH = 100;
const BUSINESS_DESCRIPTION_MAX_LENGTH = 500;
const REGISTERED_NAME_MAX_LENGTH = 120;
const REGISTRATION_NUMBER_MAX_LENGTH = 60;
export type BusinessFormSectionProps = Readonly<{
  form: BusinessFormApi;
  isDisabled?: boolean;
  onCancel?: () => void;
}>;
type FormFieldErrorEntry = string | { message?: unknown } | null | undefined;
const LEGAL_STRUCTURE_LABELS: Readonly<Record<LegalStructure, string>> = {
  sole_proprietorship: "Sole proprietorship",
  partnership: "Partnership",
  private_limited_company: "Private limited company (PLC)",
};
function extractFieldErrorMessage(
  errors: readonly FormFieldErrorEntry[]
): string | undefined {
  for (const entry of errors) {
    if (typeof entry === "string" && entry.trim().length > 0) {
      return entry;
    }
    if (
      entry !== null &&
      typeof entry === "object" &&
      "message" in entry &&
      typeof entry.message === "string" &&
      entry.message.trim().length > 0
    ) {
      return entry.message;
    }
  }
  return undefined;
}
type FieldValidationAlertProps = Readonly<{
  id: string;
  message: string | undefined;
  isVisible: boolean;
}>;
function FieldValidationAlert({
  id,
  message,
  isVisible,
}: FieldValidationAlertProps) {
  if (!isVisible || !message) {
    return null;
  }
  return (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}
export default function BusinessInformationField({
  form,
  isDisabled = false,
  onCancel,
}: BusinessFormSectionProps) {
  const formHeadingId = useId();
  const identityHeadingId = useId();
  const businessNameId = useId();
  const businessNameHintId = useId();
  const businessNameErrorId = useId();
  const descriptionId = useId();
  const descriptionCounterId = useId();
  const descriptionErrorId = useId();
  const contactHeadingId = useId();
  const emailId = useId();
  const emailErrorId = useId();
  const phoneId = useId();
  const phoneErrorId = useId();
  const addressHeadingId = useId();
  const countryId = useId();
  const countryErrorId = useId();
  const cityId = useId();
  const cityErrorId = useId();
  const subCityId = useId();
  const subCityErrorId = useId();
  const streetAddressId = useId();
  const streetAddressErrorId = useId();
  const legalHeadingId = useId();
  const legalStructureId = useId();
  const legalStructureErrorId = useId();
  const registeredNameId = useId();
  const registeredNameErrorId = useId();
  const registrationNumberId = useId();
  const registrationNumberErrorId = useId();
  const handleCancelClick = useCallback(() => {
    form.reset();
    onCancel?.();
  }, [form, onCancel]);
  const handleSaveClick = useCallback(async () => {
    try {
       await form.handleSubmit();
    } catch(error: unknown){
       console.error("Failed to save business details:", error);
    }
  }, [form]);
  return (
    <div aria-labelledby={formHeadingId} className="space-y-8">
      <header className="space-y-1">
        <h2 id={formHeadingId} className="text-lg font-semibold tracking-tight">
          Business profile details
        </h2>
        <p className="text-sm text-muted-foreground">
          Complete your identity, contact, address, and legal details.
        </p>
      </header>
      { }
      <section aria-labelledby={identityHeadingId} className="space-y-5">
        <header className="space-y-1">
          <h3 id={identityHeadingId} className="text-[18px] leading-[26px] tracking-tight font-medium text-[#111111] dark:text-[#ffffff]">
            Business information
          </h3>
          <p className="text-[14px] leading-[20px] font-normal text-muted-foreground">
            Tell guests about your rental business.
          </p>
        </header>
        <form.Field name="businessName">
          {(field) => {
            const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
            const hasError = field.state.meta.isTouched && Boolean(errorMessage);
            const describedBy = hasError
              ? `${businessNameHintId} ${businessNameErrorId}`
              : businessNameHintId;
            const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
              field.handleChange(event.target.value);
            };
            return (
              <div className="space-y-2">
                <Label htmlFor={businessNameId}>Business name</Label>
                <Input
                  id={businessNameId}
                  name={field.name}
                  type="text"
                  autoComplete="organization"
                  placeholder="Enter your business name"
                  value={field.state.value}
                  maxLength={BUSINESS_NAME_MAX_LENGTH}
                  disabled={isDisabled}
                  aria-invalid={hasError}
                  aria-describedby={describedBy}
                  onBlur={field.handleBlur}
                  onChange={handleChange}
                />
                <FieldValidationAlert
                  id={businessNameErrorId}
                  message={errorMessage}
                  isVisible={hasError}
                />
                <p id={businessNameHintId} className="text-xs text-muted-foreground">
                  Use the name guests will recognize.
                </p>
              </div>
            );
          }}
        </form.Field>
        <form.Field name="description">
          {(field) => {
            const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
            const hasError = field.state.meta.isTouched && Boolean(errorMessage);
            const describedBy = hasError
              ? `${descriptionCounterId} ${descriptionErrorId}`
              : descriptionCounterId;
            const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
              field.handleChange(event.target.value);
            };
            return (
              <div className="space-y-2">
                <Label htmlFor={descriptionId}>Description</Label>
                <Textarea
                  id={descriptionId}
                  name={field.name}
                  placeholder="Describe your rental business..."
                  value={field.state.value ?? ""}
                  maxLength={BUSINESS_DESCRIPTION_MAX_LENGTH}
                  disabled={isDisabled}
                  aria-invalid={hasError}
                  aria-describedby={describedBy}
                  onBlur={field.handleBlur}
                  onChange={handleChange}
                  className="min-h-28 resize-y"
                />
                <div className="flex items-center justify-between gap-2">
                  <FieldValidationAlert
                    id={descriptionErrorId}
                    message={errorMessage}
                    isVisible={hasError}
                  />
                  <span
                    id={descriptionCounterId}
                    aria-live="polite"
                    className="text-xs text-muted-foreground"
                  >
                    {(field.state.value ?? "").length}/{BUSINESS_DESCRIPTION_MAX_LENGTH}
                  </span>
                </div>
              </div>
            );
          }}
        </form.Field>
      </section>
      {/* 3. Contact Details (`contact.email`, `contact.phone`) */}
      <section aria-labelledby={contactHeadingId} className="space-y-4">
        <header className="space-y-1">
          <h3 id={contactHeadingId} className="text-base font-semibold">
            Contact details
          </h3>
          <p className="text-sm text-muted-foreground">
            Provide contact channels for booking and account notices.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="contact.email">
            {(field) => {
              const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
              const hasError = field.state.meta.isTouched && Boolean(errorMessage);
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                field.handleChange(event.target.value);
              };
              return (
                <div className="space-y-2">
                  <Label htmlFor={emailId}>Email address</Label>
                  <Input
                    id={emailId}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="host@example.com"
                    value={field.state.value}
                    disabled={isDisabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? emailErrorId : undefined}
                    onBlur={field.handleBlur}
                    onChange={handleChange}
                  />
                  <FieldValidationAlert
                    id={emailErrorId}
                    message={errorMessage}
                    isVisible={hasError}
                  />
                </div>
              );
            }}
          </form.Field>
          <form.Field name="contact.phone">
            {(field) => {
              const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
              const hasError = field.state.meta.isTouched && Boolean(errorMessage);
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                field.handleChange(event.target.value);
              };
              return (
                <div className="space-y-2">
                  <Label htmlFor={phoneId}>Phone number</Label>
                  <Input
                    id={phoneId}
                    name={field.name}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+251 9XX XXX XXX"
                    value={field.state.value}
                    disabled={isDisabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? phoneErrorId : undefined}
                    onBlur={field.handleBlur}
                    onChange={handleChange}
                  />
                  <FieldValidationAlert
                    id={phoneErrorId}
                    message={errorMessage}
                    isVisible={hasError}
                  />
                </div>
              );
            }}
          </form.Field>
        </div>
      </section>
      {/* 4. Address (`address.country`, `address.city`, `address.subCity`, `address.streetAddress`) */}
      <section aria-labelledby={addressHeadingId} className="space-y-4">
        <header className="space-y-1">
          <h3 id={addressHeadingId} className="text-base font-semibold">
            Business address
          </h3>
          <p className="text-sm text-muted-foreground">
            Specify where your business operates.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="address.country">
            {(field) => {
              const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
              const hasError = field.state.meta.isTouched && Boolean(errorMessage);
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                field.handleChange(event.target.value);
              };
              return (
                <div className="space-y-2">
                  <Label htmlFor={countryId}>Country</Label>
                  <Input
                    id={countryId}
                    name={field.name}
                    type="text"
                    autoComplete="country-name"
                    placeholder="Ethiopia"
                    value={field.state.value}
                    disabled={isDisabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? countryErrorId : undefined}
                    onBlur={field.handleBlur}
                    onChange={handleChange}
                  />
                  <FieldValidationAlert
                    id={countryErrorId}
                    message={errorMessage}
                    isVisible={hasError}
                  />
                </div>
              );
            }}
          </form.Field>
          <form.Field name="address.city">
            {(field) => {
              const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
              const hasError = field.state.meta.isTouched && Boolean(errorMessage);
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                field.handleChange(event.target.value);
              };
              return (
                <div className="space-y-2">
                  <Label htmlFor={cityId}>City</Label>
                  <Input
                    id={cityId}
                    name={field.name}
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Addis Ababa"
                    value={field.state.value}
                    disabled={isDisabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? cityErrorId : undefined}
                    onBlur={field.handleBlur}
                    onChange={handleChange}
                  />
                  <FieldValidationAlert
                    id={cityErrorId}
                    message={errorMessage}
                    isVisible={hasError}
                  />
                </div>
              );
            }}
          </form.Field>
          <form.Field name="address.subCity">
            {(field) => {
              const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
              const hasError = field.state.meta.isTouched && Boolean(errorMessage);
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                field.handleChange(event.target.value);
              };
              return (
                <div className="space-y-2">
                  <Label htmlFor={subCityId}>Sub-city</Label>
                  <Input
                    id={subCityId}
                    name={field.name}
                    type="text"
                    placeholder="Bole"
                    value={field.state.value}
                    disabled={isDisabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? subCityErrorId : undefined}
                    onBlur={field.handleBlur}
                    onChange={handleChange}
                  />
                  <FieldValidationAlert
                    id={subCityErrorId}
                    message={errorMessage}
                    isVisible={hasError}
                  />
                </div>
              );
            }}
          </form.Field>
          <form.Field name="address.streetAddress">
            {(field) => {
              const errorMessage = extractFieldErrorMessage(field.state.meta.errors);
              const hasError = field.state.meta.isTouched && Boolean(errorMessage);
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                field.handleChange(event.target.value);
              };
              return (
                <div className="space-y-2">
                  <Label htmlFor={streetAddressId}>Street address</Label>
                  <Input
                    id={streetAddressId}
                    name={field.name}
                    type="text"
                    autoComplete="street-address"
                    placeholder="Street or landmark"
                    value={field.state.value}
                    disabled={isDisabled}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? streetAddressErrorId : undefined}
                    onBlur={field.handleBlur}
                    onChange={handleChange}
                  />
                  <FieldValidationAlert
                    id={streetAddressErrorId}
                    message={errorMessage}
                    isVisible={hasError}
                  />
                </div>
              );
            }}
          </form.Field>
        </div>
      </section>
      {/* 5. Legal Details (`legal.legalStructure`, `legal.registeredName`, `legal.registrationNumber`) */}
      <form.Subscribe selector={(state) => state.values.businessType}>
        {(businessType) => {
          const isRegistered = businessType === "registered";
          return (
            <section aria-labelledby={legalHeadingId} className="space-y-4">
              <header className="space-y-1">
                <h3 id={legalHeadingId} className="text-base font-semibold">
                  Legal details
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRegistered
                    ? "Provide your official registration details for a registered business."
                    : "Optional for individual hosts; switch to Registered business to enter entity details."}
                </p>
              </header>
              <div className="grid gap-4 sm:grid-cols-3">
                <form.Field name="legal.legalStructure">
                  {(field) => {
                    const errorMessage = extractFieldErrorMessage(
                      field.state.meta.errors
                    );
                    const hasError =
                      field.state.meta.isTouched && Boolean(errorMessage);
                    const handleSelectChange = (
                      event: ChangeEvent<HTMLSelectElement>
                    ) => {
                      const rawValue = event.target.value;
                      const matchedStructure = (
                        LEGAL_STRUCTURES as readonly string[]
                      ).find((item) => item === rawValue) as
                        | LegalStructure
                        | undefined;
                      field.handleChange(matchedStructure ?? null);
                    };
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={legalStructureId}>
                          Legal structure
                        </Label>
                        <select
                          id={legalStructureId}
                          name={field.name}
                          value={field.state.value ?? ""}
                          disabled={isDisabled || !isRegistered}
                          aria-invalid={hasError}
                          aria-describedby={
                            hasError ? legalStructureErrorId : undefined
                          }
                          onBlur={field.handleBlur}
                          onChange={handleSelectChange}
                          className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50"
                          )}
                        >
                          <option value="">Select legal structure</option>
                          {LEGAL_STRUCTURES.map((structure) => (
                            <option key={structure} value={structure}>
                              {LEGAL_STRUCTURE_LABELS[structure]}
                            </option>
                          ))}
                        </select>
                        <FieldValidationAlert
                          id={legalStructureErrorId}
                          message={errorMessage}
                          isVisible={hasError}
                        />
                      </div>
                    );
                  }}
                </form.Field>
                <form.Field name="legal.registeredName">
                  {(field) => {
                    const errorMessage = extractFieldErrorMessage(
                      field.state.meta.errors
                    );
                    const hasError =
                      field.state.meta.isTouched && Boolean(errorMessage);
                    const handleChange = (
                      event: ChangeEvent<HTMLInputElement>
                    ) => {
                      field.handleChange(event.target.value);
                    };
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={registeredNameId}>
                          Registered name
                        </Label>
                        <Input
                          id={registeredNameId}
                          name={field.name}
                          type="text"
                          placeholder="Official registered name"
                          value={field.state.value ?? ""}
                          maxLength={REGISTERED_NAME_MAX_LENGTH}
                          disabled={isDisabled || !isRegistered}
                          aria-invalid={hasError}
                          aria-describedby={
                            hasError ? registeredNameErrorId : undefined
                          }
                          onBlur={field.handleBlur}
                          onChange={handleChange}
                        />
                        <FieldValidationAlert
                          id={registeredNameErrorId}
                          message={errorMessage}
                          isVisible={hasError}
                        />
                      </div>
                    );
                  }}
                </form.Field>
                <form.Field name="legal.registrationNumber">
                  {(field) => {
                    const errorMessage = extractFieldErrorMessage(
                      field.state.meta.errors
                    );
                    const hasError =
                      field.state.meta.isTouched && Boolean(errorMessage);
                    const handleChange = (
                      event: ChangeEvent<HTMLInputElement>
                    ) => {
                      field.handleChange(event.target.value);
                    };
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={registrationNumberId}>
                          Registration number
                        </Label>
                        <Input
                          id={registrationNumberId}
                          name={field.name}
                          type="text"
                          placeholder="TIN / Commercial reg. no."
                          value={field.state.value ?? ""}
                          maxLength={REGISTRATION_NUMBER_MAX_LENGTH}
                          disabled={isDisabled || !isRegistered}
                          aria-invalid={hasError}
                          aria-describedby={
                            hasError ? registrationNumberErrorId : undefined
                          }
                          onBlur={field.handleBlur}
                          onChange={handleChange}
                        />
                        <FieldValidationAlert
                          id={registrationNumberErrorId}
                          message={errorMessage}
                          isVisible={hasError}
                        />
                      </div>
                    );
                  }}
                </form.Field>
              </div>
            </section>
          );
        }}
      </form.Subscribe>
      {/* 6. Cancel & Save Actions */}
      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
        })}
      >
        {({ isSubmitting, isDirty }) => {
          const isActionLocked = isDisabled || isSubmitting;
          return (
            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isActionLocked || !isDirty}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isActionLocked}
                onClick={handleSaveClick}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          );
        }}
      </form.Subscribe>
    </div>
  );
}