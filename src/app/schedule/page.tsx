import type { Metadata } from "next";
import {
  Video,
  GraduationCap,
  CheckCircle,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer } from "@/components/motion/stagger-container";
import { SectionHeader } from "@/components/shared/section-header";
import { ContactSection } from "@/components/shared/contact-section";
import { DownloadCard } from "@/components/shared/download-card";

export const metadata: Metadata = {
  title: "حجز المواعيد",
  description:
    "احجز موعدك للدروس الخصوصية أونلاين أو في المركز مع أ/ أشرف حسن. دروس رياضيات للمرحلة الثانوية في بنها والقليوبية.",
  alternates: {
    canonical: "https://www.alostaz.com/schedule",
  },
  openGraph: {
    title: "حجز المواعيد | أ/ أشرف حسن",
    description:
      "احجز موعدك للدروس الخصوصية أونلاين أو في المركز مع أ/ أشرف حسن.",
    url: "https://www.alostaz.com/schedule",
  },
};

const onlineFeatures = [
  "شرح تفاعلي مباشر",
  "سبورة إلكترونية",
  "تسجيل الدروس",
  "مرونة في اختيار المواعيد",
];

const offlineFeatures = [
  "شرح مباشر وتفاعلي",
  "قاعات مجهزة",
  "مذكرات وملخصات",
  "متابعة مستمرة",
];

const onlineTimes = ["السبت", "الأحد", "الثلاثاء", "الخميس"];

const scheduleDownloads = [
  {
    title: "الصف الأول الثانوي",
    imageSrc: "/assets/images-optimized/grade1.webp",
    fileHref: "/assets/schedules/grade1.pdf",
  },
  {
    title: "الصف الثاني الثانوي",
    imageSrc: "/assets/images-optimized/grade2.webp",
    fileHref: "/assets/schedules/grade2.pdf",
  },
  {
    title: "الصف الثالث الثانوي",
    imageSrc: "/assets/images-optimized/grade3.webp",
    fileHref: "/assets/schedules/grade3.pdf",
  },
  {
    title: "جميع الصفوف",
    imageSrc: "/assets/images-optimized/all-grades.webp",
    fileHref: "/assets/schedules/all-grades.pdf",
  },
];

export default function SchedulePage() {
  return (
    <div className="min-h-full flex flex-col">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <SectionHeader
              title="حجز المواعيد"
              subtitle="احجز موعدك للدروس الخصوصية أونلاين أو في المركز"
            />
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Online Classes Card */}
            <FadeIn direction="right">
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <Badge variant="default" className="w-fit gap-1.5 mb-2">
                    <Video className="size-3.5" />
                    دروس أونلاين
                  </Badge>
                  <CardTitle>دروس أونلاين مباشرة</CardTitle>
                  <CardDescription>
                    تعلم من منزلك مع شرح تفاعلي مباشر
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <StaggerContainer className="space-y-3">
                    {onlineFeatures.map((feature) => (
                      <FadeIn
                        key={feature}
                        direction="right"
                        delay={0.05}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="size-5 text-primary shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      </FadeIn>
                    ))}
                  </StaggerContainer>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">
                      المواعيد المتاحة
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {onlineTimes.map((day) => (
                        <div
                          key={day}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted"
                        >
                          <span className="text-sm font-medium">{day}</span>
                          <span className="text-xs text-muted-foreground">
                            تم اكتمال العدد
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="https://wa.me/+201227278084"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2">احجز الآن</Button>
                  </a>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Offline Classes Card */}
            <FadeIn direction="left">
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit gap-1.5 mb-2">
                    <GraduationCap className="size-3.5" />
                    دروس في المركز
                  </Badge>
                  <CardTitle>دروس في مركزنا</CardTitle>
                  <CardDescription>
                    تعلم في قاعات مجهزة مع متابعة مستمرة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <StaggerContainer className="space-y-3">
                    {offlineFeatures.map((feature) => (
                      <FadeIn
                        key={feature}
                        direction="left"
                        delay={0.05}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="size-5 text-primary shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      </FadeIn>
                    ))}
                  </StaggerContainer>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">
                      تحميل الجداول
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {scheduleDownloads.map((download, index) => (
                        <FadeIn
                          key={download.title}
                          delay={index * 0.1}
                        >
                          <DownloadCard
                            title={download.title}
                            imageSrc={download.imageSrc}
                            fileHref={download.fileHref}
                          />
                        </FadeIn>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <MapPin className="size-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">
                      بنها - القليوبية
                    </span>
                  </div>

                  <a
                    href="https://wa.me/+201227278084"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full gap-2">احجز الآن</Button>
                  </a>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
