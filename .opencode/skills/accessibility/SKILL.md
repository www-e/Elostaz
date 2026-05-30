---
name: accessibility
description: Use this skill when building UI components, reviewing accessibility, or ensuring WCAG compliance. Covers semantic HTML, ARIA patterns, keyboard navigation, and screen reader support for the Sportology platform.
---

# Accessibility Skill

## WCAG 2.1 AA Compliance

### Core Requirements
- All functionality available via keyboard
- Color contrast ratio >= 4.5:1 for normal text
- Color contrast ratio >= 3:1 for large text
- All images have alt text
- Form inputs have associated labels
- Page has logical heading structure
- Focus indicators are visible

## Semantic HTML

### Patterns
- Use `<button>` for clickable actions, not `<div>`
- Use `<a>` for navigation, not buttons
- Use `<header>`, `<main>`, `<footer>`, `<nav>` for landmarks
- Use `<section>` with headings, not generic divs
- Use lists (`<ul>`, `<ol>`) for grouped items

### shadcn/ui Accessibility
- shadcn components are built on Radix UI (accessible by default)
- Ensure `aria-label` on icon-only buttons
- Verify focus trapping in dialogs
- Test keyboard navigation in dropdowns

## ARIA Patterns

### Common Components
```tsx
// Dialog/Modal
<Dialog>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogDescription>This will delete the course.</DialogDescription>
</Dialog>

// Tabs
<Tabs>
  <TabsList aria-label="Course sections">
    <TabsTrigger value="lessons">Lessons</TabsTrigger>
  </TabsList>
</Tabs>
```

### Dynamic Content
- Use `aria-live` for status updates
- Use `aria-expanded` for collapsible sections
- Use `aria-current` for active navigation item
- Use `role="status"` for toast notifications

## Keyboard Navigation

### Requirements
- All interactive elements focusable
- Logical tab order
- Escape key closes modals
- Arrow keys navigate within widgets
- Enter/Space activates buttons

### Focus Management
- Return focus after modal closes
- Trap focus within modals
- Skip links for main content
- Visible focus indicators

## Forms Accessibility

### Labels and Errors
```tsx
// Always associate label with input
<label htmlFor="email">Email</label>
<input id="email" aria-describedby="email-error" />
{error && <span id="email-error" role="alert">{error}</span>}

// Or use shadcn Label component
<Label htmlFor="email">Email</Label>
<Input id="email" aria-invalid={!!error} />
```

### Validation
- Announce errors to screen readers
- Use `aria-invalid` for invalid fields
- Provide clear error messages
- Allow error correction

## Testing Accessibility

### Automated Tools
- Use `@axe-core/react` in development
- Run Lighthouse accessibility audit
- Use `eslint-plugin-jsx-a11y`

### Manual Testing
- Navigate with keyboard only
- Test with screen reader (NVDA, VoiceOver)
- Verify color contrast with tools
- Test zoom up to 200%

## Media Accessibility

### Images
- Decorative images: `alt=""`
- Informative images: descriptive alt text
- Complex images: long description nearby

### Videos
- Captions for all video content
- Transcripts for audio content
- Audio descriptions when needed
- Accessible player controls

## Accessibility Checklist
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Headings hierarchical
- [ ] ARIA used correctly
- [ ] Screen reader tested
- [ ] Reduced motion respected
- [ ] Touch targets >= 44x44px
