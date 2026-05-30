---
name: code-review
description: Use this skill when reviewing code for quality, maintainability, and adherence to project standards. Provides structured review checklists and best practices for TypeScript, React, and Next.js code.
---

# Code Review Skill

## Review Process

### 1. Understand Context
- Read the PR description and linked issues
- Understand the business requirements
- Check if tests are included
- Verify the scope is appropriate

### 2. Architecture Review
- Check separation of concerns
- Verify API contracts match frontend needs
- Ensure database changes are backward compatible
- Validate error handling coverage

### 3. Code Quality Checklist

#### TypeScript
- [ ] Strict mode compliance (no `any` without justification)
- [ ] Proper typing of function parameters and returns
- [ ] Use of discriminated unions where appropriate
- [ ] No unused variables or imports
- [ ] Proper use of `const` vs `let`

#### React/Next.js
- [ ] Server Components used by default
- [ ] `'use client'` only when necessary
- [ ] Proper hook dependencies in `useEffect`
- [ ] No prop drilling (use composition or context)
- [ ] Key props used correctly in lists
- [ ] Event handlers properly typed

#### Styling
- [ ] Tailwind classes organized logically
- [ ] `cn()` utility used for conditional classes
- [ ] Responsive design considered
- [ ] Dark mode support if applicable
- [ ] No inline styles (use Tailwind)

### 4. Performance Review
- [ ] No unnecessary re-renders
- [ ] Images optimized with `next/image`
- [ ] Large components lazy loaded
- [ ] Database queries optimized
- [ ] N+1 queries eliminated

### 5. Security Review
- [ ] Input validation present
- [ ] Authorization checks in place
- [ ] No sensitive data in responses
- [ ] Secrets not hardcoded
- [ ] XSS prevention measures

### 6. Testing Review
- [ ] Unit tests for business logic
- [ ] Integration tests for APIs
- [ ] Component tests for UI
- [ ] Edge cases covered
- [ ] Tests are deterministic

## Feedback Guidelines

### Constructive Feedback Format
```
**[Category]**: [Observation]
**Impact**: [Severity - Critical/Important/Suggestion]
**Suggestion**: [Specific improvement with example if helpful]
**Rationale**: [Why this matters]
```

### Example
```
**[Performance]**: The course list fetches all enrollments without pagination
**Impact**: Important - could cause timeout with 1000+ enrollments
**Suggestion**: Implement cursor-based pagination with limit/offset
**Rationale**: Keeps API response times under 200ms and reduces memory usage
```

## Common Issues to Catch
1. Missing error boundaries
2. Race conditions in async operations
3. Memory leaks from unsubscribed listeners
4. Accessibility violations (missing labels, low contrast)
5. Hardcoded strings that should be internationalized
6. Magic numbers without constants
7. Deep nesting (>3 levels) indicating need for refactoring

## Approval Criteria
- All Critical issues resolved
- Important issues addressed or documented
- Tests passing
- Build successful (`pnpm run build:strict`)
- No TypeScript errors
