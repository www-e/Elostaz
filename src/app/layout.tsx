import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { LoadingScreen } from "@/components/layout/loading-screen"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { ScrollToTop } from "@/components/layout/scroll-to-top"

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "700", "800", "900"],
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
  authors: [{ name: "أشرف حسن" }],
  creator: "مركز أ/ أشرف حسن",
  publisher: "مركز أ/ أشرف حسن",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "أشرف حسن",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only register service worker on GitHub Pages, not on Vercel/production
  const isGitHubPages = process.env.NEXT_PUBLIC_DEPLOY_PLATFORM === "github-pages"

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {isGitHubPages && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then(reg => console.log('Service Worker registered'))
                      .catch(err => console.log('Service Worker registration failed:', err));
                  });
                }
              `,
            }}
          />
        )}
      </head>
      <body className={`${tajawal.variable} min-h-full bg-background text-foreground`} suppressHydrationWarning>
        <LoadingScreen />
        <ScrollProgress />
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col font-sans">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
