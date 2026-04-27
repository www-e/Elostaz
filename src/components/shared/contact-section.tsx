import { Phone, Mail, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const socialContacts = [
  {
    icon: MessageCircle,
    title: "واتساب",
    description: "تواصل معي مباشرة على واتساب",
    href: "https://wa.me/+201227278084?text=السلام%20عليكم%20,%20ازيك%20يا%20مستر%20؟%20ايه%20الأخبار%20؟",
    color: "hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30",
  },
  {
    icon: FacebookIcon,
    title: "فيسبوك",
    description: "تابعني على صفحة الفيسبوك",
    href: "https://www.facebook.com/@ashraf.hassan.5099940",
    color: "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30",
  },
  {
    icon: YoutubeIcon,
    title: "يوتيوب",
    description: "شاهد دروسي على اليوتيوب",
    href: "https://www.youtube.com/@mr.ashrafhassan-2365",
    color: "hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30",
  },
  {
    icon: TelegramIcon,
    title: "تليجرام",
    description: "قريباً...",
    href: "#",
    color: "hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/30",
  },
];

const directContacts = [
  {
    icon: Phone,
    title: "هاتف",
    label: "01227278084",
    href: "tel:+201227278084",
    color: "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30",
  },
  {
    icon: Phone,
    title: "هاتف آخر",
    label: "01062739292",
    href: "tel:+201062739292",
    color: "hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    label: "ah8370521@gmail.com",
    href: "mailto:ah8370521@gmail.com",
    color: "hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/30",
  },
];

export function ContactSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center mb-10 font-heading">
            تواصل معي
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {socialContacts.map((contact, index) => (
            <FadeIn key={contact.title} delay={index * 0.1}>
              <a
                href={contact.href}
                target={contact.href === "#" ? undefined : "_blank"}
                rel={contact.href === "#" ? undefined : "noopener noreferrer"}
                className="block h-full"
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${contact.color}`}>
                  <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
                    <contact.icon className="size-10 text-primary" />
                    <h3 className="font-bold text-lg">{contact.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {contact.description}
                    </p>
                  </CardContent>
                </Card>
              </a>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {directContacts.map((contact, index) => (
            <FadeIn key={contact.label} delay={index * 0.1}>
              <a href={contact.href} className="block h-full">
                <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${contact.color}`}>
                  <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
                    <div className="flex items-center justify-center size-12 rounded-full bg-primary/10">
                      <contact.icon className="size-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-base">{contact.title}</h3>
                    <p className="text-muted-foreground text-sm font-medium" dir="ltr">
                      {contact.label}
                    </p>
                  </CardContent>
                </Card>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
