import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  ClipboardCheck,
  QrCode,
  Contact,
  Users,
  MessageCircle,
  Calculator,
  BookOpen,
  GraduationCap,
  Star,
  Clock,
  Award,
  ChevronRight,
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
    subtitle: "أساسيات الرياضيات والجبر والهندسة",
    link: "/grades/grade1/",
    lessons: 12,
    hours: 36,
    tests: 24,
    students: 340,
    progress: 75,
    rating: 4.8,
    difficulty: "متوسط",
    color: "blue",
    icon: Calculator,
    topics: [
      "الجبر والمعادلات",
      "الهندسة التحليلية",
      "حساب المثلثات",
      "الدوال والرسوم البيانية",
      "الإحصاء والاحتمالات",
      "التفاضل المبدئي",
      "التكامل المبدئي",
      "الهندسة الوصفية",
    ],
  },
  {
    title: "الصف الثاني الثانوي",
    subtitle: "تفاضل، تكامل، إحصاء وهندسة فراغية",
    link: "/grades/grade2/",
    lessons: 14,
    hours: 42,
    tests: 28,
    students: 280,
    progress: 85,
    rating: 4.9,
    difficulty: "صعب",
    color: "purple",
    icon: BookOpen,
    topics: [
      "التفاضل والتكامل",
      "الاحتمالات والإحصاء",
      "الهندسة الفراغية",
      "المتتاليات والمتسلسلات",
      "الدوال الأسية واللوغاريتمية",
      "الهندسة التحليلية المتقدمة",
      "المعادلات التفاضلية",
      "الإحصاء التطبيقي",
    ],
  },
  {
    title: "الصف الثالث الثانوي",
    subtitle: "رياضيات متقدمة للثانوية العامة",
    link: "/grades/grade3/",
    lessons: 16,
    hours: 48,
    tests: 32,
    students: 420,
    progress: 90,
    rating: 5.0,
    difficulty: "متقدم",
    color: "emerald",
    icon: GraduationCap,
    topics: [
      "التفاضل والتكامل المتقدم",
      "المصفوفات والمحددات",
      "التحليل الرياضي",
      "الهندسة التفاضلية",
      "الإحصاء الرياضي",
      "الدوال المعقدة",
      "الرياضيات المالية",
      "النمذجة الرياضية",
    ],
  },
];

const gradeStyles = {
  blue: {
    border: "border-t-blue-500",
    iconBg:
      "bg-blue-50 dark:bg-blue-950/40",
    iconText:
      "text-blue-600 dark:text-blue-400",
    gradient:
      "bg-gradient-to-l from-blue-500 to-cyan-400 dark:from-blue-400 dark:to-cyan-300",
    badgeBg:
      "bg-blue-50 dark:bg-blue-950/40",
    badgeText:
      "text-blue-700 dark:text-blue-300",
    badgeRing:
      "ring-blue-200 dark:ring-blue-800",
    btn: "bg-blue-600 hover:bg-blue-700",
    progressText:
      "text-blue-600 dark:text-blue-400",
    topBar: "bg-blue-500",
  },
  purple: {
    border: "border-t-purple-500",
    iconBg:
      "bg-purple-50 dark:bg-purple-950/40",
    iconText:
      "text-purple-600 dark:text-purple-400",
    gradient:
      "bg-gradient-to-l from-purple-500 to-fuchsia-400 dark:from-purple-400 dark:to-fuchsia-300",
    badgeBg:
      "bg-purple-50 dark:bg-purple-950/40",
    badgeText:
      "text-purple-700 dark:text-purple-300",
    badgeRing:
      "ring-purple-200 dark:ring-purple-800",
    btn: "bg-purple-600 hover:bg-purple-700",
    progressText:
      "text-purple-600 dark:text-purple-400",
    topBar: "bg-purple-500",
  },
  emerald: {
    border: "border-t-emerald-500",
    iconBg:
      "bg-emerald-50 dark:bg-emerald-950/40",
    iconText:
      "text-emerald-600 dark:text-emerald-400",
    gradient:
      "bg-gradient-to-l from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300",
    badgeBg:
      "bg-emerald-50 dark:bg-emerald-950/40",
    badgeText:
      "text-emerald-700 dark:text-emerald-300",
    badgeRing:
      "ring-emerald-200 dark:ring-emerald-800",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    progressText:
      "text-emerald-600 dark:text-emerald-400",
    topBar: "bg-emerald-500",
  },
};

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
                <li className="flex items-center gap-3">
                  <span>بطاقة هوية رقمية للطالب</span>
                  <Contact className="size-5 text-primary shrink-0" />
                </li>
                <li className="flex items-center gap-3">
                  <span>رمز QR للوصول السريع للبيانات</span>
                  <QrCode className="size-5 text-primary shrink-0" />
                </li>
                <li className="flex items-center gap-3">
                  <span>تتبع الحضور والغياب تلقائياً</span>
                  <Calendar className="size-5 text-primary shrink-0" />
                </li>
                <li className="flex items-center gap-3">
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
                  <div className="bg-[#dcf8c6] dark:bg-green-900/30 p-3 rounded-lg rounded-tr-none max-w-[85%] ml-auto">
                    <p className="text-sm">
                      أهلاً بك! تم تسجيل حضورك اليوم بنجاح ✅
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      10:30 ص
                    </span>
                  </div>
                  <div className="bg-[#dcf8c6] dark:bg-green-900/30 p-3 rounded-lg rounded-tr-none max-w-[85%] ml-auto">
                    <p className="text-sm">
                      تذكر: غداً اختبار على الوحدة الثانية 📚
                    </p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">
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
      <section id="courses" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="الصفوف الدراسية" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const styles =
                gradeStyles[course.color as keyof typeof gradeStyles];
              const Icon = course.icon;
              return (
                <StaggerItem key={course.title}>
                  <Card
                    className={cn(
                      "group h-full flex flex-col overflow-hidden border-t-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
                      styles.border
                    )}
                  >
                    {/* Icon Header */}
                    <div
                      className={cn(
                        "relative h-28 flex items-center justify-center",
                        styles.iconBg
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-14 transition-transform duration-300 group-hover:scale-110",
                          styles.iconText
                        )}
                      />
                      <div
                        className={cn(
                          "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm",
                          styles.topBar
                        )}
                      >
                        {course.difficulty}
                      </div>
                    </div>

                    <CardHeader className="pb-2 pt-5">
                      <CardTitle className="text-2xl font-bold text-right">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-right text-base leading-relaxed">
                        {course.subtitle}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-5">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/40">
                          <div className="text-right">
                            <p className="font-bold text-lg leading-none">
                              {course.lessons}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              درس
                            </p>
                          </div>
                          <BookOpen
                            className={cn("size-5", styles.iconText)}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/40">
                          <div className="text-right">
                            <p className="font-bold text-lg leading-none">
                              {course.hours}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              ساعة
                            </p>
                          </div>
                          <Clock
                            className={cn("size-5", styles.iconText)}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/40">
                          <div className="text-right">
                            <p className="font-bold text-lg leading-none">
                              {course.tests}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              اختبار
                            </p>
                          </div>
                          <ClipboardCheck
                            className={cn("size-5", styles.iconText)}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/40">
                          <div className="text-right">
                            <p className="font-bold text-lg leading-none">
                              {course.students}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              طالب
                            </p>
                          </div>
                          <Users
                            className={cn("size-5", styles.iconText)}
                          />
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-muted-foreground">التقدم</span>
                          <span
                            className={cn("font-bold", styles.progressText)}
                          >
                            {course.progress}%
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              styles.gradient
                            )}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Topics as badges */}
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic) => (
                          <span
                            key={topic}
                            className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset",
                              styles.badgeBg,
                              styles.badgeText,
                              styles.badgeRing
                            )}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Rating & Difficulty */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold">
                            {course.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Award
                            className={cn("size-4", styles.iconText)}
                          />
                          <span>{course.difficulty}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-2">
                        <Link
                          href={course.link}
                          className={cn(
                            buttonVariants({ variant: "default" }),
                            "w-full gap-2 group/btn",
                            styles.btn
                          )}
                        >
                          استكشف المنهج
                          <ChevronRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
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
