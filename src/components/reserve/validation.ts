/**
 * Pure validation functions — no React, no side-effects.
 * Kept separate so they're unit-testable independently.
 */

/* ── Helpers ── */

/** Strips whitespace and splits into words */
function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

/** Removes all non-digit characters */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/* ── Validators ── */

export interface ValidationResult {
  ok: boolean;
  message?: string;
}

export function validateStudentName(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, message: "اسم الطالب مطلوب" };
  if (wordCount(trimmed) < 3)
    return {
      ok: false,
      message: "يجب أن يتكون الاسم من 3 أجزاء على الأقل (مثال: عمر اشرف حسن)",
    };
  if (/[\d]/.test(trimmed))
    return { ok: false, message: "الاسم يجب أن لا يحتوي على أرقام" };
  return { ok: true };
}

export function validatePhone(
  value: string,
  label: string
): ValidationResult {
  const cleaned = value.trim();
  if (!cleaned) return { ok: false, message: `${label} مطلوب` };
  const digits = onlyDigits(cleaned);
  if (digits.length < 10)
    return { ok: false, message: `${label} يجب أن يتكون من 10 أرقام على الأقل` };
  return { ok: true };
}

export function validateRequired(
  value: string,
  label: string
): ValidationResult {
  if (!value) return { ok: false, message: `يجب اختيار ${label}` };
  return { ok: true };
}

/* ── Timestamp formatter ── */

export function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
