---
name: responsive-design
description: Use this skill when implementing responsive layouts, mobile-first designs, or adapting UI for different screen sizes. Covers Tailwind CSS responsive patterns, mobile UX, and shadcn/ui responsive components.
---

# Responsive Design Skill

## Tailwind CSS Responsive Strategy

### Mobile-First Approach
Always start with mobile styles and enhance for larger screens:
```tsx
// Mobile-first: base styles for mobile, then enhance
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">Title</h1>
</div>
```

### Breakpoint Usage
- `sm:` - 640px+ (large phones)
- `md:` - 768px+ (tablets)
- `lg:` - 1024px+ (desktops)
- `xl:` - 1280px+ (large desktops)
- `2xl:` - 1536px+ (extra large)

## Layout Patterns

### Grid Systems
```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Sidebar layout
<div className="flex flex-col lg:flex-row">
  <aside className="w-full lg:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

### Navigation
```tsx
// Mobile: hamburger menu, Desktop: horizontal nav
<nav className="hidden md:flex">...</nav>
<MobileNav className="md:hidden">...</MobileNav>
```

## Component Patterns

### Cards
```tsx
<Card className="w-full max-w-sm mx-auto">
  <CardHeader>
    <CardTitle className="text-lg md:text-xl">Title</CardTitle>
  </CardHeader>
  <CardContent className="p-4 md:p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Tables
```tsx
// Desktop: table, Mobile: cards
<div className="hidden md:block">
  <Table>...</Table>
</div>
<div className="md:hidden space-y-4">
  {data.map(item => <MobileCard key={item.id} {...item} />)}
</div>
```

## Touch Targets

### Minimum Sizes
- Buttons: min 44x44px (48x48px preferred)
- Links: adequate spacing
- Form inputs: comfortable tap targets

```tsx
<Button className="min-h-11 min-w-11">
  Click Me
</Button>
```

## Typography

### Fluid Typography
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Or use clamp for fluid sizing
<h1 className="text-[clamp(1.5rem,4vw,3rem)]">
  Fluid Heading
</h1>
```

## Images

### Responsive Images
```tsx
<Image
  src={src}
  alt={alt}
  width={800}
  height={600}
  className="w-full h-auto object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Forms

### Responsive Forms
```tsx
<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input placeholder="First Name" />
    <Input placeholder="Last Name" />
  </div>
  <div className="flex flex-col sm:flex-row gap-4">
    <Button className="w-full sm:w-auto">Submit</Button>
    <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
  </div>
</form>
```

## Testing Responsive Design

### Browser DevTools
- Test all breakpoints
- Test on actual devices
- Check touch interactions
- Verify scroll behavior

### Common Issues
- Horizontal overflow
- Text truncation
- Overlapping elements
- Touch target sizes
- Font readability

## RTL Support (Arabic)

### Tailwind RTL
```tsx
// Add rtl: variants in tailwind config
<div className="text-left rtl:text-right">
  Arabic text aligns right
</div>

// Use logical properties
<div className="ms-4 me-2"> {/* margin-start, margin-end */}
```

## Performance
- Avoid layout shifts during resize
- Use CSS transforms for animations
- Lazy load below-fold images
- Minimize reflows

## Checklist
- [ ] Mobile-first approach
- [ ] All breakpoints tested
- [ ] Touch targets adequate
- [ ] Readable font sizes
- [ ] No horizontal scroll
- [ ] Images responsive
- [ ] Tables mobile-friendly
- [ ] Forms usable on mobile
- [ ] RTL support where needed
- [ ] Performance acceptable
