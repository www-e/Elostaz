import type { Metadata, Viewport } from "next"
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
  weight: ["400", "500", "700"],
})

const siteUrl = "https://www.alostaz.com"
const siteName = "مركز أ/ أشرف حسن للرياضيات"
const siteDescription =
  "مركز تعليمي متخصص في تدريس الرياضيات للمرحلة الثانوية. خبرة 30 عاماً، نتائج متميزة، ومذكرات شرح حصرية."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | أ/ أشرف حسن",
  },
  description: siteDescription,
  keywords: [
    "رياضيات",
    "ثانوية عامة",
    "أشرف حسن",
    "تدريس رياضيات",
    "دروس خصوصية",
    "رياضيات ثانوية",
    "شرح رياضيات",
    "رياضيات ثانوية عامة مصر",
    "مذكرات رياضيات",
    "مركز تعليمي رياضيات",
  ],
  authors: [{ name: "أشرف حسن", url: siteUrl }],
  creator: "مركز أ/ أشرف حسن",
  publisher: "مركز أ/ أشرف حسن",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: siteName,
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "أشرف حسن",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2e1269",
      },
    ],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: siteName,
              description: siteDescription,
              url: siteUrl,
              telephone: "+201227278084",
              email: "mrashrafhassn@gmail.com",
              founder: {
                "@type": "Person",
                name: "أشرف حسن",
                jobTitle: "مدرس رياضيات",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "بنها",
                addressRegion: "القليوبية",
                addressCountry: "EG",
              },
              areaServed: "EG",
              teaches: "رياضيات",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl,
              description: siteDescription,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              inLanguage: "ar",
            }),
          }}
        />
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
