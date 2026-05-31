"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBase, inputError } from "./form-field";
import type { SelectOption } from "../types";

interface CustomDropdownProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder: string;
  options: SelectOption[];
  hasError?: boolean;
  ariaDescribedBy?: string;
}

/**
 * A reusable, fully custom dropdown (no native <select>).
 * - RTL-aware (Arabic-first)
 * - Keyboard navigation: ArrowUp/Down, Enter/Space, Escape, Tab
 * - Click-outside-to-close
 * - Optional sublabel on each option (e.g. price)
 */
export function CustomDropdown({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder,
  options,
  hasError,
  ariaDescribedBy,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    // Use mousedown so it fires before the trigger's onClick
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* ── Scroll focused item into view ── */
  useEffect(() => {
    if (!open || focusedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[focusedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, open]);

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setFocusedIndex(options.findIndex((o) => o.value === value));
            break;
          }
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            onChange(options[focusedIndex].value);
            setOpen(false);
            triggerRef.current?.focus();
            onBlur?.();
          }
          break;

        case "Escape":
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          onBlur?.();
          break;

        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : prev
            );
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (open) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;

        case "Tab":
          setOpen(false);
          // onBlur will fire naturally from the button losing focus
          break;
      }
    },
    [disabled, open, focusedIndex, options, value, onChange, onBlur]
  );

  /* ── Select an option ── */
  const selectOption = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
    triggerRef.current?.focus();
    onBlur?.();
  };

  /* ── Trigger onClick ── */
  const handleTriggerClick = () => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) {
        // Focus the currently selected item when opening
        setFocusedIndex(options.findIndex((o) => o.value === value));
      }
      return !prev;
    });
  };

  /* ── Render ── */
  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {/* ── Trigger button ── */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-describedby={ariaDescribedBy}
        aria-label={placeholder}
        disabled={disabled}
        onClick={handleTriggerClick}
        className={cn(
          inputBase,
          "flex items-center justify-between gap-2 text-right",
          "pl-10 rtl:pl-4 rtl:pr-10",
          "cursor-pointer select-none",
          !selectedOption && "text-muted-foreground/60",
          hasError && inputError
        )}
      >
        <span className="truncate">
          {selectedOption
            ? selectedOption.sublabel
              ? `${selectedOption.label} — ${selectedOption.sublabel}`
              : selectedOption.label
            : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ── Dropdown list ── */}
      {open && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={placeholder}
          className={cn(
            "absolute z-50 mt-1 w-full min-w-[200px]",
            "rounded-lg border border-input bg-popover bg-background",
            "shadow-lg overflow-hidden",
            "animate-in fade-in-0 zoom-in-95",
            "origin-top-right rtl:origin-top-left"
          )}
        >
          {options.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted-foreground text-center">
              لا توجد خيارات متاحة
            </li>
          ) : (
            options.map((opt, index) => {
              const isSelected = opt.value === value;
              const isFocused = index === focusedIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(opt.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={cn(
                    "px-4 py-3 text-sm cursor-pointer transition-colors",
                    "flex items-center justify-between gap-2",
                    isSelected &&
                      "bg-primary/10 text-primary font-medium",
                    !isSelected &&
                      isFocused &&
                      "bg-muted",
                    !isSelected &&
                      !isFocused &&
                      "hover:bg-muted"
                  )}
                >
                  <span>{opt.label}</span>
                  {opt.sublabel && (
                    <span className="text-xs text-muted-foreground shrink-0 font-normal">
                      {opt.sublabel}
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
