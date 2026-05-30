---
name: prisma-optimization
description: Use this skill when optimizing Prisma queries, adding indexes, or troubleshooting slow database operations. Covers query optimization, connection pooling, transaction management, and Prisma best practices.
---

# Prisma Optimization Skill

## Query Optimization

### Select Only Needed Fields
```typescript
// Bad - fetches everything
const user = await db.user.findUnique({ where: { id } });

// Good - selects only needed fields
const user = await db.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```

### Include Optimization
```typescript
// Bad - nested includes without limits
const courses = await db.course.findMany({
  include: {
    lessons: true, // Could be 100+ lessons
    enrollments: true, // Could be 1000+
  },
});

// Good - paginate and select
const courses = await db.course.findMany({
  include: {
    lessons: {
      take: 10,
      orderBy: { order: 'asc' },
    },
    _count: {
      select: { enrollments: true },
    },
  },
});
```

## N+1 Prevention

### Problem
```typescript
// N+1 query problem
const courses = await db.course.findMany();
for (const course of courses) {
  const professor = await db.user.findUnique({
    where: { id: course.professorId },
  });
}
```

### Solution
```typescript
// Single query with include
const courses = await db.course.findMany({
  include: {
    professor: {
      select: { id: true, firstName: true, lastName: true },
    },
  },
});

// Or use select with relation
const courses = await db.course.findMany({
  select: {
    id: true,
    title: true,
    professor: {
      select: { firstName: true, lastName: true },
    },
  },
});
```

## Pagination Patterns

### Offset Pagination
```typescript
const page = 1;
const limit = 20;

const [items, totalCount] = await Promise.all([
  db.course.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  }),
  db.course.count(),
]);
```

### Cursor Pagination (Preferred)
```typescript
const items = await db.course.findMany({
  take: limit + 1,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' },
});

const nextCursor = items.length > limit ? items[limit - 1].id : undefined;
const result = items.slice(0, limit);
```

## Transactions

### Interactive Transactions
```typescript
await db.$transaction(async (tx) => {
  // Create payment
  const payment = await tx.payment.create({ data: paymentData });
  
  // Update wallet
  await tx.user.update({
    where: { id: userId },
    data: { walletBalance: { decrement: amount } },
  });
  
  // Create enrollment
  await tx.enrollment.create({ data: enrollmentData });
  
  return payment;
});
```

### Batch Operations
```typescript
// Batch create
await db.lesson.createMany({
  data: lessonsData,
  skipDuplicates: true,
});

// Batch update (if supported) or use transaction
```

## Raw Queries (When Needed)

```typescript
// Safe raw query with parameters
const result = await db.$queryRaw`
  SELECT * FROM "Course"
  WHERE "enrollmentCount" > ${minEnrollments}
`;

// For dynamic table/column names (use with caution)
const result = await db.$queryRawUnsafe(
  `SELECT * FROM "${tableName}" WHERE id = $1`,
  id
);
```

## Connection Pooling

### Configuration
```env
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=10&pool_timeout=20"
```

### Best Practices
- Use connection pooling in production
- Set appropriate connection limits
- Monitor connection usage
- Use PgBouncer for serverless deployments

## Indexing Guide

### When to Add Indexes
- Foreign keys (automatic in Prisma but verify)
- Fields in WHERE clauses
- Fields in ORDER BY
- Fields in JOIN conditions
- Frequently queried combinations

### Composite Index Order
```prisma
// Good - equality first, then range
@@index([status, createdAt(sort: Desc)])

// Good - high selectivity first
@@index([email, status])
```

## Monitoring

### Query Logging
```typescript
// prisma.ts
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

## Checklist
- [ ] Select only needed fields
- [ ] Use pagination for lists
- [ ] Prevent N+1 with includes
- [ ] Use transactions for consistency
- [ ] Add indexes for frequent queries
- [ ] Monitor slow queries
- [ ] Use connection pooling
- [ ] Batch operations where possible
