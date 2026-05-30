"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DownloadCardProps {
  title: string;
  imageSrc: string;
  fileHref: string;
}

export function DownloadCard({
  title,
  imageSrc,
  fileHref,
}: DownloadCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Download className="size-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        <div className="p-4 text-center">
          <h4 className="font-semibold text-foreground mb-3">{title}</h4>
          <a href={fileHref} download>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Download className="size-4" />
              تحميل المواعيد
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
