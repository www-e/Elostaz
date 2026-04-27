"use client";

import { useEffect, useRef, useState } from "react";
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
    <div
      dir="rtl"
      className="group relative flex-shrink-0 w-[320px] md:w-[380px] rounded-2xl bg-card p-6 ring-1 ring-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const measuredWidthRef = useRef(0);

  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;

      const firstSet = track.children[0] as HTMLElement | undefined;
      const secondSet = track.children[1] as HTMLElement | undefined;
      if (!firstSet || !secondSet) return;

      const firstRect = firstSet.getBoundingClientRect();
      const secondRect = secondSet.getBoundingClientRect();
      const distance = Math.round(secondRect.left - firstRect.left);

      if (distance > 0 && distance !== measuredWidthRef.current) {
        measuredWidthRef.current = distance;
        setMarqueeWidth(distance);
      }
    }

    measure();

    const ro = new ResizeObserver(measure);
    if (trackRef.current) {
      ro.observe(trackRef.current);
    }

    document.fonts.ready.then(measure);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Constant scroll speed: ~80px/s regardless of breakpoint
  const duration = marqueeWidth > 0 ? marqueeWidth / 80 : 0;

  return (
    <section className="py-20 overflow-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <SectionHeader title="أراء الطلاب وأولياء الأمور" />
      </div>

      <div className="relative">
        {/* Gradient fade masks on both edges */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        {/*
          dir="ltr" forces the flex track to lay out left-to-right.
          This lets us animate translateX(negative) so content enters
          from the right and exits to the left — a right-to-left visual flow.
          Each card re-declares dir="rtl" so Arabic text renders correctly.
        */}
        <div
          ref={trackRef}
          dir="ltr"
          className={`flex gap-6 w-max ${
            marqueeWidth > 0 ? "animate-marquee" : ""
          }`}
          style={
            { "--marquee-width": `${marqueeWidth}px` } as React.CSSProperties
          }
        >
          {[0, 1, 2, 3].map((copyIndex) => (
            <div key={copyIndex} className="flex gap-6 flex-shrink-0">
              {testimonials.map((t, i) => (
                <TestimonialCard key={`${copyIndex}-${i}`} {...t} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee-scroll ${duration}s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(var(--marquee-width) * -1));
          }
        }
      `}</style>
    </section>
  );
}
