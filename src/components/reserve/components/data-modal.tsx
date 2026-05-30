"use client";

import { X, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  buildWhatsAppLink,
  VODAFONE_CASH_NUMBER,
  GRADE_LABELS,
} from "../constants";
import { formatTimestamp } from "../validation";
import type { BookingData } from "../types";

interface DataModalProps {
  open: boolean;
  onClose: () => void;
  data: BookingData;
}

/**
 * Modal displaying all submitted booking data in readable Arabic.
 */
export function DataModal({ open, onClose, data }: DataModalProps) {
  const rows: { label: string; value: string; ltr?: boolean }[] = [
    { label: "اسم الطالب:", value: data.studentName },
    { label: "رقم الطالب (واتساب):", value: data.studentPhone, ltr: true },
    { label: "رقم ولي الأمر (واتساب):", value: data.parentPhone, ltr: true },
    { label: "النوع:", value: data.gender },
    { label: "الصف:", value: GRADE_LABELS[data.grade] ?? data.grade },
    { label: "يوم المجموعة:", value: data.groupDay },
    { label: "وقت المجموعة:", value: data.groupTime },
    { label: "تاريخ الحجز:", value: formatTimestamp(data.submittedAt) },
  ];

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <DialogTitle className="text-lg font-bold">
            بيانات الحجز
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted transition-colors"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Offline warning */}
        {!data.apiSaved && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="size-4 shrink-0" />
            <span>لم يتم إرسال البيانات للخادم بعد — تم الحفظ محلياً فقط</span>
          </div>
        )}

        {/* Data rows */}
        <div className="space-y-3 pt-2">
          {rows.map((row) => (
            <div key={row.label} className="rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">
                {row.label}
              </span>
              <p
                className="font-medium text-base mt-0.5"
                dir={row.ltr ? "ltr" : undefined}
              >
                {row.value}
              </p>
            </div>
          ))}

          {/* Vodafone Cash + WhatsApp */}
          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50/60 dark:bg-green-950/30 p-3 mt-2">
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              رقم الدفع عبر فودافون كاش:
            </p>
            <p
              className="text-lg font-bold text-green-800 dark:text-green-300 mt-1 tracking-wider"
              dir="ltr"
            >
              {VODAFONE_CASH_NUMBER}
            </p>
            <a
              href={buildWhatsAppLink(data.studentName)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex"
            >
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="size-4" />
                الدفع عبر واتساب
              </Button>
            </a>
          </div>
        </div>

        {/* Close button */}
        <div className="mt-4 border-t border-border pt-3">
          <Button variant="outline" onClick={onClose} className="w-full">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
