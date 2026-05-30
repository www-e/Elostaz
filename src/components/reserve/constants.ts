import type { SelectOption } from "./types";

/* ── Storage ── */
export const STORAGE_KEY = "lastBookingSubmission";

/* ── Teacher contact info (from codebase contact-section.tsx) ── */
export const TEACHER_WHATSAPP = "201227278084";
export const VODAFONE_CASH_NUMBER = "01062739292";

/* ── Form options ── */

export const GRADE_OPTIONS: SelectOption[] = [
  { value: "10", label: "الصف الأول الثانوي" },
  { value: "11", label: "الصف الثاني الثانوي" },
  { value: "12", label: "الصف الثالث الثانوي" },
];

export const GROUP_DAY_OPTIONS: SelectOption[] = [
  { value: "سبت وثلاثاء", label: "سبت وثلاثاء" },
  { value: "حد واربعاء", label: "حد واربعاء" },
  { value: "اتنين وخميس", label: "اتنين وخميس" },
];

/** Maps a group day to its available time slots. */
export const GROUP_TIMES: Record<string, string[]> = {
  "سبت وثلاثاء": ["3:00 م", "4:00 م", "5:00 م"],
  "حد واربعاء": ["3:30 م", "4:30 م"],
  "اتنين وخميس": ["4:00 م", "5:30 م"],
};

/** Reverse lookup: numeric grade value → Arabic label */
export const GRADE_LABELS: Record<string, string> = {
  "10": "الصف الأول الثانوي",
  "11": "الصف الثاني الثانوي",
  "12": "الصف الثالث الثانوي",
};

/* ── WhatsApp message template ── */
export function buildWhatsAppLink(
  studentName: string | undefined
): string {
  const text = [
    "السلام عليكم ورحمة الله وبركاته",
    "",
    "أستاذ أشرف حسن،",
    `أنا ${studentName ?? "الطالب"}،`,
    "أود دفع رسوم الاشتراك في مادة الرياضيات للسنة الجديدة عبر فودافون كاش.",
    "",
    `رقم الدفع: ${VODAFONE_CASH_NUMBER}`,
    "جزاك الله خيراً",
  ].join("\n");
  return `https://wa.me/${TEACHER_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
