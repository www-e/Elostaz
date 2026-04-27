import type { Metadata } from "next";
import {
  Superscript,
  Infinity,
  Scale,
  Atom,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";
import { SubjectCard } from "@/components/shared/subject-card";

export const metadata: Metadata = {
  title: "الصف الثالث الثانوي - أ/ أشرف حسن",
  description: "دروس الصف الثالث الثانوي في الرياضيات مع أ/ أشرف حسن",
};

const sections = [
  {
    title: "الرياضيات البحتة",
    subjects: [
      {
        title: "جبر و هندسة فراغية",
        description: "الجبر والهندسة الفراغية المتقدمة",
        icon: <Superscript className="size-8" />,
        href: "https://drive.google.com/drive/u/3/folders/1kAz0EbiMwXbtwaIebFgwqiwJlBL7jO_V",
      },
      {
        title: "تفاضل و تكامل",
        description: "التفاضل والتكامل وتطبيقاته",
        icon: <Infinity className="size-8" />,
        href: "https://drive.google.com/drive/u/3/folders/1sW7xa6nrqu6zulOwEuxv4VhDHVeSEwxR",
      },
    ],
  },
  {
    title: "الرياضيات التطبيقية",
    subjects: [
      {
        title: "استاتيكا",
        description: "ميكانيكا الجسم الصلب",
        icon: <Scale className="size-8" />,
        href: "https://drive.google.com/drive/u/3/folders/1qHA4dE7D3C7YxMtS-XqGzCk4dT_yIaus",
      },
      {
        title: "ديناميكا",
        description: "حركة الأجسام والقوى",
        icon: <Atom className="size-8" />,
        href: "https://drive.google.com/drive/u/3/folders/1-y6DRvKUL2HPIKKHauJaStUmapcOuEcR",
      },
    ],
  },
  {
    title: "إضافات",
    subjects: [
      {
        title: "واجب",
        description: "الواجبات والتمارين المطلوبة",
        icon: <ClipboardList className="size-8" />,
        href: "https://drive.google.com/drive/u/3/folders/1VLNF6WydRyWkML-YHVDtSHvSKu8iLWuz",
      },
      {
        title: "المراجعات النهائية",
        description: "مراجعات شاملة للامتحانات",
        icon: <GraduationCap className="size-8" />,
        href: "https://drive.google.com/drive/u/3/folders/1RdNJ9GITYbOyZf7TcYMOYpS3EkcaCH56",
      },
    ],
  },
];

export default function Grade3Page() {
  return (
    <div className="min-h-full flex flex-col">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl space-y-16">
          <FadeIn>
            <SectionHeader
              title="الصف الثالث الثانوي"
              subtitle="اختر المادة التي تريد دراستها"
            />
          </FadeIn>

          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <FadeIn>
                <h2 className="text-2xl font-bold text-foreground text-center">
                  {section.title}
                </h2>
                <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-3" />
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {section.subjects.map((subject, index) => (
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
          ))}
        </div>
      </section>
    </div>
  );
}
