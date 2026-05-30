"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExamRevisionPoster, type PosterType } from "./exam-revision-poster";

const SESSION_KEY = "alostaz_poster_seen";

interface PosterOverlayProps {
  /** Called when the overlay is fully dismissed */
  onDismiss?: () => void;
  /**
   * External trigger to show a specific poster type.
   * Set to 'math' or 'statistics' to open that poster directly.
   * Set to null/undefined when not triggering.
   * The component also auto-shows on mount (once per session) independently.
   */
  showPoster?: PosterType | null;
  /** Called after the trigger has been consumed */
  onTriggerConsumed?: () => void;
}

export function PosterOverlay({ onDismiss, showPoster, onTriggerConsumed }: PosterOverlayProps) {
  const [phase, setPhase] = useState<1 | 2 | "dismissed">("dismissed");
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-show on mount (once per session via sessionStorage)
  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      const timer = setTimeout(() => {
        setPhase(1);
        setIsVisible(true);
        document.body.style.overflow = "hidden";
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle external trigger to show a specific poster
  useEffect(() => {
    if (!showPoster) return;

    // Set sessionStorage so auto-show doesn't also fire
    sessionStorage.setItem(SESSION_KEY, "true");

    // Open at the phase matching the poster type
    const targetPhase = showPoster === "math" ? 1 : 2;
    setPhase(targetPhase);
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    onTriggerConsumed?.();
  }, [showPoster, onTriggerConsumed]);

  const dismiss = useCallback(() => {
    setIsAnimating(true);
    setIsVisible(false);
    document.body.style.overflow = "";
    sessionStorage.setItem(SESSION_KEY, "true");
    setTimeout(() => {
      setPhase("dismissed");
      setIsAnimating(false);
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  const goToNext = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setPhase(2);
      setIsAnimating(false);
    }, 150);
  }, []);

  // Allow escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "dismissed" && !isAnimating) {
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, isAnimating, dismiss]);

  if (phase === "dismissed") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 left-4 z-20 flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>

          {/* Phase indicator dots */}
          <div className="absolute top-6 right-1/2 translate-x-1/2 z-20 flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                phase === 1 ? "bg-white w-6" : "bg-white/40"
              )}
            />
            <span
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                phase === 2 ? "bg-white w-6" : "bg-white/40"
              )}
            />
          </div>

          {/* Poster content */}
          <div className="relative z-10 w-full max-w-md px-4 py-8 md:py-12 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {phase === 1 && !isAnimating && (
                <motion.div
                  key="poster-1"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full"
                >
                  <ExamRevisionPoster type="math" />
                </motion.div>
              )}

              {phase === 2 && !isAnimating && (
                <motion.div
                  key="poster-2"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full"
                >
                  <ExamRevisionPoster type="statistics" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="mt-6 flex items-center gap-3">
              {phase === 1 ? (
                <>
                  <Button
                    onClick={goToNext}
                    size="lg"
                    className="gap-2 bg-white text-purple-900 hover:bg-purple-50 font-bold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    التالي
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    onClick={dismiss}
                    variant="ghost"
                    size="lg"
                    className="gap-2 text-white/80 hover:text-white hover:bg-white/10 font-medium"
                  >
                    تخطي
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={dismiss}
                    size="lg"
                    className="gap-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    ابدأ التصفح
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAnimating(true);
                      setTimeout(() => {
                        setPhase(1);
                        setIsAnimating(false);
                      }, 150);
                    }}
                    variant="ghost"
                    size="lg"
                    className="gap-2 text-white/80 hover:text-white hover:bg-white/10 font-medium"
                  >
                    السابق
                  </Button>
                </>
              )}
            </div>

            {/* Hint text */}
            <p className="mt-4 text-xs text-white/40 text-center">
              اضغط على زر التخطي لتجاوز الإعلان
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
