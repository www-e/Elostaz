import Image from "next/image";
import Link from "next/link";
import {
  Brain,
  Users,
  TrendingUp,
  CheckCircle,
  BookOpen,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/stagger-container";
import { SectionHeader } from "@/components/shared/section-header";
import { ContactSection } from "@/components/shared/contact-section";
import { AnimatedCounter } from "@/components/about/animated-counter";
import { RegistrationDialog } from "@/components/about/registration-dialog";
import { CollaborationsFilter } from "@/components/about/collaborations-filter";

const timeline = [
  { year: "2018", title: "بداية التدريس عبر الإنترنت" },
  { year: "2019", title: "التوسع في مواد متعددة" },
  { year: "2020", title: "التعاون مع أول مركز مصري" },
  { year: "2021", title: "شراكات تطوير المناهج" },
  { year: "2022", title: "التعاون في الكتب المدرسية الرسمية" },
  { year: "2023", title: "أكثر من 1000 طالب" },
  { year: "الآن", title: "أكثر من 6 سنوات من التميز التعليمي" },
];

const stats = [
  { target: 6, suffix: "+", label: "سنوات التدريس عبر الإنترنت" },
  { target: 1000, suffix: "+", label: "طالب تم تدريسهم" },
  { target: 50, suffix: "+", label: "مركز عبر مصر" },
  { target: 10, suffix: "+", label: "تعاون في المناهج" },
];

const curriculum = [
  {
    title: "سلسلة كتب الرياضيات العربية",
    role: "مساهم ومراجع",
  },
  {
    title: "تطوير منهج STEM",
    role: "مصمم المناهج",
  },
  {
    title: "منصة التعلم الإلكتروني للرياضيات",
    role: "منشئ المحتوى",
  },
];

const methodologies = [
  {
    title: "التميز في التدريس عبر الإنترنت",
    features: [
      "فصول تفاعلية مباشرة",
      "مواد مسجلة عالية الجودة",
      "دعم فني مستمر",
    ],
  },
  {
    title: "التدريس الشخصي في المراكز",
    features: [
      "متابعة فردية لكل طالب",
      "جلسات استشارية",
      "تقييم دوري",
    ],
  },
  {
    title: "نهج يركز على الطالب",
    features: ["تعلم ذاتي", "تعاون جماعي", "حل المشكلات"],
  },
];

const philosophy = [
  {
    title: "التفكير النقدي",
    description:
      "تنمية مهارات التحليل والاستنتاج لدى الطلاب لبناء عقول فذة.",
    icon: Brain,
  },
  {
    title: "التعلم التفاعلي",
    description:
      "تفاعل مستمر بين المدرس والطلاب لتحقيق أفضل النتائج الدراسية.",
    icon: Users,
  },
  {
    title: "التطور المستمر",
    description:
      "تحديث المناهج والأساليب باستمرار لمواكبة أحدث التطورات العلمية.",
    icon: TrendingUp,
  },
];

const testimonials = [
  {
    text: "أسلوب شرح ممتاز وبسيط، ساعدني كثيراً في فهم المواضيع الصعبة",
    name: "أحمد شعبان",
    detail: "الأول علي الثانوية العامة 2021",
  },
  {
    text: "من أفضل المدرسين اللي درست معاهم، شرح واضح وأمثلة كثيرة",
    name: "عمر محمد",
    detail: "اوائل الثانوية العامة 2020",
  },
  {
    text: "الشرح منظم وسهل الفهم، والواجبات المنزلية مفيدة جداً",
    name: "ابانوب جرجس",
    detail: "اوائل الثانوية العامة 2024",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <FadeIn className="text-right">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-foreground">
              الأستاذ
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              مدرس رياضيات للمرحلة الثانوية بخبرة أكثر من ٣٠ عاماً
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-end">
              <RegistrationDialog buttonText="احجز حصة خاصة" />
              <a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                تواصل عبر واتساب
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="relative flex justify-center">
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden ring-4 ring-primary/20 shadow-2xl">
                <Image
                  src="/assets/images-optimized/profile-placeholder.webp"
                  alt="أ/ أشرف حسن"
                  width={400}
                  height={400}
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="رحلتنا" />
          <div className="relative">
            <div className="absolute right-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
            <StaggerContainer className="space-y-8 relative">
              {timeline.map((item, index) => (
                <StaggerItem key={item.year}>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    {index % 2 === 0 ? (
                      <>
                        <div className="text-right md:pr-8 order-1">
                          <span className="text-primary font-bold text-xl block">
                            {item.year}
                          </span>
                          <p className="font-semibold">{item.title}</p>
                        </div>
                        <div className="relative flex justify-center order-first md:order-none my-2 md:my-0">
                          <div className="w-3 h-3 bg-primary rounded-full ring-4 ring-background" />
                        </div>
                        <div className="hidden md:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" />
                        <div className="relative flex justify-center order-first md:order-none my-2 md:my-0">
                          <div className="w-3 h-3 bg-primary rounded-full ring-4 ring-background" />
                        </div>
                        <div className="text-right md:text-left md:pl-8 order-1">
                          <span className="text-primary font-bold text-xl block">
                            {item.year}
                          </span>
                          <p className="font-semibold">{item.title}</p>
                        </div>
                      </>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="أرقامنا" />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. Collaborations Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="مراكز التعاون" />
          <CollaborationsFilter />
        </div>
      </section>

      {/* 5. Curriculum Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="المناهج والمشاركات" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curriculum.map((item) => (
              <StaggerItem key={item.title}>
                <Card className="h-full">
                  <CardHeader>
                    <BookOpen className="size-8 text-primary mb-2" />
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.role}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. Methodology Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="منهجيتنا" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methodologies.map((item) => (
              <StaggerItem key={item.title}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm justify-end"
                        >
                          <span>{feature}</span>
                          <CheckCircle className="size-4 text-primary shrink-0" />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 7. Philosophy Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="فلسفتنا" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophy.map((item) => (
              <StaggerItem key={item.title}>
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <item.icon className="size-10 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="آراء الطلاب" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <Card className="h-full">
                  <CardContent className="pt-6 text-right">
                    <Quote className="size-8 text-primary mb-4 rotate-180" />
                    <p className="text-lg mb-4 leading-relaxed">{t.text}</p>
                    <div className="mt-auto">
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 9. Contact Section */}
      <FadeIn>
        <ContactSection />
      </FadeIn>
    </div>
  );
}
