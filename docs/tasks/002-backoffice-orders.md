# 002-backoffice-orders Tasks Checklist

This document outlines the atomic tasks required to implement the `002-backoffice-orders` feature, based on `docs/product/features/002-backoffice-orders.md` (PRD) and `docs/rfc/006-backoffice-orders.md` (RFC).

## Phase 1 — Datos y tipos (sin UI)

- [ ] **TASK-001** [@frontend-coder] Create `OrderFiltersParams` interface and `OrderWithDetails` type for `getAllOrdersWithFilters` — `apps/backoffice/src/modules/orders/types.ts`
- [ ] **TASK-002** [@frontend-coder] Create `OrderDetailExpanded` type for `getOrderByIdExpanded` — `apps/backoffice/src/modules/orders/types.ts`
- [ ] **TASK-003** [@frontend-coder] Create `MpPaymentDetail` type for MercadoPago detail — `apps/backoffice/src/modules/orders/types.ts`
- [ ] **TASK-004** [@frontend-coder] Create `getAllOrdersWithFilters` service with full joins and conditional filters (status, paymentStatus, dateFrom, dateTo, productId) and `count: 'exact'` — `apps/backoffice/src/core/data/supabase/orders/services/getAllOrdersWithFilters.ts`
- [ ] **TASK-005** [@frontend-coder] Implement `clientSearch` logic within `getAllOrdersWithFilters` using two queries (fetch user_ids, then filter orders) — `apps/backoffice/src/core/data/supabase/orders/services/getAllOrdersWithFilters.ts`
- [ ] **TASK-006** [@frontend-coder] Create `getOrderByIdExpanded` service with full joins — `apps/backoffice/src/core/data/supabase/orders/services/getOrderByIdExpanded.ts`
- [ ] **TASK-007** [@frontend-coder] Update `orders.repository.ts` to expose `getAllOrdersWithFilters` and `getOrderByIdExpanded` — `apps/backoffice/src/core/data/supabase/orders/orders.repository.ts`
- [ ] **TASK-008** [@frontend-coder] Define `ORDER_STATUS_VALUES` and `PAYMENT_STATUS_VALUES` constants — `apps/backoffice/src/modules/orders/schemas/orderFilters.schema.ts`
- [ ] **TASK-009** [@frontend-coder] Create `orderFiltersSchema` using Zod for URL search params validation, including `orderId` — `apps/backoffice/src/modules/orders/schemas/orderFilters.schema.ts`
- [ ] **TASK-010** [@frontend-coder] Export `OrderFilters` type from `orderFiltersSchema` — `apps/backoffice/src/modules/orders/schemas/orderFilters.schema.ts`

## Phase 2 — Componentes dumb

- [ ] **TASK-011** [@frontend-coder] Create `OrderStatusBadge.tsx` component with color mapping for order statuses — `apps/backoffice/src/modules/orders/components/OrderStatusBadge.tsx`
- [ ] **TASK-012** [@frontend-coder] Create `PaymentStatusBadge.tsx` component with color mapping for payment statuses — `apps/backoffice/src/modules/orders/components/PaymentStatusBadge.tsx`
- [ ] **TASK-013** [@frontend-coder] Create `OrdersTable.tsx` component to display order data, including badges and clickable rows — `apps/backoffice/src/modules/orders/components/OrdersTable.tsx`
- [ ] **TASK-014** [@frontend-coder] Create `DateRangePicker.tsx` component using shadcn/ui Calendar, supporting `from`, `to`, and `onChange` props — `apps/backoffice/src/modules/orders/components/DateRangePicker.tsx`
- [ ] **TASK-015** [@frontend-coder] Create `OrdersFilters.tsx` component with multi-select for order status, multi-select for payment status, `DateRangePicker`, debounced client search input, product select, and "Clear filters" button — `apps/backoffice/src/modules/orders/components/OrdersFilters.tsx`
- [ ] **TASK-016** [@frontend-coder] Implement `useOrderFilters.ts` hook to manage URL search params for filters — `apps/backoffice/src/modules/orders/hooks/useOrderFilters.ts`
- [ ] **TASK-017** [@frontend-coder] Create `OrdersPagination.tsx` component for navigating between pages — `apps/backoffice/src/modules/orders/components/OrdersPagination.tsx`
- [ ] **TASK-018** [@frontend-coder] Create `PaymentSection.tsx` component to display payment details within order detail — `apps/backoffice/src/modules/orders/components/PaymentSection.tsx`
- [ ] **TASK-019** [@frontend-coder] Create `PromoCodeSection.tsx` component to display promo code details, rendering conditionally — `apps/backoffice/src/modules/orders/components/PromoCodeSection.tsx`
- [ ] **TASK-020** [@frontend-coder] Create `OrderDetailPanel.tsx` component for the Sheet content, laying out product, client, payment, and promo sections — `apps/backoffice/src/modules/orders/components/OrderDetailPanel.tsx`
- [ ] **TASK-021** [@frontend-coder] Create `OrderDetailFull.tsx` component, similar to `OrderDetailPanel.tsx` but optimized for full-page display — `apps/backoffice/src/modules/orders/components/OrderDetailFull.tsx`

## Phase 3 — Integración de página principal

- [ ] **TASK-022** [@frontend-coder] Create `OrdersList.tsx` (RSC) to read searchParams, fetch orders using `getAllOrdersWithFilters`, and render `OrdersFilters`, `OrdersTable`, and `OrdersPagination` — `apps/backoffice/src/modules/orders/features/OrdersList.tsx`
- [ ] **TASK-023** [@frontend-coder] Create `OrdersSheetWrapper.tsx` (Client Component) to read `?orderId` from `useSearchParams()`, find the order in props, control the shadcn Sheet, and render `OrderDetailPanel` — `apps/backoffice/src/modules/orders/features/OrdersSheetWrapper.tsx`
- [ ] **TASK-024** [@frontend-coder] Refactor `app/(app)/ordenes/page.tsx` to use `OrdersList` and pass searchParams — `apps/backoffice/src/app/(app)/ordenes/page.tsx`
- [ ] **TASK-025** [@frontend-coder] Add new i18n keys for orders module to `es.json` — `apps/backoffice/src/core/i18n/resources/es.json`

## Phase 4 — Página de detalle `/ordenes/[id]`

- [ ] **TASK-026** [@frontend-coder] Create `app/(app)/ordenes/[id]/loading.tsx` for the detail page skeleton — `apps/backoffice/src/app/(app)/ordenes/[id]/loading.tsx`
- [ ] **TASK-027** [@frontend-coder] Create `OrderDetailPage.tsx` (Smart RSC) to fetch order details using `getOrderByIdExpanded` and render `OrderDetailFull` — `apps/backoffice/src/modules/orders/features/OrderDetailPage.tsx`
- [ ] **TASK-028** [@frontend-coder] Create `app/(app)/ordenes/[id]/page.tsx` to handle route parameters, call `getOrderByIdExpanded`, and render `OrderDetailPage` — `apps/backoffice/src/app/(app)/ordenes/[id]/page.tsx`

## Phase 5 — Integración MP on-demand

- [ ] **TASK-029** [@frontend-coder] Replicate MercadoPago client (`client.ts`) in backoffice, including environment variables setup — `apps/backoffice/src/core/data/mercadopago/client.ts`
- [ ] **TASK-030** [@frontend-coder] Replicate MercadoPago service (`getPaymentById.ts`) in backoffice — `apps/backoffice/src/core/data/mercadopago/services/getPaymentById.ts`
- [ ] **TASK-031** [@frontend-coder] Create `get-mp-payment-detail.ts` Server Action to call `getPaymentById` — `apps/backoffice/src/modules/orders/actions/get-mp-payment-detail.ts`
- [ ] **TASK-032** [@frontend-coder] Create `MpDetailLoader.tsx` (Client Component) with local state, button, spinner, and logic to call `getMpPaymentDetail` Server Action — `apps/backoffice/src/modules/orders/components/MpDetailLoader.tsx`
- [ ] **TASK-033** [@frontend-coder] Integrate `MpDetailLoader` into `OrderDetailPanel.tsx` (conditional rendering) — `apps/backoffice/src/modules/orders/components/OrderDetailPanel.tsx`
- [ ] **TASK-034** [@frontend-coder] Integrate `MpDetailLoader` into `OrderDetailFull.tsx` (conditional rendering) — `apps/backoffice/src/modules/orders/components/OrderDetailFull.tsx`
