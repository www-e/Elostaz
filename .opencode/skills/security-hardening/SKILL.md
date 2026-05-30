---
name: security-hardening
description: Use this skill when implementing authentication, authorization, input validation, or reviewing code for security vulnerabilities. Covers OWASP top 10, NextAuth patterns, tRPC security, and data protection.
---

# Security Hardening Skill

## Authentication & Authorization

### NextAuth Patterns
- Always use `getServerSession` in server contexts
- Verify session in tRPC context with `protectedProcedure`
- Implement role-based access with `adminProcedure`
- Never trust client-side role checks alone

### Session Security
- Use secure cookie settings in production
- Implement session rotation on privilege changes
- Set reasonable session expiration
- Store minimal data in JWT/token

## Input Validation

### tRPC/Zod Validation
- Validate ALL inputs with Zod schemas in `src/lib/validators/`
- Use strict schemas with `.strict()` to reject unknown fields
- Implement custom refinements for business logic validation
- Sanitize string inputs to prevent XSS

```typescript
// Good example
const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  price: z.number().min(0).max(100000),
}).strict();
```

### SQL Injection Prevention
- NEVER use raw queries with string concatenation
- Use Prisma's parameterized queries exclusively
- If raw queries are absolutely necessary, use `$queryRaw` with tagged templates

## Authorization Patterns

### tRPC Procedures
```typescript
// Public - no auth required
publicProcedure

// Protected - any authenticated user
protectedProcedure

// Admin - admin role only
adminProcedure

// Role-specific - custom middleware
professorProcedure
studentProcedure
```

### RBAC Implementation
- Check roles in middleware, not just at route level
- Validate resource ownership (e.g., professor owns course)
- Implement fine-grained permissions where needed
- Log authorization failures for security monitoring

## Data Protection

### Sensitive Data
- Hash passwords with bcrypt (never store plain text)
- Encrypt PII at rest where required
- Use environment variables for secrets (never commit .env)
- Implement data retention policies

### API Security
- Rate limit authentication endpoints
- Implement CSRF protection for state-changing operations
- Use HTTPS-only cookies
- Set proper CORS headers

## OWASP Top 10 Checklist
- [ ] Injection (use parameterized queries)
- [ ] Broken Authentication (strong session management)
- [ ] Sensitive Data Exposure (encryption, HTTPS)
- [ ] XML External Entities (avoid XML parsers if possible)
- [ ] Broken Access Control (RBAC, ownership checks)
- [ ] Security Misconfiguration (minimal error info in prod)
- [ ] Cross-Site Scripting (XSS) (sanitize output, CSP headers)
- [ ] Insecure Deserialization (validate all inputs)
- [ ] Using Components with Known Vulnerabilities (keep deps updated)
- [ ] Insufficient Logging and Monitoring (audit sensitive ops)

## Security Review Process
1. Identify all input points (forms, APIs, URL params)
2. Verify validation on every input
3. Check authorization on every endpoint
4. Review data exposure in responses
5. Verify secure handling of secrets
6. Check for SQL injection vulnerabilities
7. Review XSS prevention measures
