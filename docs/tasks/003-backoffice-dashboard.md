# 003-backoffice-dashboard-tasks

This document outlines the implementation tasks for the Dashboard Enhancement feature, based on RFC 007.

## 🚀 Planning Directive

- **RFC Reading:** `docs/rfc/007-backoffice-dashboard.md` (status: Aprobado)
- **Granularity:** Atomic tasks (Components, Hooks, Services, Tests)
- **Checklist:** Generated in `docs/tasks/003-backoffice-dashboard.md`
- **Validation:** Each task mentions which file should be created/modified.

## 🏗️ Task File Structure

### Phase 1: Foundations (constants, types, schemas, utils)

- [x] **Task 1.1: Create `excluded-users.ts` constant**
  - File: `apps/backoffice/src/core/constants/excluded-users.ts`
  - Acceptance Criteria: File created with `EXCLUDED_USER_IDS` array, filtering `Boolean` and casting to `string[]`.
  - Priority: Must Have

- [x] **Task 1.2: Create `periodFilter.schema.ts` (Zod)**
  - File: `apps/backoffice/src/modules/dashboard/schemas/periodFilter.schema.ts`
  - Acceptance Criteria: Zod schema defined for `period` (enum presets) and `from`/`to` (date strings for custom). Includes `PERIOD_PRESETS` constant and `PeriodPreset` type. Default `this_month` for `period`.
  - Priority: Must Have

- [x] **Task 1.3: Create `types.ts` for Dashboard**
  - File: `apps/backoffice/src/modules/dashboard/types.ts`
  - Acceptance Criteria: Define `DateRangeParams`, `DashboardKpisResult`, `StuckPaidOrder`, `BestSellingProductRow`, `ResolvedDateRange`.
  - Priority: Must Have

- [x] **Task 1.4: Create `period.utils.ts`**
  - File: `apps/backoffice/src/modules/dashboard/utils/period.utils.ts`
  - Acceptance Criteria: File created. Imports `dayjs` and `isoWeek` plugin. `dayjs.locale('es')` configured. Implements `presetToDateRange`, `getPreviousPeriod`, `calculatePercentageChange`.
  - Priority: Must Have

- [x] **Task 1.5: Add `dayjs` and `isoWeek` plugin to `package.json` (if not present)**
  - File: `apps/backoffice/package.json`
  - Acceptance Criteria: `dayjs` and `dayjs/plugin/isoWeek` are listed in dependencies.
  - Priority: Must Have

- [x] **Task 1.6: Unit tests for `period.utils.ts`**
  - File: `apps/backoffice/src/modules/dashboard/utils/period.utils.test.ts`
  - Acceptance Criteria: Tests cover `presetToDateRange` (especially week start/end, custom ranges), `getPreviousPeriod`, and `calculatePercentageChange` edge cases (e.g., division by zero).
  - Priority: Must Have

### Phase 2: Database migration (RPC SQL)

- [x] **Task 2.1: Create SQL migration for `get_best_selling_products` RPC**
  - File: `supabase/migrations/XXXXXX_get_best_selling_products.sql` (replace XXXXXX with timestamp)
  - Acceptance Criteria: SQL function `get_best_selling_products` created with `p_from`, `p_to`, `p_excluded_ids`, `p_limit` parameters. Includes `SECURITY DEFINER` and `SET search_path = public`. Correctly filters by `status = 'completed'`, `created_at` range, `user_id != ALL(p_excluded_ids)`, `pay.provider != 'free'`, and `pay.amount > 0`.
  - Priority: Must Have

- [x] **Task 2.2: Apply database migration**
  - File: N/A (database operation)
  - Acceptance Criteria: Migration successfully applied to the development database.
  - Priority: Must Have

### Phase 3: Data services

- [x] **Task 3.1: Create `getDashboardKpis.ts` service**
  - File: `apps/backoffice/src/core/data/supabase/dashboard/services/getDashboardKpis.ts`
  - Acceptance Criteria: Service created. Fetches revenue and orders count in parallel. Filters by `status = 'completed'`, `payments.provider != 'free'`, `EXCLUDED_USER_IDS`, and `created_at` date range. Returns `DashboardKpisResult`.
  - Priority: Must Have

- [x] **Task 3.2: Create `getStuckPaidOrders.ts` service**
  - File: `apps/backoffice/src/core/data/supabase/dashboard/services/getStuckPaidOrders.ts`
  - Acceptance Criteria: Service created. Fetches orders with `status = 'paid'` and `updated_at` older than `thresholdMinutes`. Returns `StuckPaidOrder[]` including `minutesElapsed`. Does NOT filter by `EXCLUDED_USER_IDS`.
  - Priority: Must Have

- [x] **Task 3.3: Create `getBestSellingProductsForPeriod.ts` service**
  - File: `apps/backoffice/src/core/data/supabase/dashboard/services/getBestSellingProductsForPeriod.ts`
  - Acceptance Criteria: Service created. Calls the `get_best_selling_products` RPC with `p_from`, `p_to`, `EXCLUDED_USER_IDS`, and `p_limit`. Returns `BestSellingProductRow[]`.
  - Priority: Must Have

- [x] **Task 3.4: Create `dashboard.repository.ts`**
  - File: `apps/backoffice/src/core/data/supabase/dashboard/dashboard.repository.ts`
  - Acceptance Criteria: Repository created. Exports `DashboardRepositoryReturn` interface and `DashboardRepository` function, wrapping the new dashboard services. Includes `getKpis`, `getKpisForComparison` (which will call `getKpis` with previous range), `getStuckPaidOrders`, `getBestSellers`.
  - Priority: Must Have

- [x] **Task 3.5: Update `supabase.repository.ts`**
  - File: `apps/backoffice/src/core/data/supabase/supabase.repository.ts`
  - Acceptance Criteria: Imports and integrates `DashboardRepository` into the main `SupabaseRepository`.
  - Priority: Must Have

- [x] **Task 3.6: Update `.env.example` and `.env.local`**
  - File: `apps/backoffice/.env.example`, `apps/backoffice/.env.local`
  - Acceptance Criteria: `EXCLUDED_USER_1` variable added to both files with a placeholder/example UUID.
  - Priority: Must Have

- [x] **Task 3.7: Mark old services as `@deprecated`**
  - File: `apps/backoffice/src/core/data/supabase/orders/services/getTotalSales.ts`
  - File: `apps/backoffice/src/core/data/supabase/orders/services/getTotalOrders.ts`
  - File: `apps/backoffice/src/core/data/supabase/products/services/getBestSellingProducts.ts`
  - Acceptance Criteria: JSDoc `@deprecated` tag added to the relevant functions.
  - Priority: Must Have

### Phase 4: Dumb components

- [x] **Task 4.1: Create `KpiCard.tsx`**
  - File: `apps/backoffice/src/modules/dashboard/components/KpiCard.tsx`
  - Acceptance Criteria: Component created. Accepts `label`, `value`, `icon`, `accent`, `comparison` props. Renders `ComparisonBadge` if `comparison` is provided. Uses `@soybelumont/ui/components/...` for UI elements.
  - Priority: Must Have

- [x] **Task 4.2: Create `KpiCardSkeleton.tsx`**
  - File: `apps/backoffice/src/modules/dashboard/components/KpiCardSkeleton.tsx`
  - Acceptance Criteria: Skeleton component for `KpiCard` created.
  - Priority: Must Have

- [x] **Task 4.3: Create `KpiGrid.tsx`**
  - File: `apps/backoffice/src/modules/dashboard/components/KpiGrid.tsx`
  - Acceptance Criteria: Component created. Renders a responsive grid of `KpiCard` components.
  - Priority: Must Have

- [x] **Task 4.4: Create `ComparisonBadge.tsx`**
  - File: `apps/backoffice/src/modules/dashboard/components/ComparisonBadge.tsx`
  - Acceptance Criteria: Component created. Displays percentage change and label. Handles positive/negative values for styling.
  - Priority: Should Have

- [x] **Task 4.5: Create `PeriodSelector.tsx` (Client Component)**
  - File: `apps/backoffice/src/modules/dashboard/components/PeriodSelector.tsx`
  - Acceptance Criteria: Client component created. Uses `usePeriodSelector` hook. Renders buttons for presets (`Hoy`, `Esta semana`, `Este mes`, `Últimos 7 días`, `Últimos 30 días`, `Personalizado`). Integrates `DateRangePicker` from `modules/orders/components/DateRangePicker.tsx` for custom range. Updates URL via `router.push()` with `useTransition`.
  - Priority: Must Have

- [x] **Task 4.6: Create `AlertCard.tsx`**
  - File: `apps/backoffice/src/modules/dashboard/components/AlertCard.tsx`
  - Acceptance Criteria: Component created. Accepts `orders: StuckPaidOrder[]`. Displays a prominent alert card. Lists order ID, time elapsed, and a link to the order detail page (`/ordenes/[id]`). Uses `@soybelumont/ui/components/...` for UI elements.
  - Priority: Must Have

- [x] **Task 4.7: Create `BestSellersTable.tsx`**
  - File: `apps/backoffice/src/modules/dashboard/components/BestSellersTable.tsx`
  - Acceptance Criteria: Component created. Accepts `rows: BestSellingProductRow[]` and `period` label. Renders a table with Product (linked), Type (badge), and Sales columns. Uses `@soybelumont/ui/components/...` for UI elements.
  - Priority: Must Have

- [x] **Task 4.8: Create `EmptyBestSellers.tsx`**
  - File: `apps/backoffice/src/modules/dashboard/components/EmptyBestSellers.tsx`
  - Acceptance Criteria: Component created. Displays a contextual empty state message when no best sellers are found for the period.
  - Priority: Must Have

### Phase 5: Smart features & orchestration

- [x] **Task 5.1: Create `usePeriodSelector.ts` hook**
  - File: `apps/backoffice/src/modules/dashboard/hooks/usePeriodSelector.ts`
  - Acceptance Criteria: Hook created. Manages reading and writing period to URL search params using `useRouter` and `useSearchParams`.
  - Priority: Must Have

- [x] **Task 5.2: Create `KpiSection.tsx` (RSC)**
  - File: `apps/backoffice/src/modules/dashboard/features/KpiSection.tsx`
  - Acceptance Criteria: RSC created. Fetches current and previous period KPIs in parallel using `Promise.all`. Calculates average ticket and percentage changes. Renders `KpiGrid` with `KpiCard`s (including `ComparisonBadge` if applicable). Wrapped in `Suspense`.
  - Priority: Must Have

- [x] **Task 5.3: Create `AlertCardSection.tsx` (RSC)**
  - File: `apps/backoffice/src/modules/dashboard/features/AlertCardSection.tsx`
  - Acceptance Criteria: RSC created. Fetches stuck paid orders using `getStuckPaidOrders`. Renders `AlertCard` if orders are found, otherwise `null`. Wrapped in `Suspense`.
  - Priority: Must Have

- [x] **Task 5.4: Create `BestSellersSection.tsx` (RSC)**
  - File: `apps/backoffice/src/modules/dashboard/features/BestSellersSection.tsx`
  - Acceptance Criteria: RSC created. Fetches best selling products for the current period. Renders `BestSellersTable` or `EmptyBestSellers` based on results. Wrapped in `Suspense`.
  - Priority: Must Have

- [x] **Task 5.5: Create `DashboardPage.tsx` (RSC)**
  - File: `apps/backoffice/src/modules/dashboard/features/DashboardPage.tsx`
  - Acceptance Criteria: RSC created. Receives `period`, `dateRange`, `previousDateRange`, `totalUsers` as props. Orchestrates `AlertCardSection`, `KpiSection`, `BestSellersSection` using `Suspense` boundaries. Includes inline JSX for greeting and quick actions.
  - Priority: Must Have

- [x] **Task 5.6: Refactor `app/(app)/page.tsx`**
  - File: `apps/backoffice/src/app/(app)/page.tsx`
  - Acceptance Criteria: Modifies the existing page to parse `searchParams` with `periodFilterSchema`, resolve date ranges, fetch `totalUsers`, and pass these props to `DashboardPage`.
  - Priority: Must Have

- [x] **Task 5.7: Add i18n keys**
  - File: `apps/backoffice/src/core/i18n/resources/es.json`
  - Acceptance Criteria: New keys added under `DASHBOARD` for `AVG_TICKET`, period presets, comparison labels, alert card text, and empty best sellers message.
  - Priority: Must Have
