"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Phone, ArrowLeft, Sigma, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/shared/section-header";
import { ExamRevisionPoster, type PosterType } from "./exam-revision-poster";

const revisionData = [
  {
    id: "math" as PosterType,
    subject: "الرياضيات",
    section: "للقسم العلمي",
    icon: BookOpen,
    gradient: "from-violet-600 to-indigo-600",
    shadowColor: "shadow-violet-500/20",
    borderColor: "border-violet-200 dark:border-violet-800",
    hoverBg: "hover:bg-violet-50 dark:hover:bg-violet-950/30",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    features: [
      "مراجعة شاملة على المنهج",
      "حل نماذج الامتحانات السابقة",
      "تقنيات الحل السريع",
      "مذكرة شرح حصرية",
    ],
  },
  {
    id: "statistics" as PosterType,
    subject: "الإحصاء",
    section: "للقسم الأدبي والأزهر",
    icon: Sigma,
    gradient: "from-emerald-600 to-teal-600",
    shadowColor: "shadow-emerald-500/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    features: [
      "مراجعة شاملة على المنهج",
      "حل نماذج الامتحانات السابقة",
      "تلخيص القوانين والمفاهيم",
      "تدريبات مكثفة على المسائل",
    ],
  },
];

export function ExamRevisionSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-violet-50/30 dark:via-violet-950/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-l from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 mb-4">
              2026
            </span>
            <SectionHeader
              title="حجز مراجعة ليالي الامتحان"
              subtitle="استعد لامتحانات الثانوية العامة مع نخبة من أفضل المدرسين"
            />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {revisionData.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.15}>
              <Card
                className={cn(
                  "group relative overflow-hidden border-2 transition-all duration-500 hover:-translate-y-1",
                  item.borderColor,
                  item.shadowColor,
                  "shadow-md hover:shadow-xl"
                )}
              >
                {/* Top gradient accent bar */}
                <div className={cn("h-1.5 w-full bg-gradient-to-l", item.gradient)} />

                <CardContent className="p-5 md:p-8">
                  <div className="flex items-start gap-4 mb-5">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center size-14 rounded-2xl shrink-0",
                        item.iconBg,
                        item.iconColor
                      )}
                    >
                      <item.icon className="size-7" />
                    </div>

                    <div className="text-right flex-1">
                      <h3 className="text-2xl md:text-3xl font-extrabold font-heading mb-1">
                        {item.subject}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {item.section}
                      </p>
                    </div>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2.5 mb-6">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <span className="flex-shrink-0">
                          <svg
                            className={cn(
                              "size-4",
                              item.id === "math"
                                ? "text-violet-500"
                                : "text-emerald-500"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gradient-to-l from-border to-transparent" />
                    <span className="text-xs text-muted-foreground">✦</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                  </div>

                  {/* Contact */}
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground text-center">
                      للتواصل والحجز
                    </p>

                    {/* Phone */}
                    <a
                      href="tel:+201227278084"
                      className="flex items-center justify-center gap-2 text-lg font-bold tracking-wide text-foreground hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      <Phone className="size-5 text-primary" />
                      01227278084
                    </a>

                    {/* WhatsApp CTA */}
                    <Link
                      href={`https://wa.me/+201227278084?text=${encodeURIComponent(
                        `السلام عليكم، أنا أريد حجز مراجعة ليالي الامتحان في مادة ${item.subject} للثانوية العامة 2026`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl",
                        item.id === "math"
                          ? "bg-gradient-to-l from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-500/25"
                          : "bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25"
                      )}
                    >
                      <MessageCircle className="size-5" />
                      احجز الآن عبر واتساب
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              عدد المقاعد محدود - سارع بالحجز لضمان مكانك
            </p>
            <a
              href="tel:+201227278084"
              className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
            >
              اتصل الآن
              <ArrowLeft className="size-4" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
