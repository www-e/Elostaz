"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  frontImage: string;
  backImage: string;
  alt: string;
  className?: string;
}

export function FlipCard({
  frontImage,
  backImage,
  alt,
  className,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={cn(
        "group relative w-full aspect-[1.58/1] cursor-pointer",
        className
      )}
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-xl ring-1 ring-border"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={frontImage}
            alt={`${alt} - الأمام`}
            fill
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-xl ring-1 ring-border"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Image
            src={backImage}
            alt={`${alt} - الخلف`}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
