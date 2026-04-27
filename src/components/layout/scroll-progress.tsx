"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[10001] origin-right"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #5e35b1, #7c4dff, #9575cd)",
      }}
    />
  )
}
