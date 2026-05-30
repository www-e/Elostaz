import type { Metadata } from "next";
import { BookingForm } from "@/components/reserve/booking-form";

export const metadata: Metadata = {
  title: "حجز السنة الجديدة",
  description:
    "حجز السنة الجديدة في مادة الرياضيات للمرحلة الثانوية مع الأستاذ أشرف حسن. الصف الأول والثاني والثالث الثانوي - بنها، القليوبية.",
  alternates: {
    canonical: "https://www.alostaz.com/reserve",
  },
  openGraph: {
    title: "حجز السنة الجديدة | أ/ أشرف حسن",
    description:
      "حجز السنة الجديدة في مادة الرياضيات للمرحلة الثانوية مع الأستاذ أشرف حسن.",
    url: "https://www.alostaz.com/reserve",
  },
};

export default function ReservePage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <BookingForm />
    </main>
  );
}
