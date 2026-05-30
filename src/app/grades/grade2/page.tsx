import type { Metadata } from "next";
import {
  SquareRadical,
  TrendingUp,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";
import { SubjectCard } from "@/components/shared/subject-card";

export const metadata: Metadata = {
  title: "الصف الثاني الثانوي",
  description:
    "دروس الصف الثاني الثانوي في الرياضيات مع أ/ أشرف حسن. شرح التفاضل والتكامل والإحصاء والهندسة الفراغية - ثانوية عامة مصر.",
  alternates: {
    canonical: "https://www.alostaz.com/grades/grade2",
  },
  openGraph: {
    title: "الصف الثاني الثانوي - الرياضيات",
    description:
      "دروس الصف الثاني الثانوي في الرياضيات مع أ/ أشرف حسن.",
    url: "https://www.alostaz.com/grades/grade2",
  },
};

const subjects = [
  {
    title: "بحتة",
    description: "الرياضيات البحتة والجبر والهندسة",
    icon: <SquareRadical className="size-8" />,
    href: "https://drive.google.com/drive/u/3/folders/1T3wIaq3n140fSC_nwAo1r7Y0kgA6MpK4",
  },
  {
    title: "تطبيقية",
    description: "الرياضيات التطبيقية والإحصاء",
    icon: <TrendingUp className="size-8" />,
    href: "https://drive.google.com/drive/u/3/folders/1-9jl4l5BT8v0Pi_-ihaP1Wah5o0RW-Mw",
  },
  {
    title: "واجب",
    description: "الواجبات والتمارين المطلوبة",
    icon: <ClipboardList className="size-8" />,
    href: "https://drive.google.com/drive/u/3/folders/1M15HPrEPRovzyIW9yBxbPI0T4fBmGosa",
  },
  {
    title: "المراجعات النهائية",
    description: "مراجعات شاملة للامتحانات",
    icon: <GraduationCap className="size-8" />,
    href: "https://drive.google.com/drive/u/3/folders/1KpVUFpfFQVpTNxhZqPNM7Os-0G-N9YeN",
  },
];

export default function Grade2Page() {
  return (
    <div className="min-h-full flex flex-col">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <SectionHeader
              title="الصف الثاني الثانوي"
              subtitle="اختر المادة التي تريد دراستها"
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject.title}
                title={subject.title}
                description={subject.description}
                icon={subject.icon}
                href={subject.href}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
