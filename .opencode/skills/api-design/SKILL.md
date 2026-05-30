---
name: api-design
description: Use this skill when designing tRPC routers, API endpoints, validation schemas, or data contracts. Ensures type-safe, consistent, and well-documented APIs for the Sportology platform.
---

# API Design Skill

## tRPC Router Organization

### Directory Structure
```
src/server/api/routers/
├── admin/          # Admin-only endpoints
├── professor/      # Professor-scoped endpoints
├── student/        # Student-scoped endpoints
├── public/         # Open endpoints
└── index.ts        # Root router export
```

### Router Patterns
- Group by domain/resource, not by HTTP method
- Use descriptive procedure names (e.g., `getById`, `create`, `updateStatus`)
- Export domain routers from `index.ts`
- Register in root router

## Procedure Types

### Standard Procedures
```typescript
// Open to all
publicProcedure

// Requires authentication
protectedProcedure

// Admin only
adminProcedure

// Custom role checks
.procedure(({ ctx }) => {
  if (ctx.session.user.role !== 'PROFESSOR') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return ctx;
})
```

## Input Validation

### Zod Schema Patterns
- Define schemas in `src/lib/validators/`
- Use `.strict()` to reject unknown fields
- Implement custom error messages
- Reuse schemas across create/update where possible

```typescript
// Good example
export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10).max(5000),
  price: z.number().min(0).max(100000),
  categoryId: z.string().uuid().optional(),
  visibility: z.enum(['DRAFT', 'PUBLISHED', 'PRIVATE']),
}).strict();

export const updateCourseSchema = courseSchema.partial().extend({
  id: z.string().uuid(),
});
```

## Error Handling

### Standard Error Codes
- `BAD_REQUEST` - Invalid input
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - No permission
- `NOT_FOUND` - Resource doesn't exist
- `CONFLICT` - Resource already exists
- `INTERNAL_SERVER_ERROR` - Unexpected error

### Error Response Format
```typescript
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Course not found',
  cause: error,
});
```

## Response Patterns

### List Endpoints
```typescript
// Standard list response
interface ListResponse<T> {
  items: T[];
  nextCursor?: string;
  totalCount?: number;
}

// Implementation
.limit(limit + 1)
.const items = await query;
const nextCursor = items.length > limit ? items[limit]?.id : undefined;
return { items: items.slice(0, limit), nextCursor };
```

### Single Resource
- Return full object on success
- Return `null` or throw `NOT_FOUND` when missing

## API Versioning
- Use router prefixes for major versions if needed
- Maintain backward compatibility within versions
- Deprecate with warning headers

## Rate Limiting
- Implement per-user rate limits
- Stricter limits for auth endpoints
- Return `429` status with `Retry-After` header

## Documentation
- Use descriptive procedure names
- Document input/output types via Zod
- Include example usage in comments
- Document error scenarios

## Best Practices
- [ ] All inputs validated
- [ ] Proper error handling
- [ ] Pagination for lists
- [ ] Consistent naming
- [ ] Type-safe end-to-end
- [ ] Authorization checks
- [ ] Input sanitization
- [ ] Rate limiting
