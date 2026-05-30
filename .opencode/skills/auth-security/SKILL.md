---
name: auth-security
description: Use this skill when implementing authentication flows, session management, role-based access control, or password handling. Covers NextAuth patterns, tRPC auth context, and secure session management.
---

# Auth & Security Skill

## NextAuth Configuration

### Session Strategy
- Use JWT strategy for serverless (Vercel)
- Use database strategy for session revocation
- Implement session callbacks for role inclusion

```typescript
// src/server/auth.ts
callbacks: {
  session: ({ session, token }) => ({
    ...session,
    user: {
      ...session.user,
      id: token.sub,
      role: token.role,
    },
  }),
  jwt: ({ token, user }) => {
    if (user) {
      token.role = user.role;
    }
    return token;
  },
},
```

## tRPC Auth Context

### Context Builder
```typescript
// src/server/api/trpc.ts
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(req, res, authOptions);
  
  return {
    session,
    db,
  };
};
```

### Protected Procedures
```typescript
// Middleware for auth check
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
```

### Role-Based Procedures
```typescript
const enforceAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(enforceAdmin);
```

## Password Security

### Hashing
- Always use bcrypt with salt rounds >= 10
- Never store plain text passwords
- Never log passwords

```typescript
import bcrypt from 'bcryptjs';

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
```

## Authorization Patterns

### Resource Ownership
```typescript
// Verify user owns the resource
const course = await db.course.findUnique({
  where: { id: input.courseId },
});

if (!course) throw new TRPCError({ code: 'NOT_FOUND' });
if (course.professorId !== ctx.session.user.id) {
  throw new TRPCError({ code: 'FORBIDDEN' });
}
```

### Role Hierarchy
```typescript
const ROLES = ['STUDENT', 'PROFESSOR', 'ADMIN'] as const;

type Role = typeof ROLES[number];

const hasRole = (userRole: Role, requiredRole: Role) => {
  return ROLES.indexOf(userRole) >= ROLES.indexOf(requiredRole);
};
```

## Secure Routes

### Middleware Pattern
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  const pathname = request.nextUrl.pathname;
  
  // Protect admin routes
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### Client-Side Guards
```typescript
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Loading />;
  if (session?.user.role !== 'ADMIN') redirect('/');
  
  return <AdminDashboard />;
}
```

## API Security

### Rate Limiting
- Implement rate limiting on auth endpoints
- Use Redis or in-memory store
- Return 429 status with Retry-After header

### CSRF Protection
- NextAuth handles CSRF tokens
- Validate origin headers for state-changing requests
- Use SameSite cookie attributes

## Session Management

### Best Practices
- Set reasonable session expiration
- Implement session rotation
- Allow session revocation
- Store minimal data in session

## Security Checklist
- [ ] Passwords hashed with bcrypt
- [ ] Sessions validated on every request
- [ ] Role checks in middleware
- [ ] Resource ownership verified
- [ ] Rate limiting implemented
- [ ] CSRF protection active
- [ ] Secure cookie settings
- [ ] No sensitive data in JWT
- [ ] Session expiration configured
- [ ] Audit logging for auth events
