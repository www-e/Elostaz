"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SquareRadical } from "lucide-react"

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 bg-[#1a0b3d]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <SquareRadical
                className="h-20 w-20 text-[#9575cd]"
                strokeWidth={1.5}
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold text-[#d1c4e9] font-sans"
            >
              مركز أ/ أشرف حسن
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
