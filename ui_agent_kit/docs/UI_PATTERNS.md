# UI_PATTERNS.md — Approved Composition Patterns

This file documents where and when recurring UI patterns are used.
Appearance comes from `../DESIGN.md`; behavior from `UX_GUIDELINES.md`.

## Application page shell
Stable navigation → page context → page actions → primary content → secondary information.
Do not place a marketing hero in an operational screen.

## Data-heavy page
Prefer table/list, search/filter close to data, persistent query state when useful, intentional pagination/virtualization.
Do not turn every record into a large card unless scanning benefits.

## Dashboard
Use only when users benefit from seeing multiple independent signals.
Every metric must answer a real recurring question.
Do not invent KPI cards.

## Detail page
Identity/status → primary actions → essential details → activity/history → secondary metadata.

## Form page
Short forms usually scan best in one column.
For complex forms, group meaningfully and use progressive disclosure when conditional.

## Search and filters
Search handles free text; filters constrain known dimensions; active filters stay visible; provide clear reset.

## Tabs
Use for peer views of the same object/context, not unrelated product areas.

## Modal
Use for short contextual tasks; do not put long multi-step workflows inside.

## Drawer
Use for secondary details/quick editing/contextual inspection; durable content should have a URL/page.

## Notifications
Inline for local issues; toast for brief non-blocking confirmation; banner for persistent page/system information.

## Reuse rule
Before adding a new pattern: search existing code, reuse/extend if semantics match, document here only if it will recur.
