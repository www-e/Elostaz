"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, GraduationCap, BookOpen, Sigma, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type PosterType = "math" | "statistics";

interface ExamRevisionPosterProps {
  type: PosterType;
  variant?: "overlay" | "standalone";
  className?: string;
}

const posterConfig = {
  math: {
    subject: "الرياضيات",
    section: "للقسم العلمي",
    icon: BookOpen,
    gradient: "from-violet-700 via-purple-600 to-indigo-700",
    gradientLight: "from-violet-500 via-purple-500 to-indigo-600",
    accent: "text-violet-200",
    decorativeColor: "text-white/[0.08]",
    shadowColor: "rgba(94,53,177,0.35)",
    ctaGradient: "from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700",
    ctaShadow: "shadow-violet-500/30",
    dividerColor: "bg-violet-200 dark:bg-violet-800",
    ringColor: "ring-violet-300 dark:ring-violet-700",
    badgeBg: "bg-violet-100/80 dark:bg-violet-900/40",
    teacherGradient: "from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400",
    borderGlow: "shadow-violet-500/20",
  },
  statistics: {
    subject: "الإحصاء",
    section: "للقسم الأدبي والأزهر",
    icon: Sigma,
    gradient: "from-emerald-700 via-teal-600 to-cyan-700",
    gradientLight: "from-emerald-500 via-teal-500 to-cyan-600",
    accent: "text-emerald-200",
    decorativeColor: "text-white/[0.08]",
    shadowColor: "rgba(16,185,129,0.35)",
    ctaGradient: "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
    ctaShadow: "shadow-emerald-500/30",
    dividerColor: "bg-emerald-200 dark:bg-emerald-800",
    ringColor: "ring-emerald-300 dark:ring-emerald-700",
    badgeBg: "bg-emerald-100/80 dark:bg-emerald-900/40",
    teacherGradient: "from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400",
    borderGlow: "shadow-emerald-500/20",
  },
};

const decorativeSymbols = {
  math: ["∑", "∫", "√", "π", "∞", "Δ", "θ", "∂", "ƒ", "≈"],
  statistics: ["∑", "μ", "σ", "ρ", "χ²", "±", "≈", "≥", "≤", "√"],
};

/** A vertical social-media-ready poster design — screenshot it and post */
export function ExamRevisionPoster({ type, variant = "overlay", className }: ExamRevisionPosterProps) {
  const config = posterConfig[type];
  const Icon = config.icon;
  const symbols = decorativeSymbols[type];

  return (
    <motion.div
      initial={variant === "overlay" ? { scale: 0.92, opacity: 0 } : { opacity: 0, y: 24 }}
      animate={variant === "overlay" ? { scale: 1, opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "relative w-full select-none overflow-hidden rounded-[1.75rem]",
        "aspect-[4/5] max-w-sm mx-auto",
        "ring-1 ring-white/10",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
        variant === "standalone" && "shadow-2xl",
        className
      )}
      style={{
        boxShadow: variant === "overlay"
          ? `0 30px 80px ${config.shadowColor}, 0 0 0 1px rgba(255,255,255,0.06)`
          : undefined,
      }}
    >
      {/* === FULL POSTER CONTAINER === */}
      <div className="relative size-full bg-white dark:bg-gray-950 flex flex-col">

        {/* ======== TOP GRADIENT HERO ZONE (~40% of height) ======== */}
        <div className={cn(
          "relative flex-[2] flex flex-col items-center justify-center overflow-hidden",
          "bg-gradient-to-br", config.gradient
        )}>
          {/* Decorative symbols — large, faint, scattered */}
          <div className="absolute inset-0 pointer-events-none">
            {symbols.map((sym, i) => (
              <span
                key={i}
                className={cn("absolute font-black select-none leading-none", config.decorativeColor)}
                style={{
                  fontSize: `${2 + Math.random() * 2.8}rem`,
                  top: `${3 + Math.random() * 70}%`,
                  left: `${3 + Math.random() * 50}%`,
                  transform: `rotate(${-25 + Math.random() * 50}deg)`,
                }}
              >
                {sym}
              </span>
            ))}
            {/* Grid dots */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />
            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3/4 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center text-white px-6">
            {/* Top year badge */}
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] font-bold tracking-widest bg-white/20 backdrop-blur-sm ring-1 ring-white/30 mb-4">
              <Sparkles className="size-3" />
              2026
            </span>

            {/* Icon */}
            <div className="mb-3 flex items-center justify-center size-14 rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30 shadow-lg">
              <Icon className="size-7" />
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-black leading-tight tracking-tight">
              حجز مراجعة
            </h2>
            <h2 className="text-2xl font-black leading-tight tracking-tight mt-0.5">
              ليالي الامتحان
            </h2>

            {/* Subtitle */}
            <div className="flex items-center gap-1.5 mt-3 opacity-80">
              <GraduationCap className="size-3.5" />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                الثانوية العامة 2026
              </span>
            </div>
          </div>
        </div>

        {/* ======== BOTTOM CONTENT ZONE (~60% of height) ======== */}
        <div className={cn(
          "flex-[3] flex flex-col justify-between px-6 py-5",
          "bg-white dark:bg-gray-950"
        )}>
          {/* === Subject Section === */}
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              مادة
            </span>
            <h3 className={cn(
              "text-2xl md:text-3xl font-black font-heading mt-0.5",
              type === "math" ? "text-violet-700 dark:text-violet-400" : "text-emerald-700 dark:text-emerald-400"
            )}>
              {config.subject}
            </h3>
            <p className="text-sm text-muted-foreground font-medium mt-0.5">
              {config.section}
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 my-1">
            <div className={cn("flex-1 h-px", config.dividerColor)} />
            <span className={cn(
              "size-1.5 rounded-full",
              type === "math" ? "bg-violet-400 dark:bg-violet-600" : "bg-emerald-400 dark:bg-emerald-600"
            )} />
            <div className={cn("flex-1 h-px", config.dividerColor)} />
          </div>

          {/* === Teacher Section === */}
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
              يقدمها
            </span>
            <p className="text-xl font-black font-heading mt-0.5">
              الأستاذ / أشرف حسن
            </p>
            <p className={cn(
              "text-xs font-bold mt-1 bg-clip-text text-transparent",
              config.teacherGradient
            )}>
              كبير معلمي الرياضيات في بنها
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 my-1">
            <div className={cn("flex-1 h-px", config.dividerColor)} />
            <span className={cn(
              "size-1.5 rounded-full",
              type === "math" ? "bg-violet-400 dark:bg-violet-600" : "bg-emerald-400 dark:bg-emerald-600"
            )} />
            <div className={cn("flex-1 h-px", config.dividerColor)} />
          </div>

          {/* === Contact + CTA === */}
          <div className="text-center space-y-3">
            {/* Phone with WhatsApp icon + number side by side */}
            <div className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-2xl bg-muted/50 ring-1 ring-border">
              <a
                href="tel:+201227278084"
                className="flex items-center gap-2 text-base md:text-lg font-bold tracking-wider text-foreground hover:text-primary transition-colors"
                dir="ltr"
              >
                <Phone className="size-4.5 text-primary shrink-0" />
                <span>01227278084</span>
              </a>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <MessageCircle className="size-4" />
                واتساب
              </span>
            </div>

            {/* WhatsApp CTA button */}
            <a
              href={`https://wa.me/+201227278084?text=${encodeURIComponent(
                `السلام عليكم، أنا أريد حجز مراجعة ليالي الامتحان في مادة ${type === "math" ? "الرياضيات" : "الإحصاء"} للثانوية العامة 2026`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm text-white",
                "transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
                "bg-gradient-to-l", config.ctaGradient, config.ctaShadow
              )}
            >
              <MessageCircle className="size-5" />
              احجز الآن عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
