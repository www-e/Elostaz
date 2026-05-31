"use client";

import { useState } from "react";
import { LoaderCircle, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { useBookingForm } from "./hooks/use-booking-form";
import {
  GRADE_OPTIONS,
  getGradeDays,
  getGradeTimes,
  getGradePrice,
  RESERVATION_OPEN_DATE,
} from "./constants";
import { FormField, errorId } from "./components/form-field";
import { CustomDropdown } from "./components/custom-dropdown";
import { PhoneInput } from "./components/phone-input";
import { GenderField } from "./components/gender-field";
import { SuccessCard } from "./components/success-card";
import { DataModal } from "./components/data-modal";
import type { FormFieldName } from "./types";

/**
 * New Year booking page — math tutoring with Mr. Ashraf Hassan.
 */
export function BookingForm() {
  const {
    fields,
    submittedData,
    submitting,
    submitError,
    updateField,
    handleBlur,
    handleSubmit,
    handleReset,
    getError,
  } = useBookingForm();

  const [modalOpen, setModalOpen] = useState(false);

  /* ── Derived — grades → dynamic days/times ── */
  const selectedGrade = fields.grade;
  const availableDays = selectedGrade ? getGradeDays(selectedGrade) : [];
  const availableTimes =
    selectedGrade && fields.groupDay
      ? getGradeTimes(selectedGrade, fields.groupDay)
      : [];
  const gradePrice = selectedGrade ? getGradePrice(selectedGrade) : 0;

  const blur = (name: FormFieldName) => () => handleBlur(name);

  /* ── Render ── */
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10">
      {/* ── Success card ── */}
      {submittedData && (
        <SuccessCard
          studentName={submittedData.studentName}
          grade={submittedData.grade}
          price={submittedData.price}
          apiSaved={submittedData.apiSaved}
          onViewData={() => setModalOpen(true)}
          onStartOver={handleReset}
        />
      )}

      {/* ── Form ── */}
      {!submittedData && (
        <FadeIn>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                حجز السنة الجديدة - الرياضيات
              </CardTitle>
              <CardDescription className="text-center text-base">
                مع الأستاذ / أشرف حسن — يبدأ الحجز من {RESERVATION_OPEN_DATE}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* API error banner */}
              {submitError && (
                <div
                  className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive text-center"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-5"
              >
                {/* Student name */}
                <FormField
                  label="اسم الطالب (كاملة)"
                  required
                  htmlFor="studentName"
                  error={getError("studentName")}
                >
                  <input
                    id="studentName"
                    type="text"
                    value={fields.studentName}
                    onChange={(e) =>
                      updateField("studentName", e.target.value)
                    }
                    onBlur={blur("studentName")}
                    placeholder="مثال: عمر اشرف حسن"
                    disabled={submitting}
                    aria-describedby={
                      getError("studentName")
                        ? errorId("studentName")
                        : undefined
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    autoComplete="name"
                  />
                </FormField>

                {/* Student phone */}
                <FormField
                  label="رقم الطالب (واتساب)"
                  required
                  htmlFor="studentPhone"
                  error={getError("studentPhone")}
                >
                  <PhoneInput
                    id="studentPhone"
                    value={fields.studentPhone}
                    onChange={(v) => updateField("studentPhone", v)}
                    onBlur={blur("studentPhone")}
                    placeholder="مثال: 01012345678"
                    autoComplete="tel"
                    hasError={!!getError("studentPhone")}
                    disabled={submitting}
                    ariaDescribedBy={
                      getError("studentPhone")
                        ? errorId("studentPhone")
                        : undefined
                    }
                  />
                </FormField>

                {/* Parent phone */}
                <FormField
                  label="رقم ولي الأمر (واتساب)"
                  required
                  htmlFor="parentPhone"
                  error={getError("parentPhone")}
                >
                  <PhoneInput
                    id="parentPhone"
                    value={fields.parentPhone}
                    onChange={(v) => updateField("parentPhone", v)}
                    onBlur={blur("parentPhone")}
                    placeholder="مثال: 01012345678"
                    autoComplete="tel"
                    hasError={!!getError("parentPhone")}
                    disabled={submitting}
                    ariaDescribedBy={
                      getError("parentPhone")
                        ? errorId("parentPhone")
                        : undefined
                    }
                  />
                </FormField>

                {/* Gender */}
                <FormField
                  label="النوع"
                  required
                  asFieldset
                  error={getError("gender")}
                >
                  <GenderField
                    value={fields.gender}
                    onChange={(v) => updateField("gender", v)}
                    hasError={!!getError("gender")}
                  />
                </FormField>

                {/* Grade — with price shown */}
                <FormField
                  label="الصف الدراسي"
                  required
                  htmlFor="grade"
                  error={getError("grade")}
                >
                  <CustomDropdown
                    id="grade"
                    value={fields.grade}
                    onChange={(v) => {
                      updateField("grade", v);
                      // Reset day & time when grade changes
                      updateField("groupDay", "");
                      updateField("groupTime", "");
                    }}
                    onBlur={blur("grade")}
                    placeholder="-- اختر الصف --"
                    options={GRADE_OPTIONS}
                    hasError={!!getError("grade")}
                    disabled={submitting}
                    ariaDescribedBy={
                      getError("grade") ? errorId("grade") : undefined
                    }
                  />
                </FormField>

                {/* ── Price summary (shown when grade is selected) ── */}
                {selectedGrade && gradePrice > 0 && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      قيمة الاشتراك
                    </span>
                    <span className="text-lg font-bold text-primary flex items-center gap-1.5">
                      <IndianRupee className="size-4" />
                      {gradePrice} ج.م
                    </span>
                  </div>
                )}

                {/* Group day — dynamic based on grade */}
                {selectedGrade && (
                  <FormField
                    label="يوم المجموعة"
                    required
                    htmlFor="groupDay"
                    error={getError("groupDay")}
                  >
                    <CustomDropdown
                      id="groupDay"
                      value={fields.groupDay}
                      onChange={(v) => {
                        updateField("groupDay", v);
                        updateField("groupTime", "");
                      }}
                      onBlur={blur("groupDay")}
                      placeholder={
                        availableDays.length > 0
                          ? "-- اختر اليوم --"
                          : "-- لا توجد أيام متاحة --"
                      }
                      options={availableDays}
                      hasError={!!getError("groupDay")}
                      disabled={submitting || availableDays.length === 0}
                      ariaDescribedBy={
                        getError("groupDay")
                          ? errorId("groupDay")
                          : undefined
                      }
                    />
                  </FormField>
                )}

                {/* Group time — dynamic based on grade + day */}
                {selectedGrade && fields.groupDay && (
                  <FormField
                    label="وقت المجموعة"
                    required
                    htmlFor="groupTime"
                    error={getError("groupTime")}
                  >
                    <CustomDropdown
                      id="groupTime"
                      value={fields.groupTime}
                      onChange={(v) => updateField("groupTime", v)}
                      onBlur={blur("groupTime")}
                      disabled={submitting || availableTimes.length === 0}
                      placeholder={
                        availableTimes.length > 0
                          ? "-- اختر الوقت --"
                          : "-- لا توجد أوقات متاحة --"
                      }
                      options={availableTimes}
                      hasError={!!getError("groupTime")}
                      ariaDescribedBy={
                        getError("groupTime")
                          ? errorId("groupTime")
                          : undefined
                      }
                    />
                  </FormField>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full mt-2 text-base gap-2"
                >
                  {submitting && (
                    <LoaderCircle className="size-5 animate-spin" />
                  )}
                  {submitting
                    ? "جاري الحجز..."
                    : gradePrice > 0
                      ? `تأكيد الحجز (${gradePrice} ج.م)`
                      : "تأكيد الحجز"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* ── Data modal ── */}
      {submittedData && (
        <DataModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          data={submittedData}
        />
      )}
    </div>
  );
}
