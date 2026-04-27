"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SubjectCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  delay?: number;
}

export function SubjectCard({
  title,
  description,
  icon,
  href,
  delay = 0,
}: SubjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
        <CardContent className="flex flex-col items-center text-center p-8 gap-4">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full gap-2">
              ابدأ التعلم
              <ExternalLink className="size-4" />
            </Button>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
