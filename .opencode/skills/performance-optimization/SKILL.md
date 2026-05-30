---
name: performance-optimization
description: Use this skill when optimizing application performance, analyzing Core Web Vitals, reducing bundle size, or improving database query performance for the Sportology Next.js application.
---

# Performance Optimization Skill

## Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID/INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms
- **FCP** (First Contentful Paint): < 1.8s

## Next.js Performance

### Image Optimization
- Always use `next/image` for images
- Specify `width` and `height` to prevent layout shift
- Use `priority` for above-the-fold images
- Implement blur placeholders for better perceived performance

### Font Optimization
- Use `next/font` for Google/Custom fonts
- Implement font-display: swap
- Preload critical font subsets

### Code Splitting
- Use dynamic imports for heavy components
- Split large libraries (video players, charts, PDF generators)
- Implement route-based code splitting

```typescript
// Good example
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
  loading: () => <VideoSkeleton />
});
```

### Server Components
- Use Server Components by default
- Move data fetching to Server Components
- Keep Client Components minimal and leaf-node
- Use React `cache()` for deduplicated requests

## Database Performance

### Query Optimization
- Select only needed fields
- Use pagination for large lists (cursor-based preferred)
- Add database indexes for frequent queries
- Use `EXPLAIN ANALYZE` to debug slow queries
- Implement query result caching with React Query

### Caching Strategy
- Use Next.js `fetch` cache for API calls
- Implement Redis caching for expensive computations
- Use React Query stale-while-revalidate pattern
- Cache Prisma queries with appropriate TTL

## Bundle Optimization

### Analysis
- Run `pnpm run build:analyze` to analyze bundle
- Identify large dependencies
- Look for duplicate packages

### Optimization Techniques
- Tree-shake unused code
- Use `babel-plugin-react-compiler` for optimization
- Minimize client-side JavaScript
- Use `critters` for critical CSS extraction
- Implement module/nomodule pattern for modern browsers

## React Performance

### Rendering Optimization
- Use `React.memo` for expensive pure components
- Implement `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Virtualize long lists with `react-window` or similar

### State Management
- Keep state close to where it's used
- Use URL state for shareable filters
- Implement optimistic updates for better UX
- Avoid prop drilling with composition

## Network Optimization
- Implement HTTP/2 server push where applicable
- Use CDN for static assets (BunnyCDN already configured)
- Enable gzip/brotli compression
- Implement service worker for offline capability
- Use `preload` and `prefetch` strategically

## Monitoring
- Use Vercel Analytics for Web Vitals
- Implement custom performance metrics logging
- Set up alerts for performance degradation
- Monitor API response times in tRPC
