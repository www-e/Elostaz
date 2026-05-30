# Skill: Seed Management

## Purpose
Comprehensive guide for creating, auditing, and maintaining Prisma seed files for the Sportology platform. Ensures seed data is complete, consistent, and aligned with backend expectations, schema constraints, and UI requirements.

## Core Principles

### 1. Schema-First Verification
- Every seeded field MUST exist in the Prisma schema
- Every required field (`@default` absent, no `?`) MUST be populated
- Foreign key references MUST point to existing records
- Enum values MUST match schema exactly (no string literals where enum expected)
- Decimal fields MUST use string or number compatible with `@db.Decimal`

### 2. Backend Expectation Mapping
Before creating seeds, query the backend routers to understand:
- What data shapes are expected in list/single responses
- What filters are applied (e.g., `isActive: true`, `deletedAt: null`)
- What relations are `include`d by default
- What computed fields or aggregations depend on seed data

### 3. UI State Coverage
Seed data must demonstrate ALL UI states:
- Empty states (0 records)
- Loading states (many records)
- Edge cases (null values, max lengths, boundary values)
- Error states (invalid data for testing validation)
- All enum variants must have at least one representative

### 4. Referential Integrity
- Every `connect` or `create` with relations must have the target seeded FIRST
- Use deterministic IDs or lookups (email, slug) — never assume array indices
- Cascade deletes must be respected in `seed-01-clear-database.ts`
- Unique constraints must not be violated across re-runs

### 5. Data Realism
- Use realistic names, emails, phone numbers for the MENA region
- Vary data across records (don't copy-paste the same values)
- Include Arabic content where `nameAr` or `contentAr` fields exist
- Monetary values in EGP, realistic salary ranges
- Dates should span past, present, and future

## Audit Checklist

For every seed file, verify:
- [ ] All Prisma models touched have every required field populated
- [ ] No `as any` type casts on enum fields (use actual enum values)
- [ ] No `undefined` passed to Prisma create (use `null` or omit)
- [ ] Foreign key targets exist before seed runs
- [ ] Unique constraints won't conflict on re-run
- [ ] `BigInt` fields use `BigInt()` wrapper, not raw numbers
- [ ] Json fields contain valid JSON structures
- [ ] Decimal fields use compatible types
- [ ] Array fields (`String[]`) are actual arrays, not strings
- [ ] DateTime fields are `Date` objects, not strings
- [ ] Boolean fields are actual booleans
- [ ] No hardcoded DB IDs (use lookups by email/slug/name)
- [ ] `isActive` / `deletedAt` filters respected for visible data

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| `subscriptionTier: 'professional' as any` | Use `'pro'` or `'basic'` matching schema |
| `phone: student.phoneNumber \|\| undefined` | Use `null` or omit field |
| `userId: students[0]?.id \|\| students[0].id` | Just `students[0]?.id` with null guard |
| Creating own `PrismaClient` instance | Accept `prisma` as parameter |
| Hardcoded non-existent email lookups | Remove or use existing user emails |
| Missing `nameAr` on warehouse items | Add Arabic translations |
| `serviceType` not set on `Service` create | Include enum value in create data |
| `CareersProfile` missing for `CAREERS_PROFESSIONAL` | Always create profile for professional users |
| `avatarUrl` missing on `ProfessorProfile` | Add avatar URLs |

## Seed Execution Order Rules

1. Clear database (respect FK order)
2. Users (no deps)
3. Profiles (needs users)
4. Categories/Definitions (no deps)
5. Content (needs users + categories)
6. Relations (needs both sides)
7. Derived data (needs base data)
8. Engagement (needs everything)
9. System data (needs users)
10. Translations (updates existing)

## Verification Commands

```bash
# After seeding, verify counts
pnpm prisma db execute --stdin <<EOF
SELECT 'Users' as entity, COUNT(*) as count FROM "User"
UNION ALL SELECT 'Courses', COUNT(*) FROM "Course"
UNION ALL SELECT 'Services', COUNT(*) FROM "Service"
UNION ALL SELECT 'CareersProfiles', COUNT(*) FROM "CareersProfile"
UNION ALL SELECT 'JobPostings', COUNT(*) FROM "JobPosting"
UNION ALL SELECT 'Enrollments', COUNT(*) FROM "Enrollment"
UNION ALL SELECT 'Payments', COUNT(*) FROM "Payment";
EOF
```

## When Adding New Features

1. Check if new models need seed data
2. Add seed file following naming: `seed-XX-descriptive-name.ts`
3. Update `seed-master.ts` with new phase
4. Ensure foreign key dependencies are seeded first
5. Add to this skill's model coverage list
