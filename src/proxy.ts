import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  const headers = response.headers

  // Prevent MIME type sniffing
  headers.set("X-Content-Type-Options", "nosniff")

  // Prevent clickjacking
  headers.set("X-Frame-Options", "DENY")

  // Enable strict HTTPS (enforces HTTPS for 1 year, includes subdomains)
  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  )

  // Referrer policy
  headers.set("referrer-policy", "strict-origin-when-cross-origin")

  // Permissions policy (restrict browser features)
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )

  return response
}

// Only apply to pages, not static assets or API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     * - manifest.json, sw.js, robots.txt, sitemap.xml
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|assets/|manifest.json|sw\\.js|robots\\.txt|sitemap\\.xml).*)",
  ],
}
