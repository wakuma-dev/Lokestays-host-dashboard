import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
function getErrorMessage(errors: readonly unknown[]): string | undefined {
    const messages = errors
        .map((error) => {
            if (typeof error === "string") {
                return error;
            }

            if (
                typeof error === "object" &&
                error !== null &&
                "message" in error &&
                typeof error.message === "string"
            ) {
                return error.message;
            }

            return undefined;
        })
        .filter((message): message is string => Boolean(message));

    const unique = [...new Set(messages)];

    return unique.length > 0 ? unique.join(", ") : undefined;
}
interface FieldApi {
    readonly name: string;
    readonly state: {
        readonly value: boolean;
        readonly meta: {
            readonly isTouched: boolean;
            readonly errors: readonly unknown[]
        }
    }
    handleChange: (value: boolean) => void;
    handleBlur: () => void;
}
interface CheckboxProps {
    field: FieldApi;
    
}
export function MyCheckbox({field}: CheckboxProps){
    const hasErrors = field.state.meta.errors.length > 0 && field.state.meta.isTouched;
    const errorMessage = hasErrors ? getErrorMessage(field.state.meta.errors) : undefined 
    return(
    <Field>
        <div className="flex items-start md:items-center space-x-2 mt-1">
            <Checkbox 
             id={field.name}
             name={field.name}
             checked={field.state.value}
             onCheckedChange={(checked) => field.handleChange(checked)}
             onBlur={field.handleBlur}
             aria-invalid={hasErrors}
             aria-describedby={hasErrors ? `${field.name}-errors` : undefined}
             className="mt-0.5 data-[invalid]:border-red-400 md:mt-0"
             />
             <FieldLabel htmlFor={field.name} className="flex-1 min-w-0 font-normal text-[#222222] leading-snug">
                I agree to the{" "}
               <Link to="/terms-of-services"
                                         className="whitespace-nowrap underline underline-offset-4 text-primary"
                                         onClick={(event) => event.stopPropagation()}>
                                            Terms of Service
                                         </Link><span className="block sm:inline">{" "}and{" "}
                                    <Link to="/privacy-policy"
                                          className="whitespace-nowrap underline underline-offset-4 text-primary"
                                          onClick={(event) => event.stopPropagation()}>
                                            Privacy Policy
                                          </Link>
                                          </span>
             </FieldLabel>
        </div>
           {errorMessage && (
                <FieldError id={`${field.name}-errors`}
                            className="text-red-400 text-xs">
                                {errorMessage}
                            </FieldError>
            )}
    </Field>
    );
}