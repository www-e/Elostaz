import type { MetadataRoute } from "next"

const BASE_URL = "https://www.alostaz.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sw.js"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
