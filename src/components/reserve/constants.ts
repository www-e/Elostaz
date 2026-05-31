import type { GradeConfig, GradeValue, SelectOption } from "./types";

/* ── Storage ── */
export const STORAGE_KEY = "lastBookingSubmission";

/* ── Teacher contact info ── */
export const TEACHER_WHATSAPP = "201227278084";
export const VODAFONE_CASH_NUMBER = "01062739292";

/* ── Key dates ── */
export const RESERVATION_OPEN_DATE = "20/6"; // reservations start

/* ── Per-grade configuration — single source of truth ── */

export const GRADE_CONFIG: Record<GradeValue, GradeConfig> = {
  /* الصف الأول الثانوي */
  "10": {
    value: "10",
    label: "الصف الأول الثانوي",
    price: 260,
    startDate: "15/8",
    days: {
      "سبت وثلاثاء": ["3:00 م", "4:00 م"],
      "حد واربعاء": ["3:00 م"],
    },
  },

  /* الصف الثاني الثانوي بكالوريا */
  "11-bac": {
    value: "11-bac",
    label: "الصف الثاني الثانوي (بكالوريا)",
    price: 300,
    startDate: "15/8",
    days: {
      "حد واربعاء": ["4:00 م"],
    },
  },

  /* الصف الثاني الثانوي عام */
  "11-general": {
    value: "11-general",
    label: "الصف الثاني الثانوي (عام)",
    price: 300,
    startDate: "15/8",
    days: {
      "حد واربعاء": ["5:00 م"],
    },
  },

  /* الصف الثالث الثانوي علمي رياضة */
  "12-science": {
    value: "12-science",
    label: "الصف الثالث الثانوي (علمي رياضة)",
    price: 425,
    startDate: "1/8",
    days: {
      "سبت وثلاثاء": ["12:00 م"],
      "حد واربعاء": ["12:00 م"],
      "الخميس": ["12:00 م", "1:30 م"],
    },
  },

  /* الصف الثالث الثانوي ادبي احصاء */
  "12-literary": {
    value: "12-literary",
    label: "الصف الثالث الثانوي (ادبي احصاء)",
    price: 350,
    startDate: "1/8",
    days: {
      "سبت وثلاثاء": ["1:30 م"],
      "حد واربعاء": ["1:30 م"],
    },
  },
};

/* ── Derived data ── */

/** All 5 grade options for dropdown */
export const GRADE_OPTIONS: SelectOption[] = Object.values(GRADE_CONFIG).map(
  (g) => ({
    value: g.value,
    label: g.label,
    sublabel: `${g.price} ج.م`,
  })
);

/** Reverse lookup: grade value → Arabic label */
export const GRADE_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(GRADE_CONFIG).map((g) => [g.value, g.label])
);

/** Reverse lookup: grade value → price */
export const GRADE_PRICES: Record<string, number> = Object.fromEntries(
  Object.values(GRADE_CONFIG).map((g) => [g.value, g.price])
);

/* ── Grade helpers ── */

/** Get available day-pairs for a given grade */
export function getGradeDays(grade: string): SelectOption[] {
  const config = GRADE_CONFIG[grade as GradeValue];
  if (!config) return [];
  return Object.keys(config.days).map((day) => ({
    value: day,
    label: day,
  }));
}

/** Get available time slots for a given grade + day-pair */
export function getGradeTimes(grade: string, day: string): SelectOption[] {
  const config = GRADE_CONFIG[grade as GradeValue];
  if (!config) return [];
  const times = config.days[day];
  if (!times) return [];
  return times.map((t) => ({ value: t, label: t }));
}

/** Get the price for a grade */
export function getGradePrice(grade: string): number {
  return GRADE_PRICES[grade] ?? 0;
}

/* ── WhatsApp message template ── */
export function buildWhatsAppLink(
  studentName: string | undefined,
  grade?: string
): string {
  const price = grade ? getGradePrice(grade) : 0;
  const text = [
    "السلام عليكم ورحمة الله وبركاته",
    "",
    "أستاذ أشرف حسن،",
    `أنا ${studentName ?? "الطالب"}،`,
    price > 0
      ? `أود دفع رسوم الاشتراق في مادة الرياضيات للسنة الجديدة بقيمة ${price} ج.م عبر فودافون كاش.`
      : "أود دفع رسوم الاشتراك في مادة الرياضيات للسنة الجديدة عبر فودافون كاش.",
    "",
    `رقم الدفع: ${VODAFONE_CASH_NUMBER}`,
    "جزاك الله خيراً",
  ].join("\n");
  return `https://wa.me/${TEACHER_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
