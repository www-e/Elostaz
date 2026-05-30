/* ── Domain types for the New Year booking system ── */

export type Gender = "ذكر" | "أنثى";

export type GradeValue = "10" | "11" | "12";

export interface BookingData {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  gender: Gender;
  grade: GradeValue;
  groupDay: string;
  groupTime: string;
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
}
