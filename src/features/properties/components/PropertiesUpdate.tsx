import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Properties } from "../types/properties.types";
import type { UpdatePropertyParams } from "../types/UpdatePropery.types";
import { useUpdatePropertyMutation } from "@/features/properties"
import { updatePropertySchema, type UpdatePropertyFormValues } from "../schema/updatePropertiesSchema";
interface PropertiesUpdateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Properties;
}
export default function PropertiesUpdate({
  open,
  onOpenChange,
  property,
}: PropertiesUpdateProps) {
  const updateMutation = useUpdatePropertyMutation();
  const { add } = useToast();
  const form = useForm({
    defaultValues: {
      pricePerNight: property.pricePerNight,
      guestCapacity: property.guestCapacity,
      bedrooms: property.bedrooms,
      beds: property.beds,
      bathrooms: property.bathrooms,
      structure: property.structure ?? "",
      privacyType: property.privacyType ?? "",
    } satisfies UpdatePropertyFormValues,
    validators: {
      onSubmit: updatePropertySchema,
    },
    onSubmit: async ({ value }) => {
      const payload: UpdatePropertyParams = {
        propertyDraftId: property.id,
        ...value,
      };
      try {
        await updateMutation.mutateAsync(payload);
        add({ title: "Property updated successfully." });
        onOpenChange(false);
      } catch {
        add({ title: "Failed to update property. Please try again.", type: "error" });
      }
    },
  });
  useEffect(() => {
    form.reset({
      pricePerNight: property.pricePerNight,
      guestCapacity: property.guestCapacity,
      bedrooms: property.bedrooms,
      beds: property.beds,
      bathrooms: property.bathrooms,
      structure: property.structure ?? "",
      privacyType: property.privacyType ?? "",
    });
  }, [property, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update property
          </DialogTitle>
          <DialogDescription>
            Update your accommodation information.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-5"
        >
          { }
          <form.Field name="pricePerNight">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Price per night</Label>
                <Input
                  id={field.name}
                  type="number"
                  min={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                />
                {field.state.meta.errors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive">
                    {String(error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
          { }
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <form.Field name="bedrooms">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Bedrooms</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="bathrooms">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Bathrooms</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="beds">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Beds</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="guestCapacity">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Maximum guests</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                  />
                </div>
              )}
            </form.Field>
          </div>
          { }
          <form.Field name="structure">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Structure</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  placeholder="Apartment, house, villa..."
                />
              </div>
            )}
          </form.Field>
          { }
          <form.Field name="privacyType">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Privacy type</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  placeholder="Entire place, private room..."
                />
              </div>
            )}
          </form.Field>
          { }
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
              ]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    updateMutation.isPending
                  }
                >
                  {updateMutation.isPending
                    ? "Updating..."
                    : "Save changes"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
