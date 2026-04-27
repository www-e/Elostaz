"use client";

import { Quote, Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const testimonials = [
  {
    quote:
      "أسلوب شرح ممتاز وبسيط، ساعدني كثيراً في فهم المواضيع الصعبة",
    name: "أحمد شعبان",
    achievement: "الأول علي الثانوية العامة 2021",
  },
  {
    quote:
      "من أفضل المدرسين اللي درست معاهم، شرح واضح وأمثلة كثيرة",
    name: "عمر محمد",
    achievement: "أوائل الثانوية العامة 2020",
  },
 {
    quote:
      "الشرح منظم وسهل الفهم، والواجبات المنزلية مفيدة جداً",
    name: "ابانوب جرجس",
    achievement: "أوائل الثانوية العامة 2024",
  },
  {
    quote:
      "مستر أشرف بجد أسهل وأفضل مدرس رياضيات درست معاه",
    name: "محمد علي",
    achievement: "الثانوية العامة 2023",
  },
  {
    quote:
      "السبورة الإلكترونية والشرح المباشر غيروا فهمي للرياضيات تماماً",
    name: "سارة أحمد",
    achievement: "الأولى على المدرسة 2022",
  },
  {
    quote:
      "شرحه ممتاز وبيشرح كل حاجة بالتفصيل، ربنا يبارك فيه",
    name: "فاطمة الزهراء",
    achievement: "الثانوية العامة 2023",
  },
  {
    quote:
      "مفيش أحسن من مستر أشرف في شرح الرياضيات، فهمت معاه كل حاجة",
    name: "يوسف محمود",
    achievement: "الأول على المدرسة 2024",
  },
  {
    quote:
      "أسلوبه في الشرح رائع وبيفهمنا بطريقة سهلة وبسيطة",
    name: "نوران حسن",
    achievement: "الثانوية العامة 2022",
  },
  {
    quote:
      "الحصص مع مستر أشرف كانت سبب نجاحي، شرح منظم وممتع",
    name: "عبدالله خالد",
    achievement: "أوائل الثانوية العامة 2023",
  },
  {
    quote:
      "مستر أشرف غير نظرتي للرياضيات خالص، بقيت أحب المادة وافهمها كويس",
    name: "مريم سعيد",
    achievement: "الثانوية العامة 2024",
  },
];

function TestimonialCard({
  quote,
  name,
  achievement,
}: {
  quote: string;
  name: string;
  achievement: string;
}) {
  return (
    <div className="group relative flex-shrink-0 w-[320px] md:w-[380px] rounded-2xl bg-card p-6 ring-1 ring-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <Quote className="size-8 text-primary/20 mb-3" />
      <p className="text-foreground text-sm leading-relaxed mb-4">{quote}</p>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <div className="border-t border-border pt-3">
        <p className="font-bold text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{achievement}</p>
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  // Duplicate items multiple times so the total width always exceeds any viewport,
  // guaranteeing no empty space is visible during the marquee animation.
  const items = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <SectionHeader title="أراء الطلاب وأولياء الأمور" />
      </div>

      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee-rtl">
          {items.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} {...t} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            /* 5 copies total → shift by exactly 1/5 of the full width (one set) */
            transform: translateX(calc(-100% / 5));
          }
        }
        .animate-marquee-rtl {
          /* 50s keeps the speed comfortable with the larger content set */
          animation: marquee-rtl 50s linear infinite;
          width: max-content;
        }
        .animate-marquee-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
