"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const collaborations = [
  { city: "القاهرة", name: "مركز القاهرة التعليمي" },
  { city: "القليوبية", name: "مركز بنها التعليمي - القليوبية" },
];

const filters = [
  "جميع المراكز",
  "القاهرة",
  "القليوبية",
];

export function CollaborationsFilter() {
  const [activeFilter, setActiveFilter] = useState("جميع المراكز");

  const filtered =
    activeFilter === "جميع المراكز"
      ? collaborations
      : collaborations.filter((c) => c.city === activeFilter);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {filter}
          </button>
        ))}
      </div>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <Badge variant="secondary">{item.city}</Badge>
                  <CardTitle className="mt-2">{item.name}</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
