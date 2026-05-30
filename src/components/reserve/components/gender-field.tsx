"use client";

import { cn } from "@/lib/utils";
import { inputError } from "./form-field";
import type { Gender } from "../types";

interface GenderFieldProps {
  value: Gender | "";
  onChange: (value: Gender) => void;
  hasError?: boolean;
}

const OPTIONS: Gender[] = ["ذكر", "أنثى"];

/**
 * Radio group for gender selection (ذكر / أنثى).
 */
export function GenderField({ value, onChange, hasError }: GenderFieldProps) {
  return (
    <div className="flex gap-4 mt-2">
      {OPTIONS.map((option) => (
        <label
          key={option}
          className={cn(
            "flex items-center gap-2 cursor-pointer rounded-lg border border-input px-4 py-3 text-sm transition-colors",
            "hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5",
            hasError && "border-destructive"
          )}
        >
          <input
            type="radio"
            name="gender"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="size-4 accent-primary"
          />
          {option}
        </label>
      ))}
    </div>
  );
}
