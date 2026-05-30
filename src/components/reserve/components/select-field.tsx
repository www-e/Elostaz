"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBase, inputError } from "./form-field";

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
  ariaDescribedBy?: string;
}

/**
 * Styled <select> with a consistent chevron icon.
 */
export function SelectField({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder,
  options,
  hasError,
  ariaDescribedBy,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        className={cn(
          inputBase,
          "appearance-none pl-10",
          hasError && inputError
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    </div>
  );
}
