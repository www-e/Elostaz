"use client";

import { cn } from "@/lib/utils";
import { inputBase, inputError } from "./form-field";

interface PhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  autoComplete?: string;
  hasError?: boolean;
  disabled?: boolean;
  ariaDescribedBy?: string;
}

/**
 * Phone number input with LTR text direction for digits.
 */
export function PhoneInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  hasError,
  disabled,
  ariaDescribedBy,
}: PhoneInputProps) {
  return (
    <input
      id={id}
      type="tel"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      dir="ltr"
      aria-describedby={ariaDescribedBy}
      className={cn(inputBase, hasError && inputError)}
    />
  );
}
