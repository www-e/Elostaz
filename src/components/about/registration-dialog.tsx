"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrationDialogProps {
  buttonText: string;
  buttonClassName?: string;
}

export function RegistrationDialog({
  buttonText,
  buttonClassName,
}: RegistrationDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ size: "lg" }), buttonClassName)}
      >
        {buttonText}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>التسجيل مغلق</DialogTitle>
            <DialogDescription>
              التسجيل مغلق للعام الحالي. يمكنك التواصل معنا عبر واتساب
              للاستفسار.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              تواصل عبر واتساب
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
