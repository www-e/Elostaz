---
name: seo-optimization
description: Use this skill when implementing SEO features, optimizing metadata, creating sitemaps, or improving search visibility for the Sportology platform (courses, careers, blogs).
---

# SEO Optimization Skill

## Next.js Metadata API

### Static Metadata
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Sportology - Sports Education Platform',
    template: '%s | Sportology',
  },
  description: 'Leading sports education platform...',
  keywords: ['sports', 'education', 'courses'],
  authors: [{ name: 'Sportology' }],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'Sportology',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Dynamic Metadata
```tsx
// app/courses/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.slug);
  
  return {
    title: course.title,
    description: course.description.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.thumbnailUrl],
    },
  };
}
```

## Structured Data

### Course Schema
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: 'Sportology',
      },
    }),
  }}
/>
```

### Job Posting Schema (Careers)
```tsx
{
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  hiringOrganization: {
    '@type': 'Organization',
    name: job.employer.organizationName,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: job.country,
      addressLocality: job.city,
    },
  },
}
```

## URL Structure
- Use descriptive slugs: `/courses/football-coaching-basics`
- Keep URLs lowercase with hyphens
- Avoid query parameters for SEO-critical pages
- Implement canonical URLs

## Sitemap
```tsx
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getAllCourses();
  
  return [
    {
      url: 'https://sportology.com',
      lastModified: new Date(),
      priority: 1,
    },
    ...courses.map(course => ({
      url: `https://sportology.com/courses/${course.slug}`,
      lastModified: course.updatedAt,
      priority: 0.8,
    })),
  ];
}
```

## Robots.txt
```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://sportology.com/sitemap.xml
```

## Internationalization (i18n)
- Use `next-intl` for Arabic/English support
- Implement hreflang tags
- Use proper language attributes
- Consider RTL layout for Arabic

## Performance for SEO
- Core Web Vitals affect rankings
- Use `next/image` for fast images
- Implement lazy loading for below-fold content
- Minimize CLS with proper image dimensions

## Content SEO
- Unique, descriptive title tags (50-60 chars)
- Meta descriptions (150-160 chars)
- Header hierarchy (single H1 per page)
- Internal linking between related content
- Alt text for images

## SEO Checklist
- [ ] Metadata on all pages
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Structured data
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Canonical URLs
- [ ] HTTPS enabled
- [ ] Mobile-friendly
- [ ] Fast loading times
- [ ] Internal links
- [ ] Descriptive URLs
