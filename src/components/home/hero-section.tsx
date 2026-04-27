"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  SquareRadical,
  Infinity as InfinityIcon,
  Pi,
  Sigma,
  Triangle,
  Circle,
  Hash,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const mathSymbols = [
  { Icon: SquareRadical, x: "10%", y: "15%", size: 32, delay: 0, duration: 5 },
  { Icon: InfinityIcon, x: "85%", y: "20%", size: 28, delay: 1, duration: 6 },
  { Icon: Pi, x: "75%", y: "75%", size: 36, delay: 0.5, duration: 7 },
  { Icon: Sigma, x: "15%", y: "80%", size: 30, delay: 1.5, duration: 5.5 },
  { Icon: Triangle, x: "50%", y: "10%", size: 24, delay: 2, duration: 6.5 },
  { Icon: Circle, x: "90%", y: "50%", size: 26, delay: 0.8, duration: 5 },
  { Icon: Hash, x: "5%", y: "50%", size: 28, delay: 1.2, duration: 7 },
];

const stats = [
  { value: 30, suffix: "+", label: "سنوات خبرة" },
  { value: 1000, suffix: "+", label: "طالب" },
  { value: 50, suffix: "+", label: "مركز" },
  { value: 6, suffix: "+", label: "سنوات أونلاين" },
];

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const characters = text.split("");
  return (
    <span className="inline-block">
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: delay + index * 0.05,
            ease: "easeOut",
          }}
          className="inline"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Gradient orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      {/* Floating math symbols */}
      {mathSymbols.map(({ Icon, x, y, size, delay, duration }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20 pointer-events-none"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-right"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-heading gradient-text leading-tight">
            أ/ أشرف حسن
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground min-h-[2.5rem]">
            <TypewriterText text="الأستاذ في الرياضيات للمرحلة الثانوية" delay={0.5} />
          </p>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-end">
            <Link
              href="/#contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "animate-pulse-glow"
              )}
            >
              تواصل معي
            </Link>
            <Link
              href="/#courses"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              استكشف الصفوف
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center"
        >
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
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-card p-3 rounded-xl shadow-lg ring-1 ring-border"
            >
              <SquareRadical className="size-6 text-primary" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-card p-3 rounded-xl shadow-lg ring-1 ring-border"
            >
              <InfinityIcon className="size-6 text-primary" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 -right-8 bg-card p-3 rounded-xl shadow-lg ring-1 ring-border"
            >
              <TrendingUp className="size-6 text-primary" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, delay: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-8 bg-card p-3 rounded-xl shadow-lg ring-1 ring-border"
            >
              <Users className="size-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
