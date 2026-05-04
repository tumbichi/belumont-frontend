# Task Checklist: Update Color Palette

This document outlines the tasks required to update the primary color palette of the website from Terracotta to Sage Green, refactor hardcoded color values, and establish a consistent color system, as per RFC-004.

## 🚀 Planning Directive

- [ ] **Infrastructure:** (Database, API, Services)
- [ ] **Core Logic:** (Business Rules, Utils)
- [ ] **UI Layer:** (Smart Features, Dumb Components)
- [ ] **Verification:** (Unit Tests, E2E Tests)

---

## 🏗️ Tasks

### 1. Define New Color Palette

- [ ] **Modify `packages/ui/src/styles/globals.css`**:
  - [ ] Set `--primary` CSS variable to `90 25% 65%` (Sage Green).
  - [ ] Set `--secondary` CSS variable to `15 45% 55%` (Terracotta).

### 2. Refactor Hardcoded Colors

- [ ] **Search and Replace Hardcoded Colors in `apps/web/**/\*.tsx`\*\*:
  - Search for `hsl(15, 45%, 55%)` or `#C67B5C`.
  - Replace with `hsl(var(--secondary))` for accent contexts.
  - Replace with `hsl(var(--primary))` for new main color contexts.
  - **Specific Files to Check:**
    - [ ] `apps/web/src/app/page.tsx`
    - [ ] `apps/web/src/app/components/AnimatedAbout.tsx`
    - [ ] `apps/web/src/core/components/header.tsx`
    - [ ] `apps/web/src/app/recetarios/page.tsx`
    - [ ] `apps/web/src/app/components/AnimatedProducts.tsx`
    - [ ] `apps/web/src/app/components/CTASection.tsx`
    - [ ] `apps/web/src/core/components/footer.tsx`
    - [ ] `apps/web/src/app/layout.tsx`
    - [ ] `apps/web/src/core/emails/PackDelivery.tsx`
    - [ ] `apps/web/src/core/emails/ProductDelivery.tsx`
    - [ ] `apps/web/src/modules/products/components/ProductGallery.tsx`
    - [ ] `apps/web/src/modules/products/components/ProductDetail.tsx`
    - [ ] `apps/web/src/modules/products/components/ProductCard.tsx`
    - [ ] `apps/web/src/modules/payments/components/OrderSummary.tsx`
    - [ ] `apps/web/src/app/global-error.tsx`
    - [ ] `apps/web/src/app/recetarios/error.tsx`
    - [ ] `apps/web/src/app/recetarios/[pathname]/page.tsx`
    - [ ] `apps/web/src/app/error.tsx`
    - [ ] `apps/web/src/modules/payments/components/Checkout.tsx`
    - [ ] `apps/web/src/modules/payments/components/Payment.tsx`
    - [ ] `apps/web/src/modules/payments/layout/CheckoutLayout.tsx`
    - [ ] `apps/web/src/app/detalle-de-compra/page.tsx`
    - [ ] `apps/web/src/core/components/toaster.tsx`
    - [ ] `apps/web/src/core/components/confetti.tsx`
    - [ ] `apps/web/src/core/components/confetti-side-cannons.tsx`
    - [ ] `apps/web/src/app/pago/exitoso/page.tsx`
    - [ ] `apps/web/src/app/privacy/page.tsx`
    - [ ] `apps/web/src/app/loading.tsx`
  - [ ] **Landing Page H1 Update**: Ensure the `text-primary` class on the landing page's H1 ("rico") now uses the secondary color. (File: `apps/web/src/app/page.tsx`)

### 3. Cleanup Global CSS

- [ ] **Remove `:root` block from `apps/web/src/app/globals.css`**:
  - [ ] Delete the entire `:root` block that redefines color variables.

### 4. Verification

- [ ] **Visual Regression Testing**:
  - [ ] Run visual regression tests to ensure no unintended visual changes.
- [ ] **Manual Review**:
  - [ ] Manually review key pages to confirm the new color palette is applied correctly and consistently.
