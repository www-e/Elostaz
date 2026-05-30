---
name: testing-strategy
description: Use this skill when writing tests, setting up test infrastructure, or reviewing test coverage. Covers unit tests, integration tests, E2E tests with Playwright, and testing best practices for Next.js and tRPC.
---

# Testing Strategy Skill

## Testing Pyramid

### 1. Unit Tests (Base - 70%)
- Test business logic in isolation
- Mock external dependencies
- Fast execution (< 100ms each)
- High coverage of edge cases

### 2. Integration Tests (Middle - 20%)
- Test API endpoints with real database
- Verify database interactions
- Test service layer integrations
- Use test database with migrations

### 3. E2E Tests (Top - 10%)
- Test critical user journeys
- Use Playwright for browser automation
- Test across viewports (mobile, tablet, desktop)
- Focus on happy paths and critical failures

## Unit Testing

### What to Test
- Utility functions
- Validation logic
- Data transformations
- Business rules
- Hook behavior

### Patterns
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('calculateDiscount', () => {
  it('applies percentage discount correctly', () => {
    expect(calculateDiscount(100, 10, 'PERCENTAGE')).toBe(90);
  });
  
  it('throws on invalid percentage', () => {
    expect(() => calculateDiscount(100, 110, 'PERCENTAGE')).toThrow();
  });
});
```

## Integration Testing

### tRPC Router Testing
```typescript
import { appRouter } from '@/server/api/root';
import { createInnerTRPCContext } from '@/server/api/trpc';

const caller = appRouter.createCaller(createInnerTRPCContext({
  session: mockSession,
}));

// Test procedure
const result = await caller.course.getById({ id: 'uuid' });
expect(result).toBeDefined();
```

### Database Testing
- Use separate test database
- Run migrations before tests
- Clean up after each test
- Use transactions for isolation

## E2E Testing with Playwright

### Critical Paths to Test
1. User registration and login
2. Course enrollment flow
3. Payment processing
4. Professor course creation
5. Admin dashboard operations
6. Careers profile creation
7. Job application flow

### Playwright Patterns
```typescript
import { test, expect } from '@playwright/test';

test('user can enroll in course', async ({ page }) => {
  await page.goto('/courses');
  await page.click('[data-testid="course-card"]:first-child');
  await page.click('button:has-text("Enroll")');
  await expect(page).toHaveURL(/.*\/checkout/);
});
```

### Test Data Management
- Use factory functions for test data
- Seed database with known states
- Avoid shared mutable state between tests
- Use unique identifiers to prevent conflicts

## Test Organization

### File Structure
```
__tests__/
├── unit/
│   ├── utils/
│   ├── validators/
│   └── services/
├── integration/
│   ├── api/
│   └── db/
└── e2e/
    ├── auth/
    ├── courses/
    └── payments/
```

### Naming Conventions
- Test files: `*.test.ts` or `*.spec.ts`
- Descriptive test names: `it('should reject invalid email format')`
- Group related tests with `describe` blocks

## Coverage Goals
- Unit tests: > 80% coverage
- Integration tests: Cover all API endpoints
- E2E tests: All critical user journeys

## CI/CD Integration
- Run unit tests on every PR
- Run integration tests on PR
- Run E2E tests before deployment
- Fail build on coverage regression

## Testing Checklist
- [ ] Happy path covered
- [ ] Error cases tested
- [ ] Edge cases considered
- [ ] Async operations handled
- [ ] Mocks appropriate and minimal
- [ ] Tests are deterministic
- [ ] No test interdependencies
- [ ] Cleanup in `afterEach`/`afterAll`
