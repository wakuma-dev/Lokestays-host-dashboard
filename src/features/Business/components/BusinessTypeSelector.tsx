import { useCallback, useRef, type KeyboardEvent } from "react";
import { Building2, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BUSINESS_TYPE_VALUES,
  type BusinessType,
} from "../types/business.types";
export type BusinessTypeSelectorProps = Readonly<{
  value: BusinessType;
  onChange: (nextValue: BusinessType) => void;
  isDisabled?: boolean;
}>;
type BusinessTypeOption = Readonly<{
  value: BusinessType;
  label: string;
  description: string;
  icon: LucideIcon;
}>;
const BUSINESS_TYPE_OPTIONS: readonly BusinessTypeOption[] = [
  {
    value: "individual",
    label: "Individual",
    description: "I operate as an individual host.",
    icon: UserRound,
  },
  {
    value: "registered",
    label: "Registered business",
    description: "I operate a legally registered business.",
    icon: Building2,
  },
] as const satisfies readonly BusinessTypeOption[];
export default function BusinessTypeSelector({
  value,
  onChange,
  isDisabled = false,
}: BusinessTypeSelectorProps) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const handleSelectOption = useCallback(
    (nextValue: BusinessType, optionIndex: number) => {
      if (isDisabled) {
        return;
      }
      optionRefs.current[optionIndex]?.focus();
      if (nextValue !== value) {
        onChange(nextValue);
      }
    },
    [isDisabled, onChange, value]
  );
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      if (isDisabled) {
        return;
      }
      const totalOptions = BUSINESS_TYPE_OPTIONS.length;
      const isNextKey = event.key === "ArrowRight" || event.key === "ArrowDown";
      const isPrevKey = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!isNextKey && !isPrevKey) {
        return;
      }
      event.preventDefault();
      const delta = isNextKey ? 1 : -1;
      const nextIndex = (currentIndex + delta + totalOptions) % totalOptions;
      const nextOption = BUSINESS_TYPE_OPTIONS[nextIndex];
      if (nextOption) {
        handleSelectOption(nextOption.value, nextIndex);
      }
    },
    [handleSelectOption, isDisabled]
  );
  const isValidBusinessType = (BUSINESS_TYPE_VALUES as readonly string[]).includes(
    value
  );
  const activeValue: BusinessType = isValidBusinessType ? value : "individual";
  return (
    <fieldset
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className="space-y-3"
    >
      <legend className="text-sm font-medium">Business type</legend>
      <div
        role="radiogroup"
        aria-label="Business type"
        className="grid gap-3 sm:grid-cols-2"
      >
        {BUSINESS_TYPE_OPTIONS.map((option, index) => {
          const OptionIcon = option.icon;
          const isSelected = activeValue === option.value;
          return (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelectOption(option.value, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <OptionIcon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 -space-y-1">
                <p className="text-[18px] leading-[26px] text-[#111111] dark:text-[#ffffff] font-medium">{option.label}</p>
                <p className="text-[14px] leading-[20px] font-normal dark:text-[#cec8b2] text-[#3e3529]">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}