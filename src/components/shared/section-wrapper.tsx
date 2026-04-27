import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  withPattern?: boolean
  withGlow?: boolean
}

export function SectionWrapper({
  children,
  className,
  id,
  withPattern = false,
  withGlow = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 px-4 overflow-hidden",
        withPattern && "math-pattern",
        className
      )}
    >
      {withGlow && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />
      )}
      <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
    </section>
  )
}
