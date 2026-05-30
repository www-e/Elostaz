"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  BookingData,
  BookingFormState,
  FormErrors,
  TouchedFields,
  FormFieldName,
  GradeValue,
} from "../types";
import { STORAGE_KEY } from "../constants";
import {
  validateStudentName,
  validatePhone,
  validateRequired,
  type ValidationResult,
} from "../validation";

/* ── Initial state ── */

const INITIAL_STATE: BookingFormState = {
  studentName: "",
  studentPhone: "",
  parentPhone: "",
  gender: "",
  grade: "",
  groupDay: "",
  groupTime: "",
};

/* ── Field labels for validation messages ── */

const FIELD_LABELS: Record<FormFieldName, string> = {
  studentName: "اسم الطالب",
  studentPhone: "رقم الطالب",
  parentPhone: "رقم ولي الأمر",
  gender: "النوع",
  grade: "الصف الدراسي",
  groupDay: "يوم المجموعة",
  groupTime: "وقت المجموعة",
};

/* ── Validation dispatch ── */

function runFieldValidation(
  field: FormFieldName,
  value: string
): ValidationResult {
  switch (field) {
    case "studentName":
      return validateStudentName(value);
    case "studentPhone":
      return validatePhone(value, FIELD_LABELS[field]);
    case "parentPhone":
      return validatePhone(value, FIELD_LABELS[field]);
    case "gender":
      return validateRequired(value, FIELD_LABELS[field]);
    case "grade":
      return validateRequired(value, FIELD_LABELS[field]);
    case "groupDay":
      return validateRequired(value, FIELD_LABELS[field]);
    case "groupTime":
      return validateRequired(value, FIELD_LABELS[field]);
    default:
      return { ok: true };
  }
}

/* ── Hook ── */

export function useBookingForm() {
  const [fields, setFields] = useState<BookingFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submittedData, setSubmittedData] = useState<BookingData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ── Hydrate from localStorage on mount ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.studentName && typeof parsed.studentName === "string") {
          setSubmittedData(parsed as BookingData);
        }
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  /* ── Generic field updater ── */
  const updateField = useCallback(
    <K extends keyof BookingFormState>(name: K, value: BookingFormState[K]) => {
      setFields((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  /* ── Blur handler: validate single field ── */
  const handleBlur = useCallback(
    (name: FormFieldName) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const { ok, message } = runFieldValidation(name, fields[name]);
      setErrors((prev) => {
        if (ok) {
          const next = { ...prev };
          delete next[name];
          return next;
        }
        return { ...prev, [name]: message };
      });
    },
    [fields]
  );

  /* ── Full form validation ── */
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    const allTouched: TouchedFields = {};

    (Object.keys(INITIAL_STATE) as FormFieldName[]).forEach((field) => {
      allTouched[field] = true;
      const { ok, message } = runFieldValidation(field, fields[field]);
      if (!ok) newErrors[field] = message;
    });

    setErrors(newErrors);
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  }, [fields]);

  /* ── Submit: POST to API, fallback to localStorage ── */
  const handleSubmit = useCallback(async () => {
    if (!validateAll()) return;

    const data: BookingData = {
      studentName: fields.studentName.trim(),
      studentPhone: fields.studentPhone.replace(/\D/g, ""),
      parentPhone: fields.parentPhone.replace(/\D/g, ""),
      gender: fields.gender as BookingData["gender"],
      grade: fields.grade as GradeValue,
      groupDay: fields.groupDay,
      groupTime: fields.groupTime,
      submittedAt: new Date().toISOString(),
      apiSaved: false,
    };

    setSubmitting(true);
    setSubmitError(null);

    let savedOnServer = false;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.ok) {
        savedOnServer = true;
      } else {
        const msg =
          result?.errors?.[0]?.message ??
          result?.error ??
          "تعذر الاتصال بالخادم";
        setSubmitError(msg);
      }
    } catch (err) {
      console.warn("Network error, falling back to localStorage:", err);
      setSubmitError("تعذر الاتصال بالخادم، تم حفظ البيانات محلياً فقط");
    } finally {
      setSubmitting(false);
    }

    // Always persist to localStorage as offline fallback
    data.apiSaved = savedOnServer;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }

    setSubmittedData(data);
  }, [fields, validateAll]);

  /* ── Reset with confirmation ── */
  const handleReset = useCallback(() => {
    if (
      submittedData &&
      !window.confirm("هل أنت متأكد؟ سيتم حذف بيانات الحجز السابق.")
    ) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    setSubmittedData(null);
    setFields(INITIAL_STATE);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [submittedData]);

  /* ── Get error for a field (only if touched) ── */
  const getError = useCallback(
    (name: FormFieldName): string | undefined =>
      touched[name] ? errors[name] : undefined,
    [touched, errors]
  );

  const hasTouched = Object.values(touched).some(Boolean);

  return {
    fields,
    errors,
    touched,
    submittedData,
    submitting,
    submitError,
    hasTouched,
    updateField,
    handleBlur,
    handleSubmit,
    handleReset,
    getError,
  };
}
