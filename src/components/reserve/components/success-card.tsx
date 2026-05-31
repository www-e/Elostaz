"use client";

import {
  CheckCircle,
  Eye,
  MessageCircle,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import {
  buildWhatsAppLink,
  VODAFONE_CASH_NUMBER,
  GRADE_LABELS,
} from "../constants";

interface SuccessCardProps {
  studentName: string;
  grade: string;
  price: number;
  apiSaved: boolean;
  onViewData: () => void;
  onStartOver: () => void;
}

/**
 * Success card shown above the form after submission.
 * Now includes grade + price summary.
 */
export function SuccessCard({
  studentName,
  grade,
  price,
  apiSaved,
  onViewData,
  onStartOver,
}: SuccessCardProps) {
  const gradeLabel = GRADE_LABELS[grade] ?? grade;

  return (
    <FadeIn>
      <Card
        className={
          "mb-8 ring-1 " +
          (apiSaved
            ? "border-green-200 dark:border-green-800 bg-green-50/60 dark:bg-green-950/30 ring-green-200/50 dark:ring-green-800/50"
            : "border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 ring-amber-200/50 dark:ring-amber-800/50")
        }
      >
        <CardContent className="pt-6 pb-6 text-center">
          {/* Icon */}
          <div
            className={
              "mx-auto mb-4 flex size-16 items-center justify-center rounded-full " +
              (apiSaved
                ? "bg-green-100 dark:bg-green-900/50"
                : "bg-amber-100 dark:bg-amber-900/50")
            }
          >
            {apiSaved ? (
              <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="size-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {apiSaved ? (
            <>
              <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                تم إرسال بيانات الحجز بنجاح! ✅
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-400 text-base mb-6">
                شكراً لك، تم حفظ بياناتك لدى الأستاذ.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-2">
                تم حفظ البيانات محلياً ⚠️
              </CardTitle>
              <CardDescription className="text-amber-700 dark:text-amber-400 text-base mb-6">
                تعذر الاتصال بالخادم. بياناتك محفوظة على هذا الجهاز فقط. يرجى
                المحاولة لاحقاً أو التواصل عبر واتساب.
              </CardDescription>
            </>
          )}

          {/* Grade + Price summary */}
          <div className="bg-white/70 dark:bg-black/20 rounded-lg p-4 mb-4 text-right space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">الصف:</span>
              <span className="font-medium">{gradeLabel}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/50 pt-2">
              <span className="text-sm text-muted-foreground">
                قيمة الاشتراك:
              </span>
              <span className="text-lg font-bold text-primary flex items-center gap-1">
                <IndianRupee className="size-4" />
                {price} ج.م
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onViewData}
              className="gap-2 w-full sm:w-auto"
            >
              <Eye className="size-4" />
              عرض بياناتي
            </Button>

            <a
              href={buildWhatsAppLink(studentName, grade)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="default"
                size="lg"
                className={
                  "gap-2 w-full " +
                  (apiSaved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-amber-600 hover:bg-amber-700")
                }
              >
                <MessageCircle className="size-4" />
                الدفع عبر واتساب
              </Button>
            </a>
          </div>

          {/* Vodafone Cash */}
          <div className="bg-white/70 dark:bg-black/20 rounded-lg p-4 text-right">
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              رقم الدفع عبر فودافون كاش:
            </p>
            <p
              className="text-lg font-bold text-green-900 dark:text-green-200 mt-1 tracking-wider"
              dir="ltr"
            >
              {VODAFONE_CASH_NUMBER}
            </p>
          </div>

          {/* Start over */}
          <button
            type="button"
            onClick={onStartOver}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            تسجيل حجز جديد
          </button>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
