import type { Metadata } from "next";
import { Book, ClipboardList, GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";
import { SubjectCard } from "@/components/shared/subject-card";

export const metadata: Metadata = {
  title: "الصف الأول الثانوي - أ/ أشرف حسن",
  description: "دروس الصف الأول الثانوي في الرياضيات مع أ/ أشرف حسن",
};

const subjects = [
  {
    title: "عام",
    description: "دروس وشروحات المنهج العام",
    icon: <Book className="size-8" />,
    href: "https://drive.google.com/drive/u/3/folders/1SOd2orxiMdZndD9Z142t1fh60BDT-Oda",
  },
  {
    title: "واجب",
    description: "الواجبات والتمارين المطلوبة",
    icon: <ClipboardList className="size-8" />,
    href: "https://drive.google.com/drive/u/3/folders/1Bbi3b5QcQkyEMIRzLTum2JC4OTnlSmrX",
  },
  {
    title: "المراجعات النهائية",
    description: "مراجعات شاملة للامتحانات",
    icon: <GraduationCap className="size-8" />,
    href: "https://drive.google.com/drive/u/3/folders/1eKZQoD5jIY7k4IRlh5ypotxHqaa-Evs3",
  },
];

export default function Grade1Page() {
  return (
    <div className="min-h-full flex flex-col">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <SectionHeader
              title="الصف الأول الثانوي"
              subtitle="اختر المادة التي تريد دراستها"
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
