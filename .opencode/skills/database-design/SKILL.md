---
name: database-design
description: Use this skill when designing, modifying, or optimizing PostgreSQL database schemas with Prisma. Covers schema design, relationships, indexing, migrations, and query optimization for the Sportology platform.
---

# Database Design Skill

## Overview

This skill guides database architecture decisions for the Sportology platform using PostgreSQL and Prisma 6. The platform handles users, courses, enrollments, payments, careers, dynamic plans, and notifications.

## Schema Design Principles

### 1. Model Organization
- Group related models with comment separators in `schema.prisma`
- Use meaningful model names in PascalCase
- Always include `createdAt` and `updatedAt` fields
- Use `@default(uuid())` for IDs unless CUID is specifically needed

### 2. Relationships
- Prefer explicit relation names for clarity
- Use `@relation(onDelete: Cascade)` only when child data should not exist without parent
- For soft deletes, use `deletedAt DateTime?` instead of hard deletes
- Document relation purposes with inline comments

### 3. Indexing Strategy
- Always index foreign keys
- Index fields used in `where` clauses frequently
- Use composite indexes for multi-column filters
- Consider `type: Gin` for array fields (e.g., `specialties`, `sportCategories`)
- Add `sort: Desc` to indexes for pagination queries

```prisma
// Good example
@@index([status, createdAt(sort: Desc)])
@@index([sportCategories], type: Gin)
```

### 4. Enum Usage
- Use enums for fields with fixed sets of values
- Keep enum names singular and PascalCase
- Document enum purposes

## Migration Workflow

1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name <descriptive_name>`
3. Run `pnpm prisma generate`
4. Verify generated types in `@prisma/client`
5. Test migrations on a copy of production data

## Query Optimization

### Performance Rules
- Always use `select` or `include` to limit fetched fields
- Use `findUnique` over `findFirst` when querying by unique fields
- Batch related queries with `include` instead of N+1 queries
- Use `count()` instead of fetching all records when only count is needed
- Use `distinct` for deduplication at DB level

### Connection Management
- Always import `db` from `@/server/db`
- Never create new `PrismaClient()` instances
- Use `$transaction` for multi-step operations requiring consistency
- Implement connection pooling for production

## Soft Delete Pattern

```prisma
model Example {
  id        String    @id @default(uuid())
  deletedAt DateTime?
  deletedBy String?
  // ... other fields
  
  @@index([deletedAt])
}
```

When querying, always filter: `where: { deletedAt: null }`

## Decimal Precision

Use `@db.Decimal(10, 2)` for monetary values:
```prisma
walletBalance Decimal @default(0) @db.Decimal(10, 2)
```

## Validation Checklist
- [ ] All foreign keys have indexes
- [ ] Monetary fields use Decimal
- [ ] Soft deletes implemented where needed
- [ ] Timestamps present on all models
- [ ] Enums used for fixed value sets
- [ ] Relations have proper `onDelete` behavior
- [ ] Migration tested locally before committing
