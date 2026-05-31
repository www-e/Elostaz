/* ── Domain types for the New Year booking system ── */

export type Gender = "ذكر" | "أنثى";

/** 5 grade options now: 1st, 2nd بكالوريا, 2nd عام, 3rd علمي, 3rd ادبي */
export type GradeValue =
  | "10"        // الصف الأول الثانوي
  | "11-bac"    // الصف الثاني الثانوي بكالوريا
  | "11-general" // الصف الثاني الثانوي عام
  | "12-science" // الصف الثالث الثانوي علمي رياضة
  | "12-literary"; // الصف الثالث الثانوي ادبي احصاء

/** Per-grade configuration */
export interface GradeConfig {
  value: GradeValue;
  label: string;
  price: number;
  startDate: string; // e.g. "15/8"
  days: Record<string, string[]>; // day pair → time slots
}

export interface BookingData {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  gender: Gender;
  grade: GradeValue;
  groupDay: string;
  groupTime: string;
  price: number;       // price at time of booking
  submittedAt: string; // ISO-8601
  apiSaved: boolean;   // true = saved to Neon, false = localStorage only
}

export type FormFieldName =
  | "studentName"
  | "studentPhone"
  | "parentPhone"
  | "gender"
  | "grade"
  | "groupDay"
  | "groupTime";

export type FormErrors = Partial<Record<FormFieldName, string>>;

export type TouchedFields = Partial<Record<FormFieldName, boolean>>;

export type BookingFormState = {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  gender: Gender | "";
  grade: string;
  groupDay: string;
  groupTime: string;
};

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string; // optional secondary text (e.g. price)
}
