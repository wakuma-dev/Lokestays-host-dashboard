import {useState, type HTMLInputTypeAttribute } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Eye, EyeOff } from "lucide-react";
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
        readonly value: string;
        readonly meta: {
        readonly isTouched: boolean;
        readonly errors: readonly unknown[];
        };
    };
    handleChange: (value: string) => void;
    handleBlur: () => void;
}
export interface InputProps {
    field: FieldApi;
    placeholder: string;
    type?: HTMLInputTypeAttribute;
    isPasswordField?: boolean;
    label: string;
    autoComplete: string;
}
export function MyInput({field, placeholder, autoComplete, type="string", isPasswordField=false, label}: InputProps){
  const [showPassword, setShowPassword] = useState(false);
  const inputType: HTMLInputTypeAttribute = isPasswordField ? showPassword ? "text" : "password" : type
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const errorMessage = hasError ? getErrorMessage(field.state.meta.errors) : undefined;
return(
  <Field className="flex flex-col space-y-0.5">
    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
    <div className="relative">
        <Input 
         id={field.name}
         name={field.name}
         type={inputType}
         placeholder={placeholder}
         autoComplete={autoComplete}
         aria-invalid={hasError}
         aria-describedby={hasError ? `${field.name}-errors` : undefined}
         onBlur={field.handleBlur}
         onChange={(e) => field.handleChange(e.target.value)}
         className="data-[invalid]:border-red-400 p-5 
          placeholder:text-[15px] placeholder:leading-[20px] placeholder:text-[#222222]"
         />
         {isPasswordField && (
            <button type="button"
                     aria-label={showPassword ? "Hide password" : "Show password"}
                     aria-pressed={showPassword}
                     onClick={() => setShowPassword((prev) => !prev)}
                     className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer">
                        {showPassword ? <EyeOff aria-hidden="true" className="text-[#222222]" size={17} />
                                      : <Eye aria-hidden="true" className="text-[#222222]" size={17} />}
                     </button>
         )}
    </div>
    {errorMessage && (
        <FieldError id={`${field.name}-errors`}
                    className="text-red-400 text-xs">
                        {errorMessage}
                    </FieldError>
    )}
  </Field>
)
}