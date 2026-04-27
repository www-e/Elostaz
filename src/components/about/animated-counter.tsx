"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  label: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  label,
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(count, target, { duration: 2, ease: "easeOut" });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [count, rounded, target]);

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card ring-1 ring-border">
      <div className="text-4xl font-bold text-primary font-heading flex items-baseline gap-1">
        <span>{display}</span>
        <span>{suffix}</span>
      </div>
      <p className="mt-2 text-muted-foreground">{label}</p>
    </div>
  );
}
