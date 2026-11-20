import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { profileSchema } from "../schema/profileSchema";
import { Separator } from "@/components/ui/separator";
import { useUpdateProfileMutation } from "../mutations/profileMutations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const legalNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name cannot exceed 100 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name cannot exceed 100 characters"),
});

const emailSchema = z.object({
  email: profileSchema.shape.email,
});

type LegalNameValues = z.infer<typeof legalNameSchema>;
type EmailValues = z.infer<typeof emailSchema>;
type EditableField = "fullName" | "email" | null;
type ProfileUpdatePayload = {
  fullName?: string;
  email?: string;
};
type ProfileInformationProps = {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
};

type DetailInfoProps = {
  label: string;
  value: string;
  isDisabled?: boolean;
  onEdit: () => void;
};

function DetailInfo({
  label,
  value,
  isDisabled = false,
  onEdit,
}: DetailInfoProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col space-y-1.5">
        <span className="text-[16px] leading-[20px] tracking-tight font-medium">
          {label}
        </span>
        <p className="text-[14px] leading-[18px] text-muted-foreground">
          {value}
        </p>
      </div>
      <Button
        type="button"
        variant="link"
        disabled={isDisabled}
        className="shrink-0 cursor-pointer p-0 underline font-semibold"
        onClick={onEdit}
      >
        Edit
      </Button>
    </div>
  );
}

type LegalNameFormProps = {
  fullName: string;
  isMutationPending: boolean;
  onCancel: () => void;
  onSave: (fullName: string) => Promise<void>;
};
function LegalNameForm({
  fullName,
  isMutationPending,
  onCancel,
  onSave,
}: LegalNameFormProps) {
  const normalizedParts = fullName.trim().split(/\s+/).filter(Boolean);

  const form = useForm({
    defaultValues: {
      firstName: normalizedParts[0] ?? "",
      lastName: normalizedParts.slice(1).join(" "),
    } satisfies LegalNameValues,
    validators: {
      onSubmit: legalNameSchema,
    },
    onSubmit: async ({ value }) => {
      const parsedResult = legalNameSchema.safeParse(value);
      if (!parsedResult.success) {
        return;
      }

      const formattedName = `${parsedResult.data.firstName} ${parsedResult.data.lastName}`.trim();
      await onSave(formattedName);
    },
  });

  const isBusy = isMutationPending;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-[14px] leading-[18px] font-normal tracking-normal">
          Make sure this matches the name on your government ID.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <form.Field name="firstName">
            {(field) => (
              <div className="min-h-14 flex flex-col justify-center space-y-0.5 rounded-lg border border-[#222222] px-3 py-1.5 dark:border-input">
                <label
                  htmlFor="firstName"
                  className="block text-[14px] leading-[18px] font-normal text-muted-foreground"
                >
                  First name on ID
                </label>
                <Input
                  id="firstName"
                  className="h-5 border-0 bg-transparent px-0 py-0 text-[16px] leading-[20px] shadow-none"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors
                      .map((err) => (typeof err === "string" ? err : err?.message ?? ""))
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="lastName">
            {(field) => (
              <div className="min-h-14 flex flex-col justify-center space-y-0.5 rounded-lg border border-[#222222] px-3 py-1.5 dark:border-input">
                <label
                  htmlFor="lastName"
                  className="block text-[14px] leading-[18px] font-normal text-muted-foreground"
                >
                  Last name on ID
                </label>
                <Input
                  id="lastName"
                  className="h-5 border-0 bg-transparent px-0 py-0 shadow-none text-[16px] leading-[20px]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors
                      .map((err) => (typeof err === "string" ? err : err?.message ?? ""))
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isFormSubmitting) => {
          const isSubmitting = isFormSubmitting || isBusy;
          return (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="link"
                onClick={onCancel}
                disabled={isSubmitting}
                className="cursor-pointer text-[14px] leading-[20px] tracking-normal font-normal"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer text-[14px] leading-[20px] tracking-normal font-normal"
              >
                {isSubmitting ? <Spinner /> : "Save"}
              </Button>
            </div>
          );
        }}
      </form.Subscribe>
    </form>
  );
}

type EmailFormProps = {
  email: string;
  isMutationPending: boolean;
  onCancel: () => void;
  onSave: (email: string) => Promise<void>;
};

/**
 * Validates and submits email address updates via runtime schema verification.
 * Time complexity: O(1) | Space complexity: O(1).
 */
function EmailForm({
  email,
  isMutationPending,
  onCancel,
  onSave,
}: EmailFormProps) {
  const form = useForm({
    defaultValues: {
      email,
    } satisfies EmailValues,
    validators: {
      onSubmit: emailSchema,
    },
    onSubmit: async ({ value }) => {
      const parsedResult = emailSchema.safeParse(value);
      if (!parsedResult.success) {
        return;
      }

      await onSave(parsedResult.data.email);
    },
  });

  const isBusy = isMutationPending;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <div className="min-h-14 flex flex-col justify-center space-y-0.5 rounded-lg border border-[#222222] px-3 py-1.5 dark:border-input">
            <label
              htmlFor="email"
              className="block text-[14px] leading-[20px] font-normal text-muted-foreground"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              className="h-5 border-0 bg-transparent px-0 py-0 shadow-none text-[16px] leading-[20px]"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors
                  .map((err) => (typeof err === "string" ? err : err?.message ?? ""))
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isFormSubmitting) => {
          const isSubmitting = isFormSubmitting || isBusy;
          return (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="link"
                onClick={onCancel}
                disabled={isSubmitting}
                className="text-[14px] leading-[20px] cursor-pointer font-normal tracking-normal"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer text-[14px] leading-[20px] font-normal tracking-normal"
              >
                {isSubmitting ? <Spinner /> : "Save"}
              </Button>
            </div>
          );
        }}
      </form.Subscribe>
    </form>
  );
}

export default function ProfileInformation({
  uid,
  fullName,
  email,
  phoneNumber,
}: ProfileInformationProps) {
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const updateProfileMutation = useUpdateProfileMutation(uid);

  const handlePersistProfile = async (payload: ProfileUpdatePayload): Promise<void> => {
    setSubmissionError(null);
    try {
      await updateProfileMutation.mutateAsync(payload);
      setEditingField(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      setSubmissionError(message);
      throw error;
    }
  };

  return (
    <Card className="border-0 ring-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-[26px] leading-[30px] tracking-tight font-semibold">
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {submissionError !== null && (
          <p role="alert" className="text-sm text-destructive">
            {submissionError}
          </p>
        )}

        {editingField === "fullName" ? (
          <LegalNameForm
            fullName={fullName}
            isMutationPending={updateProfileMutation.isPending}
            onCancel={() => {
              setSubmissionError(null);
              setEditingField(null);
            }}
            onSave={async (value) => {
              await handlePersistProfile({ fullName: value });
            }}
          />
        ) : (
          <DetailInfo
            label="Legal Name"
            value={fullName}
            isDisabled={updateProfileMutation.isPending}
            onEdit={() => {
              setSubmissionError(null);
              setEditingField("fullName");
            }}
          />
        )}

        <Separator />

        {editingField === "email" ? (
          <EmailForm
            email={email}
            isMutationPending={updateProfileMutation.isPending}
            onCancel={() => {
              setSubmissionError(null);
              setEditingField(null);
            }}
            onSave={async (value) => {
              await handlePersistProfile({ email: value });
            }}
          />
        ) : (
          <DetailInfo
            label="Email address"
            value={email}
            isDisabled={updateProfileMutation.isPending}
            onEdit={() => {
              setSubmissionError(null);
              setEditingField("email");
            }}
          />
        )}

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col space-y-1.5">
            <span className="text-[16px] leading-[20px] tracking-tight font-medium">
              Phone number
            </span>
            <p className="text-[14px] leading-[18px] text-muted-foreground">
              {phoneNumber || "Not provided"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}