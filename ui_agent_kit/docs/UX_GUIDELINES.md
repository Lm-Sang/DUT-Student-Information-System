# UX_GUIDELINES.md — Interaction, Accessibility, Responsive Behavior

This file owns behavior, not visual styling.

## Interaction
- Primary flows work with keyboard.
- Focus is visible and unobscured; prefer `:focus-visible`.
- Modal focus is trapped and returned appropriately.
- Essential actions are never hover-only.
- Prevent accidental duplicate submissions.
- Confirm destructive actions when recovery is difficult.

## Targets and input
- Match hit targets to visible targets; enlarge tiny hit areas.
- On touch layouts, aim for ~44px targets where practical.
- Mobile text inputs use at least 16px font size.
- Use correct input type, autocomplete, and inputmode.

## Forms
- Persistent labels.
- Explain non-obvious formatting before submission.
- Validate at a useful time.
- Put field errors near the field.
- Preserve entered values after recoverable errors.
- Keep required/optional language consistent.

## Feedback
Relevant async states: idle, loading, success, error, empty.
Use optimistic UI only when rollback is understandable and safe.

## Navigation
- Users know where they are.
- Browser back/forward remains meaningful.
- Deep links should restore expected state when feasible.
- Breadcrumbs are for hierarchy, not decoration.

## Responsive
Prioritize rather than shrink desktop:
- preserve the primary task;
- stack secondary regions before compressing critical content;
- handle tables intentionally;
- avoid horizontal page scrolling;
- keep primary actions reachable.

## Accessibility
- Semantic HTML first.
- Controls have programmatic names.
- Inputs have labels.
- Informative images have alt text; decorative imagery stays quiet.
- Do not rely on color alone.
- Ensure contrast.
- Respect reduced motion.
- Preserve heading hierarchy.
- Prefer native interactive elements.

## Motion
Use motion for continuity, state change, spatial relationship, or feedback.
Avoid decorative motion in repetitive workflows.

## Edge states
Consider: first use, no results, no permission, network failure, partial data, long text, large numbers, slow request, expired session, failed destructive action.

## Performance perception
Avoid layout jumps; reserve space where practical; use skeletons only when they match eventual layout.
