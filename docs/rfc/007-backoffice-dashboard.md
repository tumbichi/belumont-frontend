# RFC 007 — Dashboard con Filtro de Fechas y KPIs Mejorados (Backoffice)

**Feature:** `003-backoffice-dashboard`  
**Estado:** Aprobado  
**Fecha:** Mayo 2026  
**Autor:** Arquitectura  
**PRD:** `docs/product/features/003-backoffice-dashboard.md`

---

## 1. Resumen

Evolucionar el Dashboard del backoffice de un panel de métricas all-time a un centro de comando operativo con filtro de período de tiempo, cuatro KPIs (incluyendo Ticket Promedio nuevo), comparación vs período anterior, alerta de órdenes bloqueadas en `paid`, y tabla de best sellers filtrada — todo DB-side.

Cambios principales:

- Nuevo módulo `src/modules/dashboard/` (Smart/Dumb split, hooks, schemas, tipos)
- Nuevos servicios en `core/data/supabase/dashboard/services/` con soporte de date range y EXCLUDED_USER_IDS
- Refactor de `getBestSellingProducts` de client-side grouping a agregación en DB via RPC de Postgres
- Refactor de `getTotalSales` y `getTotalOrders` para aceptar `DateRangeParams` y `EXCLUDED_USER_IDS`
- Selector de período URL-driven (searchParams) con presets + rango personalizado
- Alert Card para órdenes bloqueadas en `paid` > 10 minutos
- Badges de comparación porcentual vs período equivalente anterior (Should Have)
- Reutilización del `DateRangePicker` existente en `modules/orders/components/`
- Página existente `app/(app)/page.tsx` no cambia de ruta

---

## 2. Arquitectura General — Árbol de Directorios

```
apps/backoffice/src/
│
├── app/(app)/
│   └── page.tsx                              # RSC: lee searchParams → DashboardPage feature
│
├── core/
│   ├── constants/
│   │   └── excluded-users.ts                 # NUEVO: EXCLUDED_USER_IDS = [process.env.EXCLUDED_USER_1]
│   │
│   └── data/
│       └── supabase/
│           ├── dashboard/                     # NUEVO sub-dominio
│           │   └── services/
│           │       ├── getDashboardKpis.ts    # NUEVO: revenue + orders en un solo RPC call
│           │       ├── getStuckPaidOrders.ts  # NUEVO: órdenes en paid > 10 min
│           │       └── getBestSellingProductsForPeriod.ts  # NUEVO: reemplaza el client-side grouping
│           │
│           ├── orders/
│           │   └── services/
│           │       ├── getTotalSales.ts       # MODIFICAR: añadir DateRangeParams + EXCLUDED_USER_IDS + fix status
│           │       └── getTotalOrders.ts      # MODIFICAR: añadir DateRangeParams + EXCLUDED_USER_IDS + fix status
│           │
│           ├── products/
│           │   └── services/
│           │       └── getBestSellingProducts.ts  # DEPRECAR — mantener para compatibilidad, marcar @deprecated
│           │
│           └── supabase.repository.ts        # MODIFICAR: añadir dashboard repository
│
└── modules/dashboard/
    ├── components/                            # Dumb components (sin lógica de negocio)
    │   ├── KpiCard.tsx                        # Tarjeta de KPI individual (valor + label + icono + badge)
    │   ├── KpiGrid.tsx                        # Grid de 4 tarjetas (layout responsive)
    │   ├── KpiCardSkeleton.tsx                # Skeleton para estado de carga (RF-11)
    │   ├── PeriodSelector.tsx                 # Botones de presets + trigger de rango personalizado [Client]
    │   ├── ComparisonBadge.tsx                # Badge "↑ 12% vs anterior" (Should Have)
    │   ├── AlertCard.tsx                      # Tarjeta de alerta de órdenes bloqueadas
    │   ├── BestSellersTable.tsx               # Tabla de productos más vendidos (dumb — recibe rows)
    │   └── EmptyBestSellers.tsx               # Estado vacío contextual al período
    │
    ├── features/                              # Smart components (orquestan datos + estado)
    │   ├── DashboardPage.tsx                  # RSC: orquesta todos los fetch en paralelo
    │   ├── KpiSection.tsx                     # RSC: fetch KPIs, calcula avg ticket, renderiza KpiGrid
    │   ├── AlertCardSection.tsx               # RSC: fetch stuck orders, renderiza AlertCard o null
    │   └── BestSellersSection.tsx             # RSC: fetch best sellers, renderiza tabla
    │
    ├── hooks/
    │   └── usePeriodSelector.ts               # Hook cliente: lee/escribe período en URL via router.push()
    │
    ├── schemas/
    │   └── periodFilter.schema.ts             # Zod: valida searchParams del período
    │
    ├── utils/
    │   └── period.utils.ts                    # Helpers: presetToDateRange(), getPreviousPeriod()
    │
    └── types.ts                               # DashboardKpis, BestSellingProductRow, StuckPaidOrder, PeriodPreset
```

---

## 3. Capa de Datos

### 3.1 Constante `EXCLUDED_USER_IDS`

```typescript
// apps/backoffice/src/core/constants/excluded-users.ts

export const EXCLUDED_USER_IDS: string[] = [process.env.EXCLUDED_USER_1].filter(
  Boolean
) as string[];
```

Variable de entorno requerida en `apps/backoffice/.env.local`:

```
EXCLUDED_USER_1=ae7a0185-aa7c-4b87-b676-70a52d4be528
```

> **Decisión:** La constante filtra valores `undefined` con `.filter(Boolean)`. Si la variable no está definida en un entorno, la exclusión no se aplica — comportamiento seguro. Nunca hardcodear UUIDs en servicios.

### 3.2 Tipo compartido `DateRangeParams`

```typescript
// modules/dashboard/types.ts (también puede vivir en core/types si se reutiliza)

export interface DateRangeParams {
  from: string; // ISO date string YYYY-MM-DD (inclusive)
  to: string; // ISO date string YYYY-MM-DD (inclusive)
}
```

### 3.3 `getDashboardKpis` — Nuevo servicio de KPIs con date range

> **Decisión de arquitectura — Queries paralelas vs RPC agregado:**  
> Se opta por **dos queries paralelas separadas** (revenue + orders count) en lugar de un RPC de Postgres agregado.
>
> **Justificación:** Supabase PostgREST soporta filtros de fecha nativos con `.gte()` / `.lte()`. Una función RPC requeriría mantener una migración de DB adicional para lo que son queries simples. Con `Promise.all()` la latencia es idéntica. Si en el futuro se necesita un único round-trip, la migración a RPC es un cambio de implementación interno sin impacto en la API del módulo.

```typescript
// core/data/supabase/dashboard/services/getDashboardKpis.ts

export interface DashboardKpisParams extends DateRangeParams {}

export interface DashboardKpisResult {
  revenue: number; // suma de payments.amount (completed, non-free)
  orders: number; // count de orders (completed)
}

export default async function getDashboardKpis(
  params: DashboardKpisParams
): Promise<DashboardKpisResult>;
```

**Query de revenue** (reemplaza `getTotalSales`):

```typescript
supabase
  .from('orders')
  .select('payments!inner(amount, provider)')
  .eq('status', 'completed')
  .neq('payments.provider', 'free')
  .not('user_id', 'in', `(${EXCLUDED_USER_IDS.join(',')})`)
  .gte('created_at', `${params.from}T00:00:00.000Z`)
  .lte('created_at', `${params.to}T23:59:59.999Z`);
```

> **Nota sobre el bug actual:** `getTotalSales` incluye `status = 'paid'` junto con `'completed'`. Según RN-01 confirmado (PQ-04), solo `completed` cuenta para ingresos. **Este bug se corrige silenciosamente** en `getDashboardKpis` — sin compatibilidad hacia atrás para el valor anterior.

**Query de orders count:**

```typescript
supabase
  .from('orders')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'completed')
  .not('user_id', 'in', `(${EXCLUDED_USER_IDS.join(',')})`)
  .gte('created_at', `${params.from}T00:00:00.000Z`)
  .lte('created_at', `${params.to}T23:59:59.999Z`);
```

> **Nota sobre el bug actual:** `getTotalOrders` no filtra por `status = 'completed'` ni excluye `EXCLUDED_USER_IDS`. Ambos se corrigen en `getDashboardKpis`.

**Ticket promedio:** Se calcula en el Smart component, no en el servicio:

```typescript
const avgTicket = kpis.orders > 0 ? Math.round(kpis.revenue / kpis.orders) : 0;
```

### 3.4 `getStuckPaidOrders` — Alerta de órdenes bloqueadas

```typescript
// core/data/supabase/dashboard/services/getStuckPaidOrders.ts

export interface StuckPaidOrder {
  id: string;
  updated_at: string; // ISO timestamp — momento en que la orden cambió a `paid` (TQ-02 resuelto)
  minutesElapsed: number; // calculado en el servicio (Date.now() - updated_at)
}

export default async function getStuckPaidOrders(
  thresholdMinutes = 10
): Promise<StuckPaidOrder[]>;
```

**Query:**

```typescript
const cutoff = new Date(
  Date.now() - thresholdMinutes * 60 * 1000
).toISOString();

supabase
  .from('orders')
  .select('id, updated_at')
  .eq('status', 'paid')
  .lte('updated_at', cutoff) // updated_at <= hace 10 minutos (TQ-02: momento en que pasó a paid)
  .order('updated_at', { ascending: true });
```

> **Decisión (TQ-02 resuelto):** Se usa `updated_at` como timestamp del momento en que la orden entró en `paid`, ya que `created_at` refleja la creación de la orden (no el cambio de estado). El filtro `updated_at <= now() - 10min` identifica correctamente las órdenes que llevan más de 10 minutos en `paid` sin procesarse. Si en el futuro se agrega un campo `paid_at` dedicado, la query se actualiza aquí sin impacto en la UI.

> **No filtrar por `EXCLUDED_USER_IDS`:** La alerta debe mostrar cualquier orden bloqueada, incluyendo las de usuarios de prueba, para no ocultar problemas operativos reales durante el desarrollo.

### 3.5 `getBestSellingProductsForPeriod` — Agregación DB-side (reemplaza client-side grouping)

> **Decisión crítica — Migrar a RPC de Postgres:**  
> El `getBestSellingProducts` actual trae **todas** las órdenes completadas y agrupa client-side. Con crecimiento del negocio esto escala O(n) en memoria. La solución es un RPC de Postgres que haga el `GROUP BY` en DB.

**Función RPC de Postgres requerida:**

```sql
-- Migración: supabase/migrations/XXXXXX_get_best_selling_products.sql

CREATE OR REPLACE FUNCTION get_best_selling_products(
  p_from        TIMESTAMPTZ,
  p_to          TIMESTAMPTZ,
  p_excluded_ids UUID[],
  p_limit       INT DEFAULT 5
)
RETURNS TABLE (
  product_id    UUID,
  product_name  TEXT,
  product_type  TEXT,
  sales_count   BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER  -- TQ-03: RLS habilitado en orders/payments — necesario para bypass con service_role
SET search_path = public
AS $$
  SELECT
    o.product_id,
    p.name        AS product_name,
    p.product_type::TEXT,
    COUNT(*)      AS sales_count
  FROM orders o
  JOIN products p ON p.id = o.product_id
  JOIN payments pay ON pay.id = o.payment_id
  WHERE
    o.status = 'completed'
    AND o.created_at >= p_from
    AND o.created_at <= p_to
    AND o.user_id != ALL(p_excluded_ids)
    AND pay.provider != 'free'
    AND pay.amount > 0           -- RN-09: excluir precio final $0 (descuento 100%)
  GROUP BY o.product_id, p.name, p.product_type
  ORDER BY sales_count DESC
  LIMIT p_limit;
$$;
```

> **Sobre RN-09 (exclusión de precio final $0):** La condición `pay.amount > 0` implementa la regla de negocio. Esto excluye órdenes donde el pago fue procesado pero con monto $0 (promo 100%). Si el `provider = 'free'` ya está excluido, el `amount > 0` actúa como red de seguridad adicional para descuentos 100% en proveedores reales.

```typescript
// core/data/supabase/dashboard/services/getBestSellingProductsForPeriod.ts

export interface BestSellingProductRow {
  product_id: string;
  product_name: string;
  product_type: string;
  sales_count: number;
}

export interface BestSellingProductsParams extends DateRangeParams {
  limit?: number;
}

export default async function getBestSellingProductsForPeriod(
  params: BestSellingProductsParams
): Promise<BestSellingProductRow[]> {
  const { data, error } = await supabase.rpc('get_best_selling_products', {
    p_from: `${params.from}T00:00:00.000Z`,
    p_to: `${params.to}T23:59:59.999Z`,
    p_excluded_ids: EXCLUDED_USER_IDS,
    p_limit: params.limit ?? 5,
  });
  // ...
}
```

### 3.6 Modificar `getTotalSales` y `getTotalOrders` (backward-compatible)

Los servicios existentes se mantienen sin parámetros para no romper código que los consume. Los nuevos servicios de dashboard son independientes.

> **Decisión:** No modificar las firmas de `getTotalSales` / `getTotalOrders`. El nuevo `getDashboardKpis` los reemplaza funcionalmente. Los servicios legacy se marcan `@deprecated` en JSDoc una vez que la página migre.

### 3.7 Actualizar `supabase.repository.ts`

```typescript
// Agregar dashboard repository
import {
  DashboardRepository,
  DashboardRepositoryReturn,
} from './dashboard/dashboard.repository';

interface SupabaseRepositoryReturn {
  // ...existentes...
  dashboard: DashboardRepositoryReturn;
}

const SupabaseRepository = (): SupabaseRepositoryReturn => ({
  // ...existentes...
  dashboard: DashboardRepository(),
});
```

```typescript
// core/data/supabase/dashboard/dashboard.repository.ts

export interface DashboardRepositoryReturn {
  getKpis: (params: DashboardKpisParams) => Promise<DashboardKpisResult>;
  getKpisForComparison: (
    params: DashboardKpisParams
  ) => Promise<DashboardKpisResult>;
  getStuckPaidOrders: (thresholdMinutes?: number) => Promise<StuckPaidOrder[]>;
  getBestSellers: (
    params: BestSellingProductsParams
  ) => Promise<BestSellingProductRow[]>;
}
```

---

## 4. Arquitectura de Componentes

### 4.1 Página principal `/` — Árbol de renderizado

```
app/(app)/page.tsx  [RSC]
  └── modules/dashboard/features/DashboardPage.tsx  [RSC]
        │
        ├── Greeting (inline JSX — no component needed)
        │
        ├── modules/dashboard/features/AlertCardSection.tsx  [RSC — Suspense boundary]
        │     Fetch: getStuckPaidOrders()
        │     → modules/dashboard/components/AlertCard.tsx  [Dumb] (si hay órdenes)
        │     → null (si no hay órdenes)  ← RF-18: no reservar espacio
        │
        ├── modules/dashboard/components/PeriodSelector.tsx  [Client]
        │     Lee período de searchParams (prop), emite cambios de URL via router.push()
        │     Abre DateRangePicker para "Personalizado"
        │
        ├── modules/dashboard/features/KpiSection.tsx  [RSC — Suspense boundary]
        │     Fetch paralelo: getKpis(currentPeriod) + getKpis(previousPeriod) [Should Have]
        │     Calcula: avgTicket = revenue / orders
        │     → modules/dashboard/components/KpiGrid.tsx  [Dumb]
        │           → modules/dashboard/components/KpiCard.tsx × 4  [Dumb]
        │                 → modules/dashboard/components/ComparisonBadge.tsx  [Dumb, Should Have]
        │
        ├── Quick actions (inline JSX — sin cambios)
        │
        └── modules/dashboard/features/BestSellersSection.tsx  [RSC — Suspense boundary]
              Fetch: getBestSellers(currentPeriod)
              → modules/dashboard/components/BestSellersTable.tsx  [Dumb]
              → modules/dashboard/components/EmptyBestSellers.tsx  [Dumb] (si vacío)
```

### 4.2 `DashboardPage.tsx` — Smart RSC (feature)

```typescript
// modules/dashboard/features/DashboardPage.tsx
// RSC puro — recibe el período parseado como prop desde page.tsx

import { Suspense } from 'react';
import { PeriodFilter } from '@modules/dashboard/schemas/periodFilter.schema';
import { ResolvedDateRange } from '@modules/dashboard/types';

interface DashboardPageProps {
  period: PeriodFilter; // ya parseado por Zod en page.tsx
  dateRange: ResolvedDateRange; // from/to calculados por presetToDateRange()
  previousDateRange: ResolvedDateRange; // para comparación
  totalUsers: number; // all-time — fetcheado en page.tsx
}
```

> **Por qué `totalUsers` en `page.tsx`:** Total de usuarios es all-time (RN-06), sin date range, y es un dato trivial que no justifica su propio Suspense boundary. Se fetch junto con los parámetros de la página.

### 4.3 `PeriodSelector.tsx` — Client Component

```typescript
'use client';

interface PeriodSelectorProps {
  activePeriod: PeriodPreset; // recibido como prop desde el RSC padre
  customFrom?: string; // YYYY-MM-DD
  customTo?: string; // YYYY-MM-DD
}
```

Al seleccionar preset: `router.push('/?period=this_week')` con `useTransition` para feedback visual.  
Al seleccionar "Personalizado" y completar el range: `router.push('/?from=2026-05-01&to=2026-05-07')`.

**No mantiene estado local del período** — la URL es la fuente de verdad. Al recibir las props, el componente sabe qué botón está activo.

### 4.4 `KpiCard.tsx` — Dumb Component

```typescript
interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
  comparison?: {
    percentage: number; // positivo = subida, negativo = bajada
    label: string; // "vs semana anterior", "vs ayer", etc.
  };
}
```

`ComparisonBadge` se renderiza como hijo si `comparison` está presente (Should Have — no bloquea v1 Must Have).

### 4.5 `AlertCard.tsx` — Dumb Component

```typescript
interface AlertCardProps {
  orders: StuckPaidOrder[]; // siempre length >= 1 (el padre no renderiza si está vacío)
}
```

Renderiza una card con estilo de alerta (destructive/warning) listando cada orden con:

- ID de la orden (truncado)
- Tiempo transcurrido: `hace X min` (calculado desde `minutesElapsed`)
- Link a `/ordenes/[id]` (ruta de detalle existente del RFC 006)

### 4.6 `BestSellersTable.tsx` — Dumb Component

```typescript
interface BestSellersTableProps {
  rows: BestSellingProductRow[];
  period: string; // label del período, ej. "esta semana" — para estado vacío contextual
}
```

Columnas: Producto (link a `/productos/[id]`) | Tipo (Badge) | Ventas (número).

### 4.7 Reutilización de `DateRangePicker`

El `DateRangePicker` existente en `modules/orders/components/DateRangePicker.tsx` se usa **directamente** dentro de `PeriodSelector.tsx` del módulo dashboard.

```typescript
// modules/dashboard/components/PeriodSelector.tsx
import { DateRangePicker } from '@modules/orders/components/DateRangePicker';
```

> **Decisión — No mover a `packages/ui`:** El `DateRangePicker` tiene lógica específica de la app (locale `es-AR`, max date = hoy, formato de label). Moverlo a `packages/ui` lo haría genérico y requeriría pasar props adicionales. La importación cross-module es aceptable dentro de la misma app. Documentar como deuda técnica para una futura extracción si se necesita en `apps/web`.

---

## 5. Lógica de Período — URL Schema y Utilidades

### 5.1 Schema Zod de searchParams

```typescript
// modules/dashboard/schemas/periodFilter.schema.ts
import { z } from 'zod';

export const PERIOD_PRESETS = [
  'today',
  'this_week',
  'this_month',
  'last_7_days', // Should Have (RF-06)
  'last_30_days', // Should Have (RF-06)
  'custom',
] as const;

export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

export const periodFilterSchema = z.union([
  z.object({
    period: z.enum(PERIOD_PRESETS).default('this_month'),
    from: z.undefined(),
    to: z.undefined(),
  }),
  z.object({
    period: z.literal('custom'),
    from: z.string().date(), // YYYY-MM-DD
    to: z.string().date(), // YYYY-MM-DD
  }),
]);

export type PeriodFilter = z.infer<typeof periodFilterSchema>;
```

**Serialización en URL:**

```
/?period=today
/?period=this_week
/?period=this_month
/?period=last_7_days
/?period=last_30_days
/?from=2026-05-01&to=2026-05-07     ← custom (period=custom implícito si from+to presentes)
```

> **Decisión:** Si solo se proveen `from` y `to` sin `period`, el schema los acepta como `custom`. Si no hay ningún parámetro, el default es `this_month` (RF-05).

### 5.2 Utilidades de período

```typescript
// modules/dashboard/utils/period.utils.ts

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'; // semana ISO: lunes=1 (PQ-02 resuelto)
import 'dayjs/locale/es';

dayjs.extend(isoWeek);
dayjs.locale('es');

export interface ResolvedDateRange {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  label: string; // Etiqueta humanizada, ej. "esta semana"
}

/**
 * Convierte un preset o rango custom al DateRange actual.
 * La semana comienza el LUNES usando dayjs isoWeek plugin (PQ-02 resuelto).
 *
 * Ejemplos de output:
 *   today        → { from: '2026-05-06', to: '2026-05-06', label: 'hoy' }
 *   this_week    → { from: '2026-05-04', to: '2026-05-10', label: 'esta semana' }
 *   this_month   → { from: '2026-05-01', to: '2026-05-31', label: 'este mes' }
 *   last_7_days  → { from: '2026-04-29', to: '2026-05-06', label: 'últimos 7 días' }
 *   last_30_days → { from: '2026-04-06', to: '2026-05-06', label: 'últimos 30 días' }
 *   custom       → { from: params.from, to: params.to, label: 'personalizado' }
 */
export function presetToDateRange(
  period: PeriodFilter,
  now = dayjs()
): ResolvedDateRange;

/**
 * Calcula el período de comparación (anterior) para los badges (PQ-03 resuelto).
 * - today        → ayer (1 día antes)
 * - this_week    → lunes a domingo de la semana anterior
 * - this_month   → mes anterior completo
 * - last_7_days  → los 7 días anteriores al rango
 * - last_30_days → los 30 días anteriores al rango
 * - custom       → mismo intervalo de duración inmediatamente antes del inicio
 */
export function getPreviousPeriod(
  current: ResolvedDateRange
): ResolvedDateRange;

/**
 * Calcula variación porcentual: ((current - previous) / previous) * 100
 * Retorna null si previous === 0 (evitar división por cero)
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number | null;
```

> **Decisión sobre `dayjs`:** El proyecto ya usa `dayjs` como librería de manejo de fechas (TQ-01 resuelto). Se usa el plugin `isoWeek` para garantizar que la semana comience el lunes (convención Argentina). No requiere instalación adicional si `dayjs` ya está en las dependencias del workspace — verificar en `apps/backoffice/package.json`.

---

## 6. Comparación con Período Anterior (Should Have)

El flujo de comparación es completamente server-side:

```
page.tsx
  ├── Parsea searchParams con periodFilterSchema
  ├── Calcula currentRange = presetToDateRange(period)
  ├── Calcula previousRange = getPreviousPeriod(currentRange)
  └── Pasa ambos ranges a DashboardPage

KpiSection.tsx  [RSC]
  ├── Promise.all([
  │     getDashboardKpis(currentRange),
  │     getDashboardKpis(previousRange)   ← solo si Should Have activo
  │   ])
  ├── Calcula avgTicket para ambos períodos
  ├── Calcula percentage change para cada KPI
  └── Renderiza KpiGrid con comparison props
```

> **Decisión:** La comparación usa el **mismo servicio** `getDashboardKpis` con el rango anterior — cero código extra en la capa de datos. El cálculo es puro en `period.utils.ts`. Si el Should Have se descarta para v1, solo se elimina la segunda llamada en `KpiSection` y el prop `comparison` de `KpiCard`.

> **Usuarios (all-time):** El KPI de Total Usuarios no tiene comparación — `users.getTotal()` retorna el acumulado. No implementar badge para este KPI.

---

## 7. Alert Card — Lógica de Detección

```
page.tsx o AlertCardSection.tsx [RSC]
  └── getStuckPaidOrders(10)
        Query: orders WHERE status='paid' AND updated_at <= now()-10min
        Retorna: [{ id, updated_at, minutesElapsed }]

AlertCardSection.tsx
  ├── Si length === 0 → return null (RF-18: no reservar espacio)
  └── Si length >= 1 → <AlertCard orders={stuckOrders} />
```

**Decisión sobre re-fetch:** La Alert Card vive en su propio `<Suspense>` boundary en `DashboardPage`. Al cambiar el período (searchParams), Next.js re-renderiza la página y el RSC hace un nuevo fetch. No se requiere polling. Si se desea auto-refresh sin cambio de URL, se necesitaría un Client Component con `setInterval` + Server Action — postergado a v2.

---

## 8. Integración en `page.tsx`

```typescript
// app/(app)/page.tsx  [RSC]

import { periodFilterSchema } from '@modules/dashboard/schemas/periodFilter.schema';
import { presetToDateRange, getPreviousPeriod } from '@modules/dashboard/utils/period.utils';
import DashboardPage from '@modules/dashboard/features/DashboardPage';
import SupabaseRepository from '@core/data/supabase/supabase.repository';

export default async function DashboardRoute({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // 1. Parsear período de URL (con default = this_month)
  const parsed = periodFilterSchema.safeParse(searchParams);
  const period = parsed.success ? parsed.data : { period: 'this_month' as const };

  // 2. Resolver rangos de fechas
  const dateRange = presetToDateRange(period);
  const previousDateRange = getPreviousPeriod(dateRange);

  // 3. Fetch all-time (no depende del período)
  const repository = SupabaseRepository();
  const totalUsers = await repository.users.getTotal();

  return (
    <DashboardPage
      period={period}
      dateRange={dateRange}
      previousDateRange={previousDateRange}
      totalUsers={totalUsers}
    />
  );
}
```

> `DashboardPage` es un RSC que lanza sus propios fetches en Suspense boundaries independientes, permitiendo streaming de cada sección.

---

## 9. Adiciones de i18n

Nuevas claves en `apps/backoffice/src/core/i18n/resources/es.json` bajo `DASHBOARD`:

```json
"DASHBOARD": {
  // — existentes —
  "TOTAL_SALES": "Ventas Totales",
  "ORDERS": "Órdenes",
  "USERS": "Usuarios",
  "SUBTITLE": "Aquí está el resumen de tu negocio",
  "NEW_PRODUCT": "Nuevo Producto",
  "VIEW_PROMOS": "Ver Promos",
  "VIEW_ORDERS": "Ver Órdenes",
  "BEST_SELLING_PRODUCTS": "Productos Más Vendidos",
  "PRODUCT": "Producto",
  "SALES": "Ventas",

  // — nuevas —
  "AVG_TICKET": "Ticket Promedio",

  "PERIOD_TODAY": "Hoy",
  "PERIOD_THIS_WEEK": "Esta semana",
  "PERIOD_THIS_MONTH": "Este mes",
  "PERIOD_LAST_7_DAYS": "Últimos 7 días",
  "PERIOD_LAST_30_DAYS": "Últimos 30 días",
  "PERIOD_CUSTOM": "Personalizado",

  "VS_YESTERDAY": "vs ayer",
  "VS_LAST_WEEK": "vs semana anterior",
  "VS_LAST_MONTH": "vs mes anterior",
  "VS_PREVIOUS_PERIOD": "vs período anterior",

  "ALERT_TITLE": "Órdenes sin gestionar",
  "ALERT_DESCRIPTION": "{count, plural, one {# orden lleva} other {# órdenes llevan}} más de 10 minutos en PAID",
  "ALERT_ORDER_TIME": "hace {minutes} min",
  "ALERT_VIEW_ORDER": "Ver orden →",

  "NO_SALES_IN_PERIOD": "No hubo ventas en {period}",
  "BEST_SELLERS_PERIOD_LABEL": "durante {period}"
}
```

---

## 10. Fases de Implementación

### Fase 1 — Fundamentos (sin UI)

1. Crear `core/constants/excluded-users.ts`
2. Crear `modules/dashboard/schemas/periodFilter.schema.ts` (Zod)
3. Crear `modules/dashboard/utils/period.utils.ts` (`presetToDateRange`, `getPreviousPeriod`, `calculatePercentageChange`)
4. Tests unitarios de `period.utils.ts` (especialmente semana lunes-domingo y custom range)
5. Definir `modules/dashboard/types.ts`

### Fase 2 — Migración de base de datos

1. Escribir migración SQL para `get_best_selling_products` RPC
2. Aplicar migración en entorno de staging y verificar output
3. Crear `core/data/supabase/dashboard/services/getBestSellingProductsForPeriod.ts`

### Fase 3 — Nuevos servicios de datos

1. Crear `getDashboardKpis.ts` (con date range + EXCLUDED_USER_IDS)
2. Crear `getStuckPaidOrders.ts`
3. Crear `core/data/supabase/dashboard/dashboard.repository.ts`
4. Actualizar `supabase.repository.ts`
5. Agregar variable `EXCLUDED_USER_1` a `.env.local` y documentar en `.env.example`

### Fase 4 — Componentes dumb

1. `KpiCard.tsx` + `KpiCardSkeleton.tsx`
2. `KpiGrid.tsx`
3. `ComparisonBadge.tsx` (Should Have — puede postergarse)
4. `PeriodSelector.tsx` (Client) — reutiliza `DateRangePicker` de orders
5. `AlertCard.tsx`
6. `BestSellersTable.tsx` + `EmptyBestSellers.tsx`

### Fase 5 — Features y orquestación

1. `KpiSection.tsx` (RSC)
2. `AlertCardSection.tsx` (RSC)
3. `BestSellersSection.tsx` (RSC)
4. `DashboardPage.tsx` (RSC) — orquesta con Suspense boundaries
5. Refactorizar `app/(app)/page.tsx` para delegar en `DashboardPage`
6. Agregar claves i18n
7. Marcar `getTotalSales` / `getTotalOrders` / `getBestSellingProducts` como `@deprecated`

---

## 11. Preguntas Técnicas Abiertas

| #     | Pregunta                                                                     | Impacto                         | Resolución                                                                                                                                                                        |
| ----- | ---------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TQ-01 | ~~¿`date-fns` está disponible como dependencia directa?~~                    | ~~Afecta `period.utils.ts`~~    | ✅ **Resuelto:** Usar `dayjs` + plugin `isoWeek`. El proyecto ya usa `dayjs`.                                                                                                     |
| TQ-02 | ~~¿El campo `created_at` refleja el momento en que la orden pasó a `paid`?~~ | ~~Afecta `getStuckPaidOrders`~~ | ✅ **Resuelto:** `created_at` = creación de la orden. Usar `updated_at` para detectar cuándo cambió a `paid`. Documentado como deuda técnica si se agrega `paid_at` en el futuro. |
| TQ-03 | ~~¿Existe RLS en la tabla `orders`?~~                                        | ~~Afecta el RPC~~               | ✅ **Resuelto:** RLS habilitado confirmado en migraciones. El RPC usa `SECURITY DEFINER + SET search_path = public`.                                                              |
| TQ-04 | ~~¿"Esta semana" empieza el lunes o el domingo?~~                            | ~~Afecta `presetToDateRange`~~  | ✅ **Resuelto:** Lunes (PQ-02, convención Argentina). Implementado con `dayjs isoWeek`.                                                                                           |
| TQ-05 | ~~¿RN-09 aplica al `unit_price` o al `amount` del pago?~~                    | ~~Afecta el RPC SQL~~           | ✅ **Resuelto:** `payments.amount = 0` con `status = 'completed'`.                                                                                                                |

---

## 12. Decisiones de Arquitectura — Resumen

| Decisión                                      | Elección                                                      | Razón                                                                                                             |
| --------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Estado del período                            | URL searchParams (`?period=` / `?from=&to=`)                  | RSC-friendly, URLs compartibles, back-button funciona, consistencia con módulo orders                             |
| Agrupación de best sellers                    | RPC de Postgres (`get_best_selling_products`)                 | Elimina client-side O(n) grouping; escala con el negocio; filtros DB-side (EXCLUDED_USER_IDS, $0 exclusion)       |
| KPIs: revenue + orders                        | Dos queries paralelas en `getDashboardKpis`                   | Evita RPC extra para lo que son queries simples con PostgREST nativo; sin penalidad de latencia con `Promise.all` |
| Ticket Promedio                               | Calculado en Smart component, no en servicio                  | Es un derivado (revenue ÷ orders) — no requiere round-trip extra                                                  |
| Comparación vs anterior                       | Mismo servicio, rango anterior calculado en `period.utils.ts` | Cero código extra en capa de datos; si se descarta el Should Have, se elimina una línea                           |
| `EXCLUDED_USER_IDS`                           | Constante en `core/constants/` con env var                    | Elimina UUID hardcodeado de servicios; array permite futuros usuarios de prueba                                   |
| Alert Card                                    | RSC con Suspense boundary propio + no polling                 | Simple, server-rendered, re-fetch en cada navegación; polling es v2                                               |
| `DateRangePicker`                             | Importación cross-module desde `orders/components/`           | Evita duplicación; no mover a `packages/ui` hasta que sea necesario en otra app                                   |
| `getTotalSales`/`getTotalOrders` legacy       | Mantener sin cambios, marcar `@deprecated`                    | No romper código existente mientras se migra; los nuevos servicios son paralelos                                  |
| Bug en `getTotalSales` (`paid` + `completed`) | Corregir silenciosamente en `getDashboardKpis`                | El dashboard mostrará valores diferentes (correctos) al actual — comunicar a Belu                                 |
| Semana en Argentina                           | Lunes como primer día (`dayjs isoWeek` plugin)                | Convención local; `isoWeek` garantiza lunes=1 sin configuración extra                                             |
| Librería de fechas                            | `dayjs` + plugin `isoWeek`                                    | Proyecto ya usa `dayjs` (TQ-01 resuelto) — no agregar `date-fns`                                                  |
| RPC `get_best_selling_products`               | `SECURITY DEFINER` + `SET search_path = public`               | RLS habilitado en `orders` y `payments` — sin SECURITY DEFINER el RPC devuelve vacío (TQ-03 resuelto)             |
| Suspense boundaries                           | Uno por sección (Alert, KPIs, BestSellers)                    | Streaming independiente; AlertCard no bloquea los KPIs; sin layout shift                                          |

---

_RFC preparado para revisión del Tech Lead — Belu Mont Patisserie Backoffice_
