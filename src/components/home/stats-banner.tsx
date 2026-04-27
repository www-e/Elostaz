"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 30, suffix: "+", label: "سنوات خبرة" },
  { value: 1000, suffix: "+", label: "طالب نجح" },
  { value: 50, suffix: "+", label: "مركز" },
  { value: 95, suffix: "%+", label: "نسبة النجاح" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2500;
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
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsBanner() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary to-indigo-700">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
