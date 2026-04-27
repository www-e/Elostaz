import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { LoadingScreen } from "@/components/layout/loading-screen"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { ScrollToTop } from "@/components/layout/scroll-to-top"

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alostaz.com"),
  title: "مركز أ/ أشرف حسن للرياضيات",
  description:
    "مركز تعليمي متخصص في تدريس الرياضيات للمرحلة الثانوية. خبرة 30 عاماً، نتائج متميزة، ومذكرات شرح حصرية.",
  keywords: [
    "رياضيات",
    "ثانوية عامة",
    "أشرف حسن",
    "تدريس رياضيات",
    "دروس خصوصية",
    "رياضيات ثانوية",
  ],
  authors: [{ name: "أ/ أشرف حسن" }],
  openGraph: {
    title: "أ/ أشرف حسن - مدرس رياضيات متميز للمرحلة الثانوية",
    description:
      "مركز تعليمي متخصص في تدريس الرياضيات للمرحلة الثانوية. خبرة 30 عاماً، نتائج متميزة، ومذكرات شرح حصرية.",
    type: "website",
    locale: "ar_EG",
    siteName: "مركز أ/ أشرف حسن للرياضيات",
    images: [{
      url: "/assets/images-optimized/logo.webp",
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أ/ أشرف حسن - مدرس رياضيات متميز للمرحلة الثانوية",
    description:
      "مركز تعليمي متخصص في تدريس الرياضيات للمرحلة الثانوية. خبرة 30 عاماً، نتائج متميزة، ومذكرات شرح حصرية.",
    images: ["/assets/images-optimized/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/assets/icons/edu.ico",
    shortcut: "/assets/icons/edu.ico",
    apple: "/assets/icons/edu.ico",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#2e1269",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <LoadingScreen />
        <div className="noise-overlay" />
        <ScrollProgress />
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
