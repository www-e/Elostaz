---
name: error-handling
description: Use this skill when implementing error boundaries, handling API errors, logging, or creating user-friendly error states. Covers React error boundaries, tRPC error handling, and monitoring strategies.
---

# Error Handling Skill

## React Error Boundaries

### Global Error Boundary
```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">
        {process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Please try again later'}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

### Not Found Pages
```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <Link href="/" className="text-primary hover:underline">
        Return Home
      </Link>
    </div>
  );
}
```

## tRPC Error Handling

### Standardized Errors
```typescript
import { TRPCError } from '@trpc/server';

// Input validation error
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid course data provided',
});

// Auth errors
throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'Please log in to continue',
});

// Not found
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Course not found',
});
```

### Client-Side Error Handling
```tsx
'use client';

import { TRPCClientError } from '@trpc/client';

function CourseForm() {
  const utils = api.useUtils();
  const mutation = api.course.create.useMutation({
    onSuccess: () => {
      utils.course.list.invalidate();
      toast.success('Course created');
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        if (error.data?.code === 'CONFLICT') {
          toast.error('A course with this title already exists');
        } else {
          toast.error(error.message);
        }
      }
    },
  });
}
```

## Form Error Handling

### React Hook Form + Zod
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(courseSchema),
});

// In JSX
<FormField
  control={form.control}
  name="title"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Title</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## API Error Patterns

### Structured Error Response
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Usage
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Validation failed',
  cause: {
    details: {
      email: ['Invalid email format'],
      password: ['Must be at least 8 characters'],
    },
  },
});
```

## Logging Strategy

### Error Logging
```typescript
// lib/logger.ts
interface LogContext {
  userId?: string;
  requestId?: string;
  path?: string;
}

export const logger = {
  error: (error: Error, context?: LogContext) => {
    console.error({
      error: error.message,
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString(),
    });
  },
};
```

## User-Friendly Error Messages

### Guidelines
- Don't expose internal error details in production
- Provide actionable next steps
- Use clear, non-technical language
- Include support contact if applicable

### Examples
```tsx
// Bad
<div>An error occurred: Cannot read property of undefined</div>

// Good
<div>
  <h3>Unable to load courses</h3>
  <p>Please check your connection and try again.</p>
  <Button onClick={refetch}>Retry</Button>
</div>
```

## Monitoring

### Error Tracking
- Implement Sentry or similar service
- Track error frequency and patterns
- Set up alerts for critical errors
- Monitor error rates in CI/CD

### Health Checks
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: 'healthy' });
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: 'Database connection failed' },
      { status: 503 }
    );
  }
}
```

## Best Practices
- [ ] Error boundaries at page level
- [ ] Graceful degradation
- [ ] Consistent error format
- [ ] User-friendly messages
- [ ] Error logging implemented
- [ ] Monitoring configured
- [ ] Retry mechanisms where appropriate
- [ ] Loading states for async operations
