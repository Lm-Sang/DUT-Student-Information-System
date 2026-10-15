# REVIEW_CHECKLIST.md — Final UI Audit

Checks only; this file introduces no new rules.

## Product fit
- [ ] One clear primary job
- [ ] Fits `PROJECT_BRIEF.md`
- [ ] No invented facts/metrics
- [ ] Existing terminology preserved

## Visual
- [ ] Colors/typography/spacing/radius/elevation come from `DESIGN.md`
- [ ] Hierarchy works without decoration
- [ ] No unnecessary card nesting
- [ ] No accidental anti-patterns

## Interaction
- [ ] Keyboard flow works
- [ ] Focus-visible is clear
- [ ] No essential hover-only behavior
- [ ] Relevant loading/error/empty/disabled/success states exist
- [ ] Destructive safeguards are appropriate

## Responsive
- [ ] Narrow mobile
- [ ] Typical mobile
- [ ] Tablet/laptop
- [ ] Wide desktop
- [ ] No unintended horizontal page scroll
- [ ] Primary actions reachable

## Accessibility
- [ ] Semantic HTML
- [ ] Accessible names
- [ ] Form labels
- [ ] Contrast
- [ ] Status not color-only
- [ ] Reduced motion respected

## Content
- [ ] Specific action labels
- [ ] Errors explain recovery
- [ ] Empty states explain next steps where needed
- [ ] No unnecessary marketing copy

## Implementation
- [ ] Existing components reused where semantics match
- [ ] No unexplained one-off token values
- [ ] No duplicate pattern introduced
- [ ] Rendered interface visually inspected
