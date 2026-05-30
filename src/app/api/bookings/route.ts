import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";

/* ── Server-side validation (mirrors client-side) ── */

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

interface ValidationError {
  field: string;
  message: string;
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function validatePayload(body: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // studentName: required, >= 3 words, no digits
  if (!isString(body.studentName) || body.studentName.trim().length === 0) {
    errors.push({ field: "studentName", message: "اسم الطالب مطلوب" });
  } else if (wordCount(body.studentName) < 3) {
    errors.push({
      field: "studentName",
      message: "يجب أن يتكون الاسم من 3 أجزاء على الأقل",
    });
  } else if (/[\d]/.test(body.studentName)) {
    errors.push({
      field: "studentName",
      message: "الاسم يجب أن لا يحتوي على أرقام",
    });
  }

  // phones: required, digits only, >= 10
  for (const field of ["studentPhone", "parentPhone"] as const) {
    const label = field === "studentPhone" ? "رقم الطالب" : "رقم ولي الأمر";
    const val = body[field];
    if (!isString(val) || val.trim().length === 0) {
      errors.push({ field, message: `${label} مطلوب` });
    } else if (val.replace(/\s/g, "").length < 10) {
      errors.push({
        field,
        message: `${label} يجب أن يتكون من 10 أرقام على الأقل`,
      });
    } else if (!/^\d+$/.test(val.replace(/\s/g, ""))) {
      errors.push({
        field,
        message: `${label} يجب أن يحتوي على أرقام فقط`,
      });
    }
  }

  // gender
  if (body.gender !== "ذكر" && body.gender !== "أنثى") {
    errors.push({ field: "gender", message: "يجب اختيار النوع" });
  }

  // grade
  if (!["10", "11", "12"].includes(body.grade as string)) {
    errors.push({ field: "grade", message: "يجب اختيار الصف الدراسي" });
  }

  // groupDay
  if (!isString(body.groupDay) || body.groupDay.trim().length === 0) {
    errors.push({ field: "groupDay", message: "يجب اختيار يوم المجموعة" });
  }

  // groupTime
  if (!isString(body.groupTime) || body.groupTime.trim().length === 0) {
    errors.push({ field: "groupTime", message: "يجب اختيار وقت المجموعة" });
  }

  return errors;
}

/* ── POST /api/bookings ── */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationErrors = validatePayload(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { ok: false, errors: validationErrors },
        { status: 422 }
      );
    }

    // After validation, these are guaranteed to be strings
    const v = body as Record<string, string>;

    const [inserted] = await db
      .insert(bookings)
      .values({
        studentName: v.studentName.trim(),
        studentPhone: v.studentPhone.replace(/\s/g, ""),
        parentPhone: v.parentPhone.replace(/\s/g, ""),
        gender: v.gender,
        grade: v.grade,
        groupDay: v.groupDay,
        groupTime: v.groupTime,
        submittedAt: v.submittedAt,
      })
      .returning({ id: bookings.id });

    return NextResponse.json(
      { ok: true, id: inserted.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save booking:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
