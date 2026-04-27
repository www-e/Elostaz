import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/shared/section-header";

const faqs = [
  {
    question: "كيف يمكنني الاشتراك في المركز؟",
    answer:
      "يمكنك التواصل معنا مباشرة عبر واتساب على الرقم 01227278084 لمعرفة المواعيد المتاحة والاشتراك في الحصص.",
  },
  {
    question: "هل الدروس متاحة أونلاين؟",
    answer:
      "نعم، نقدم دروس أونلاين مباشرة بجودة عالية مع سبورة إلكترونية تفاعلية وتسجيل للدروس.",
  },
  {
    question: "ما هي المواد المتاحة؟",
    answer:
      "نقدم دروس في الرياضيات للصفوف الثانوية الثلاثة، شاملة الجبر والهندسة والتفاضل والتكامل والاستاتيكا والديناميكا.",
  },
  {
    question: "هل هناك واجبات ومذكرات؟",
    answer:
      "نعم، نوفر مذكرات شرح حصرية وواجبات أسبوعية مع متابعة وتصحيح مستمر.",
  },
  {
    question: "كيف يتم متابعة الطالب؟",
    answer:
      "نستخدم نظام حضور ذكي مع إرسال تقارير دورية لأولياء الأمور عبر واتساب.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <SectionHeader title="الأسئلة الشائعة" />
        <Accordion className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl bg-card px-4 ring-1 ring-border data-[state=open]:ring-primary/30 transition-all"
            >
              <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
