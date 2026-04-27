"use client"

import Link from "next/link"
import { Phone, Mail, MessageCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedFooterProps {
  className?: string
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

const quickLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "نبذة عني", href: "/about" },
  { label: "الصف الأول الثانوي", href: "/grades/grade1" },
  { label: "الصف الثاني الثانوي", href: "/grades/grade2" },
  { label: "الصف الثالث الثانوي", href: "/grades/grade3" },
  { label: "المواعيد", href: "/schedule" },
]

const gradeLinks = [
  { label: "الصف الأول الثانوي", href: "/grades/grade1" },
  { label: "الصف الثاني الثانوي", href: "/grades/grade2" },
  { label: "الصف الثالث الثانوي", href: "/grades/grade3" },
]

const contactInfo = [
  {
    label: "الهاتف: 01009596930",
    href: "tel:+201009596930",
    icon: Phone,
  },
  {
    label: "الهاتف: 01154688628",
    href: "tel:+201154688628",
    icon: Phone,
  },
  {
    label: "واتساب",
    href: "https://wa.me/+201009596930",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "البريد الإلكتروني",
    href: "mailto:contact@alostaz.com",
    icon: Mail,
  },
]

const socialLinks = [
  {
    label: "واتساب",
    href: "https://wa.me/+201009596930",
    icon: WhatsAppIcon,
    hoverColor: "hover:text-green-500",
  },
  {
    label: "فيسبوك",
    href: "https://facebook.com",
    icon: FacebookIcon,
    hoverColor: "hover:text-blue-600",
  },
  {
    label: "يوتيوب",
    href: "https://youtube.com",
    icon: YouTubeIcon,
    hoverColor: "hover:text-red-600",
  },
  {
    label: "تليجرام",
    href: "https://telegram.org",
    icon: TelegramIcon,
    hoverColor: "hover:text-sky-500",
  },
]

export function EnhancedFooter({ className }: EnhancedFooterProps) {
  return (
    <footer
      className={cn(
        "relative mt-auto border-t bg-muted/50",
        className
      )}
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="text-2xl font-bold text-foreground font-heading">
              أ/ أشرف حسن
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              مدرس الرياضيات بخبرة واسعة في تدريس المرحلة الثانوية. نسعى لتحقيق
              التميز الأكاديمي وبناء جيل واعٍ.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map(({ label, href, icon: Icon, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "text-muted-foreground transition-colors duration-200",
                    hoverColor
                  )}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-base font-semibold text-foreground">
              روابط سريعة
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Grade Links */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-base font-semibold text-foreground">
              الصفوف الدراسية
            </h3>
            <ul className="flex flex-col gap-2.5">
              {gradeLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-base font-semibold text-foreground">
              تواصل معنا
            </h3>
            <ul className="flex flex-col gap-2.5">
              {contactInfo.map(({ label, href, icon: Icon, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                    {external && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <p className="text-sm text-muted-foreground">
              جميع الحقوق محفوظة {new Date().getFullYear()} أ/ أشرف حسن
            </p>
            <p className="text-sm text-muted-foreground">
              تم التطوير بواسطة{" "}
              <a
                href="https://wa.me/+201154688628"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline transition-colors"
              >
                Omar Ashraf
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
