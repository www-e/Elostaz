"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingShapesProps {
  className?: string
}

export function FloatingShapes({ className }: FloatingShapesProps) {
  const shapes = [
    {
      id: 1,
      size: 400,
      top: "10%",
      left: "-5%",
      color: "hsl(var(--primary) / 0.04)",
      duration: 20,
      delay: 0,
    },
    {
      id: 2,
      size: 300,
      top: "40%",
      right: "-8%",
      color: "hsl(var(--primary) / 0.06)",
      duration: 25,
      delay: 2,
    },
    {
      id: 3,
      size: 250,
      top: "70%",
      left: "15%",
      color: "hsl(var(--primary) / 0.05)",
      duration: 22,
      delay: 4,
    },
    {
      id: 4,
      size: 350,
      top: "20%",
      right: "20%",
      color: "hsl(var(--primary) / 0.03)",
      duration: 28,
      delay: 1,
    },
    {
      id: 5,
      size: 200,
      bottom: "10%",
      right: "10%",
      color: "hsl(var(--primary) / 0.04)",
      duration: 18,
      delay: 3,
    },
  ]

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {shapes.map(({ id, size, color, duration, delay, ...position }) => (
        <motion.div
          key={id}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            ...position,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
