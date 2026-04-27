"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  SquareRadical,
  Infinity as InfinityIcon,
  Pi,
  Triangle,
  Circle,
  Hash,
  Sigma,
  Divide,
  Percent,
  Equal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MathSymbolsProps {
  count?: number
  className?: string
}

const MATH_ICONS = [
  SquareRadical,
  InfinityIcon,
  Pi,
  Triangle,
  Circle,
  Hash,
  Sigma,
  Divide,
  Percent,
  Equal,
] as const

interface SymbolData {
  id: number
  iconIndex: number
  iconSize: number
  top: number
  left: number
  delay: number
  duration: number
  opacity: number
}

export function MathSymbols({ count = 8, className }: MathSymbolsProps) {
  const symbols: SymbolData[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      iconIndex: i % MATH_ICONS.length,
      iconSize: Math.floor(Math.random() * 24) + 24,
      top: Math.floor(Math.random() * 90) + 5,
      left: Math.floor(Math.random() * 90) + 5,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 6,
      opacity: Math.random() * 0.05 + 0.05,
    }))
  }, [count])

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {symbols.map(({ id, iconIndex, iconSize, top, left, delay, duration, opacity }) => {
        const Icon = MATH_ICONS[iconIndex]
        return (
          <motion.div
            key={id}
            className="absolute text-primary"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              opacity,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={iconSize} strokeWidth={1.5} />
          </motion.div>
        )
      })}
    </div>
  )
}
