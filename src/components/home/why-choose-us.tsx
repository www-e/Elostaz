"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Monitor,
  FileText,
  ClipboardCheck,
  Trophy,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/section-header";

const features = [
  {
    title: "خبرة 30 عاماً",
    description:
      "أكثر من ثلاثين عاماً في تدريس الرياضيات للمرحلة الثانوية، مع خبرة عميقة في مناهج الجبر والهندسة والتفاضل والتكامل.",
    icon: BookOpen,
    className: "md:col-span-2 md:row-span-2",
    iconClass: "size-10",
  },
  {
    title: "شرح تفاعلي",
    description:
      "سبورة إلكترونية متطورة مع شرح مباشر وتفاعل مع الطلاب لضمان أفضل استيعاب.",
    icon: Monitor,
    className: "md:col-span-1",
    iconClass: "size-8",
  },
  {
    title: "مذكرات حصرية",
    description:
      "مذكرات شرح مُعدة خصيصاً بأسلوب مبسط ومنظم تشمل أمثلة وتدريبات متنوعة.",
    icon: FileText,
    className: "md:col-span-1",
    iconClass: "size-8",
  },
  {
    title: "متابعة يومية",
    description:
      "متابعة مستمرة للحضور والواجبات مع تقارير دورية لأولياء الأمور.",
    icon: ClipboardCheck,
    className: "md:col-span-1",
    iconClass: "size-8",
  },
  {
    title: "نتائج متميزة",
    description:
      "تاريخ حافل من النجاحات والمراكز الأولى في الثانوية العامة، حيث حقق طلابنا نتائج استثنائية على مدار السنوات.",
    icon: Trophy,
    className: "md:col-span-2 md:row-span-1",
    iconClass: "size-10",
  },
  {
    title: "دعم واتساب",
    description: "تواصل مباشر للاستفسارات والدعم عبر واتساب على مدار اليوم.",
    icon: MessageCircle,
    className: "md:col-span-1",
    iconClass: "size-8",
  },
];

function BentoCard({
  title,
  description,
  icon: Icon,
  className,
  iconClass,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  iconClass?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative rounded-2xl bg-card p-6 ring-1 ring-border overflow-hidden",
        "hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-300",
        className
      )}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      <div className="relative">
        <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary">
          <Icon className={cn("text-primary", iconClass)} />
        </div>
        <h3 className="text-lg font-bold font-heading mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="لماذا تختار مركزنا؟" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(140px,auto)]">
          {features.map((feature) => (
            <BentoCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
