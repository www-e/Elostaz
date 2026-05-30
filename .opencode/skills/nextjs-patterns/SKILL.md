---
name: nextjs-patterns
description: Use this skill when implementing Next.js 15 App Router features, Server Components, Server Actions, or choosing rendering strategies. Covers caching, streaming, error boundaries, and modern Next.js patterns.
---

# Next.js Patterns Skill

## App Router Architecture

### File Conventions
```
app/
├── layout.tsx      # Root layout (required)
├── page.tsx        # Home page
├── loading.tsx     # Loading UI
├── error.tsx       # Error boundary
├── not-found.tsx   # 404 page
├── template.tsx    # Re-mounting layout
└── [route]/
    ├── page.tsx
    └── layout.tsx
```

### Route Groups
```
app/
├── (marketing)/    # Group without URL segment
│   ├── page.tsx
│   └── about/
├── (dashboard)/
│   └── dashboard/
```

## Server Components (Default)

### When to Use
- Data fetching
- Accessing backend resources directly
- Keeping sensitive logic server-side
- Reducing client-side JavaScript

### Patterns
```tsx
// Fetch data directly
export default async function CoursePage({ params }: Props) {
  const course = await db.course.findUnique({
    where: { slug: params.slug },
  });
  
  if (!course) notFound();
  
  return <CourseDetail course={course} />;
}
```

## Client Components

### When to Use
- Interactivity and event listeners
- Browser APIs
- React hooks (useState, useEffect)
- Custom hooks

### Patterns
```tsx
'use client';

import { useState } from 'react';

export default function CourseEnrollButton({ courseId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Client-side interactivity
}
```

## Server Actions

### Form Handling
```tsx
// Server Action
async function createCourse(formData: FormData) {
  'use server';
  
  const data = Object.fromEntries(formData);
  const validated = createCourseSchema.parse(data);
  
  await db.course.create({ data: validated });
  revalidatePath('/courses');
}

// Component
export default function CreateCourseForm() {
  return (
    <form action={createCourse}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Optimistic Updates
```tsx
'use client';

import { useOptimistic } from 'react';

export default function EnrollmentList({ enrollments }) {
  const [optimisticEnrollments, addOptimistic] = useOptimistic(
    enrollments,
    (state, newEnrollment) => [...state, newEnrollment]
  );
  
  async function enroll(formData: FormData) {
    addOptimistic({ id: 'temp', status: 'pending' });
    await enrollAction(formData);
  }
}
```

## Caching Strategies

### Fetch Cache
```tsx
// Cache indefinitely
fetch(url, { cache: 'force-cache' });

// Revalidate periodically
fetch(url, { next: { revalidate: 3600 } });

// No cache
fetch(url, { cache: 'no-store' });
```

### Route Segment Config
```tsx
export const dynamic = 'force-dynamic'; // No caching
export const revalidate = 3600; // ISR
export const fetchCache = 'force-no-store';
```

## Error Handling

### Error Boundaries
```tsx
// app/courses/error.tsx
'use client';

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Not Found
```tsx
import { notFound } from 'next/navigation';

if (!course) notFound();
```

## Streaming & Suspense

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <h1>Course</h1>
      <Suspense fallback={<CourseSkeleton />}>
        <CourseContent />
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </>
  );
}
```

## Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

## Best Practices
- [ ] Server Components by default
- [ ] Minimal `'use client'` usage
- [ ] Proper error boundaries
- [ ] Loading states with Suspense
- [ ] Smart caching strategies
- [ ] Metadata on every page
- [ ] Revalidation after mutations
- [ ] Progressive enhancement
