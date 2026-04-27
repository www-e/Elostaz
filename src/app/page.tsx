import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle,
  Calendar,
  ClipboardCheck,
  QrCode,
  Contact,
  Users,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { SectionHeader } from "@/components/shared/section-header";
import { ContactSection } from "@/components/shared/contact-section";
import { FlipCard } from "@/components/home/flip-card";
import { HeroSection } from "@/components/home/hero-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { StatsBanner } from "@/components/home/stats-banner";
import { TestimonialsMarquee } from "@/components/home/testimonials-marquee";
import { FAQSection } from "@/components/home/faq-section";

const books = [
  {
    src: "/assets/images-optimized/front1.webp",
    title: "الصف الأول الثانوي - الرياضيات عام",
  },
  {
    src: "/assets/images-optimized/front2.webp",
    title: "الصف الثاني الثانوي - الرياضيات التطبيقية",
  },
  {
    src: "/assets/images-optimized/front3.webp",
    title: "الصف الثاني الثانوي - الرياضيات البحتة",
  },
  {
    src: "/assets/images-optimized/front4.webp",
    title: "الصف الثالث الثانوي",
  },
];

const courses = [
  {
    title: "الصف الأول الثانوي",
    link: "/grades/grade1/",
    lessons: 12,
    hours: 36,
    tests: 24,
    progress: 75,
    topics: ["الجبر والمعادلات", "الهندسة التحليلية", "حساب المثلثات"],
  },
  {
    title: "الصف الثاني الثانوي",
    link: "/grades/grade2/",
    lessons: 14,
    hours: 42,
    tests: 28,
    progress: 85,
    topics: ["التفاضل والتكامل", "الاحتمالات والإحصاء", "الهندسة الفراغية"],
  },
  {
    title: "الصف الثالث الثانوي",
    link: "/grades/grade3/",
    lessons: 16,
    hours: 48,
    tests: 32,
    progress: 90,
    topics: [
      "التفاضل والتكامل المتقدم",
      "المصفوفات والمحددات",
      "التحليل الرياضي",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Why Choose Us (Bento Grid) */}
      <FadeIn>
        <WhyChooseUs />
      </FadeIn>

      {/* 3. Smart Card Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="text-right">
              <h2 className="text-3xl font-bold font-heading mb-4">
                بطاقة الطالب الذكية
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                نظام متكامل لإدارة بيانات الطلاب ومتابعة تقدمهم الدراسي بسهولة
                وفعالية.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 justify-end">
                  <span>بطاقة هوية رقمية للطالب</span>
                  <Contact className="size-5 text-primary shrink-0" />
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <span>رمز QR للوصول السريع للبيانات</span>
                  <QrCode className="size-5 text-primary shrink-0" />
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <span>تتبع الحضور والغياب تلقائياً</span>
                  <Calendar className="size-5 text-primary shrink-0" />
                </li>
                <li className="flex items-center gap-3 justify-end">
                  <span>متابعة التقدم الدراسي والدرجات</span>
                  <TrendingUp className="size-5 text-primary shrink-0" />
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <FlipCard
              frontImage="/assets/images-optimized/card-front.webp"
              backImage="/assets/images-optimized/card-back.webp"
              alt="بطاقة الطالب الذكية"
            />
          </FadeIn>
        </div>
      </section>

      {/* 4. Attendance System Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="flex justify-center">
              <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-6 max-w-sm w-full ring-1 ring-border">
                <div className="flex items-center gap-3 mb-4 border-b pb-3 border-border">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">واتساب</p>
                    <p className="text-xs text-muted-foreground">
                      أ/ أشرف حسن
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#dcf8c6] dark:bg-green-900/30 p-3 rounded-lg rounded-tr-none max-w-[85%] mr-auto ml-0">
                    <p className="text-sm">
                      أهلاً بك! تم تسجيل حضورك اليوم بنجاح ✅
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1 block text-left">
                      10:30 ص
                    </span>
                  </div>
                  <div className="bg-[#dcf8c6] dark:bg-green-900/30 p-3 rounded-lg rounded-tr-none max-w-[85%] mr-auto ml-0">
                    <p className="text-sm">
                      تذكر: غداً اختبار على الوحدة الثانية 📚
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1 block text-left">
                      10:31 ص
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="text-right">
              <h2 className="text-3xl font-bold font-heading mb-6">
                نظام الحضور الذكي
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="size-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">الحضور</p>
                    <p className="text-sm text-muted-foreground">
                      تتبع يومي دقيق
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Calendar className="size-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">الاشتراك</p>
                    <p className="text-sm text-muted-foreground">
                      تجديد تلقائي
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <ClipboardCheck className="size-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">الواجبات</p>
                    <p className="text-sm text-muted-foreground">
                      متابعة مستمرة
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. Books Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="الكتب والمذكرات" />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <StaggerItem key={book.title}>
                <div className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg ring-1 ring-border cursor-pointer">
                  <Image
                    src={book.src}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                    <h3 className="text-white font-bold text-lg">
                      {book.title}
                    </h3>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. Courses Section */}
      <section id="courses" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="الصفوف الدراسية" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <StaggerItem key={course.title}>
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>
                      {course.lessons} درس | {course.hours} ساعة |{" "}
                      {course.tests} اختبار
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>التقدم</span>
                        <span className="font-bold text-primary">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {course.topics.map((topic) => (
                        <li
                          key={topic}
                          className="flex items-center gap-2 text-sm justify-end"
                        >
                          <span>{topic}</span>
                          <CheckCircle className="size-4 text-primary shrink-0" />
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={course.link}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full mt-2"
                      )}
                    >
                      استكشف المنهج
                    </Link>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 7. Stats Banner */}
      <StatsBanner />

      {/* 8. Testimonials Marquee */}
      <TestimonialsMarquee />

      {/* 9. FAQ Section */}
      <FAQSection />

      {/* 10. Contact Section */}
      <section id="contact">
        <FadeIn>
          <ContactSection />
        </FadeIn>
      </section>
    </div>
  );
}
