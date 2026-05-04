# RFC-004: Update Primary Color Palette

- **Status**: Proposed
- **Author**: @architect

## Summary

This RFC outlines the plan to change the primary color of the website from Terracotta to Sage Green, refactor all hardcoded color values, and establish a consistent color system.

## Motivation

The client has requested a new primary color. The previous implementation had hardcoded colors and inconsistent theme definitions, which this RFC aims to resolve.

## Technical Details

1.  **Define New Color Palette in `packages/ui/src/styles/globals.css`**:
    - The `--primary` CSS variable will be set to `90 25% 65%` (Sage Green).
    - The `--secondary` CSS variable will be set to `15 45% 55%` (Terracotta).

2.  **Refactor Hardcoded Colors**:
    - Search all `.tsx` files in `apps/web/` for hardcoded `hsl(15, 45%, 55%)` or `#C67B5C`.
    - Replace them with `hsl(var(--secondary))` if the context is for an accent, or `hsl(var(--primary))` if it should be the new main color. The `text-primary` class on the landing page's H1 ("rico") should now use the secondary color.

3.  **Cleanup `apps/web/src/app/globals.css`**:
    - Remove the entire `:root` block that incorrectly redefines `--primary` and other variables. The single source of truth must be `packages/ui/src/styles/globals.css`.

## Impact

This change will affect the visual identity of the web web application. It will centralize color management, making future theme changes easier and ensuring consistency.
