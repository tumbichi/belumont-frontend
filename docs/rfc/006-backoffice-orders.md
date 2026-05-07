# RFC 006 — Módulo de Gestión de Órdenes (Backoffice)

**Feature:** `002-backoffice-orders`  
**Estado:** Borrador  
**Fecha:** Mayo 2026  
**Autor:** Arquitectura  
**PRD:** `docs/product/features/002-backoffice-orders.md`

---

## 1. Resumen

Actualizar el módulo `/ordenes` del backoffice de una tabla de solo lectura sin filtros a una experiencia de observabilidad completa. El módulo es **puramente informacional**: no hay mutaciones de estado desde la UI. La única "acción" del usuario es cargar on-demand el detalle completo de un pago desde la API de MercadoPago.

Cambios principales:

- Nueva query `getAllOrdersWithFilters` con joins completos y filtros URL-driven
- Nueva query `getOrderByIdExpanded` para el panel lateral y la página de detalle
- Módulo `src/modules/orders/` completo (Smart/Dumb split, Server Actions, tipos)
- Nuevo cliente MP replicado en `apps/backoffice/src/core/data/mercadopago/`
- `DateRangePicker` construido sobre el `Calendar` de shadcn ya disponible
- Panel lateral (Sheet) controlado por URL param (`?orderId=<id>`)
- Nueva ruta `app/(app)/ordenes/[id]/page.tsx` para la vista completa

---

## 2. Arquitectura General — Árbol de Directorios

```
apps/backoffice/src/
│
├── app/(app)/ordenes/
│   ├── page.tsx                          # RSC: lee searchParams, llama OrdersList
│   ├── loading.tsx                       # Skeleton existente
│   └── [id]/
│       ├── page.tsx                      # RSC: llama getOrderByIdExpanded → OrderDetail
│       └── loading.tsx
│
├── core/
│   ├── data/
│   │   ├── supabase/orders/
│   │   │   ├── orders.repository.ts      # MODIFICAR: añadir getAllWithFilters, getByIdExpanded
│   │   │   └── services/
│   │   │       ├── getAllOrders.ts        # EXISTENTE — no modificar
│   │   │       ├── getAllOrdersWithFilters.ts   # NUEVO (incluye count para paginación)
│   │   │       ├── getOrderByIdExpanded.ts      # NUEVO
│   │   │       ├── getOrderById.ts       # EXISTENTE
│   │   │       ├── createOrder.ts        # existente
│   │   │       ├── updateOrderStatus.ts  # existente — no exponer en UI
│   │   │       ├── getTotalOrders.ts     # existente
│   │   │       └── getTotalSales.ts      # existente
│   │   │
│   │   └── mercadopago/                  # NUEVO — replicado desde apps/web
│   │       ├── client.ts
│   │       └── services/
│   │           └── getPaymentById.ts
│   │
│   └── i18n/resources/es.json            # MODIFICAR: añadir claves ORDERS.*
│
└── modules/orders/
    ├── actions/
    │   └── get-mp-payment-detail.ts      # Server Action: llama MP on-demand
    │
    ├── components/                        # Dumb components (sin lógica de negocio)
    │   ├── OrdersTable.tsx               # Tabla pura; recibe rows tipadas
    │   ├── OrdersFilters.tsx             # Controles de filtro; emite cambios de URL
    │   ├── OrderStatusBadge.tsx          # Badge con color según status
    │   ├── PaymentStatusBadge.tsx        # Badge para payment status
    │   ├── OrderDetailPanel.tsx          # Contenido del Sheet (layout del detalle)
    │   ├── OrderDetailFull.tsx           # Mismo layout para /ordenes/[id]
    │   ├── PaymentSection.tsx            # Sección de pago dentro del detalle
    │   ├── PromoCodeSection.tsx          # Sección de código promo (renderiza si aplica)
    │   ├── MpDetailLoader.tsx            # Botón + estado para carga on-demand de MP
    │   ├── OrdersPagination.tsx          # Controles de paginación (prev/next/páginas)
    │   └── DateRangePicker.tsx           # Construido sobre Calendar de shadcn/ui
    │
    ├── features/                          # Smart components (orquestan datos y estado)
    │   ├── OrdersList.tsx                # RSC: recibe searchParams, fetch, renderiza tabla + sheet wrapper
    │   ├── OrdersSheetWrapper.tsx        # Client Component: controla Sheet por URL param
    │   └── OrderDetailPage.tsx           # RSC: recibe id, fetch, renderiza OrderDetailFull
    │
    ├── hooks/
    │   └── useOrderFilters.ts            # Hook cliente para leer/escribir filtros en URL
    │
    ├── schemas/
    │   └── orderFilters.schema.ts        # Zod: valida y parsea searchParams de filtros
    │
    └── types.ts                          # OrderWithFiltersResult, OrderDetailExpanded, MpPaymentDetail
```

---

## 3. Capa de Datos

### 3.1 Nuevos métodos en `orders.repository.ts`

> **Decisión confirmada — Fetch completo upfront (Opción A):**  
> `getAllOrdersWithFilters` incluye el join completo a `payments` (amount, provider, provider_id, status) y `promo_codes` (code, discount_type, discount_value) para todas las filas de la página.
>
> **Justificación:** El dataset es siempre ≤20 filas (paginación). La herramienta tiene un solo usuario (Belu). El overhead de los joins adicionales es negligible en Supabase a este volumen. El beneficio concreto es la apertura instantánea del Sheet sin ningún loading state — mejora de UX directa y diaria. La llamada "cara" (API externa de MercadoPago) ya está correctamente diferida como on-demand.
>
> Las alternativas evaluadas:
>
> - **Opción B (lazy fetch al abrir Sheet):** Agrega ~200-400ms de delay en cada apertura del panel + código extra (Server Action + loading state). No justificado al escala actual.
> - **Opción C (híbrido):** Complejidad adicional sin beneficio real a 20 filas/página.

#### `getAllOrdersWithFilters(params: OrderFiltersParams): Promise<{ data: OrderWithDetails[], total: number }>`

```typescript
// apps/backoffice/src/core/data/supabase/orders/services/getAllOrdersWithFilters.ts

export interface OrderFiltersParams {
  status?: string[]; // order_status enum values (multi-select)
  paymentStatus?: string[]; // payment_status values (multi-select)
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  clientSearch?: string; // fuzzy match en users.name / users.email
  productId?: string; // UUID del producto
  page?: number; // 1-indexed, default: 1
  pageSize?: number; // default: 20
}

// Query Supabase:
supabase
  .from('orders')
  .select(
    `
    id,
    created_at,
    updated_at,
    status,
    payment_id,
    product_id,
    user_id,
    users (name, email),
    products (id, name, price, product_type),
    payments (
      id,
      amount,
      provider,
      provider_id,
      status,
      promo_code_id,
      promo_codes (code, discount_type, discount_value)
    )
  `,
    { count: 'exact' }
  )
  // filtros aplicados condicionalmente con .in(), .gte(), .lte(), .ilike()
  .order('created_at', { ascending: false })
  .range(offset, offset + pageSize - 1);
```

**Estrategia de `clientSearch`:** Supabase no expone full-text search en tablas relacionadas directamente. Usar `.ilike()` sobre un campo RPC o, más simple: filtrar en la query por `user_id` en una sub-consulta. La implementación recomendada es un **RPC de Postgres** que reciba el término de búsqueda o, como alternativa pragmática inicial, traer los user_ids que coinciden en una query separada a `users` y filtrar con `.in('user_id', matchingIds)`. Documentar esto como deuda técnica.

> **Decisión:** Implementar con dos queries (buscar users → filtrar orders) en v1. Migrar a RPC en v2 si el volumen lo justifica.

#### `getOrderByIdExpanded(id: string): Promise<OrderDetailExpanded | null>`

```typescript
supabase
  .from('orders')
  .select(
    `
    id,
    created_at,
    updated_at,
    status,
    payment_id,
    users (name, email),
    products (name, price, product_type),
    payments (
      id,
      amount,
      provider,
      provider_id,
      status,
      promo_codes (code, discount_type, discount_value)
    )
  `
  )
  .eq('id', id)
  .single();
```

#### `getTotalOrdersWithFilters(params: Omit<OrderFiltersParams, 'page' | 'pageSize'>): Promise<number>`

Reutiliza la misma query pero con `{ count: 'exact', head: true }` — sin `range()`. Se puede simplificar retornando el `count` directamente desde `getAllOrdersWithFilters` en un solo request (Supabase soporta `{ count: 'exact' }` con `select`).

> **Decisión:** `getAllOrdersWithFilters` retorna `{ data, total }` en un solo call usando `count: 'exact'`.

### 3.2 Nuevo cliente MercadoPago en backoffice

Replicar exactamente la estructura de `apps/web/src/core/data/mercadopago/`:

```
apps/backoffice/src/core/data/mercadopago/
├── client.ts           # instancia axios/fetch con MERCADOPAGO_ACCESS_TOKEN
└── services/
    └── getPaymentById.ts
```

Variables de entorno requeridas en `apps/backoffice/.env.local`:

```
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_PAYMENTS_PATH=https://api.mercadopago.com/v1/payments
```

> **Decisión de arquitectura:** No mover a `packages/` — cada app configura sus propias credenciales de MP. La duplicación de código es intencional y aceptada.

---

## 4. Arquitectura de Componentes

### 4.1 Página principal `/ordenes` — RSC + Client wrapper

```
app/(app)/ordenes/page.tsx  [RSC]
  └── modules/orders/features/OrdersList.tsx  [RSC]
        ├── Lee searchParams (filtros, página)
        ├── Llama getAllOrdersWithFilters()
        ├── modules/orders/components/OrdersFilters.tsx  [Client]
        │     Controla filtros via router.push() con URL params
        ├── modules/orders/components/OrdersTable.tsx  [RSC/Dumb]
        │     rows={orders} — cada fila tiene un Link/onClick que setea ?orderId=
        ├── modules/orders/components/OrdersPagination.tsx  [Client]
        │     Lee/escribe ?page= en URL
        └── modules/orders/features/OrdersSheetWrapper.tsx  [Client]
              Lee ?orderId= de searchParams (via useSearchParams)
              Abre/cierra Sheet de @soybelumont/ui
              Renderiza OrderDetailPanel con los datos de la orden seleccionada
```

**Problema:** `OrdersList` es RSC pero `OrdersSheetWrapper` necesita `useSearchParams`. Solución: `OrdersList` pasa los datos de órdenes como prop al wrapper. El wrapper es un Client Component que:

1. Lee `?orderId=` via `useSearchParams()`
2. Busca la orden en el array ya cargado (sin re-fetch para el panel lateral)
3. Abre el Sheet con **todos los datos del detalle ya disponibles** — incluyendo payment (amount, provider, provider_id, status) y promo_code (si aplica) — porque `getAllOrdersWithFilters` los trajo upfront

> **Decisión:** El panel lateral **no hace re-fetch**. Los datos de pago y código promo están disponibles instantáneamente porque se incluyen en la query principal de la lista. El único call adicional es el botón "Cargar detalle MP" (API externa de MercadoPago, on-demand).

### 4.2 `OrdersFilters.tsx` — Client Component

Controles:

- `Select` (multi): estado de orden
- `Select` (multi): estado de pago (Should Have)
- `DateRangePicker`: fecha desde / hasta
- `Input` con debounce: búsqueda por cliente
- `Select`: producto (lista cargada desde Server en el padre RSC)
- Botón "Limpiar filtros"

Al cambiar cualquier filtro: `router.push()` con los nuevos searchParams, preservando los demás. Usar `useTransition` para feedback de loading.

### 4.3 `DateRangePicker.tsx` — Client Component (built in-house)

Construido sobre `Calendar` de shadcn/ui (ya disponible en `packages/ui`). No instalar librerías externas.

Interfaz:

```typescript
interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
  placeholder?: string;
}
```

Implementación: `Popover` + dos instancias de `Calendar` (o `Calendar` con `mode="range"`). Usar `date-fns` (ya disponible como dependencia transitiva de shadcn) para formateo.

### 4.4 `OrdersSheetWrapper.tsx` — Client Component

```typescript
'use client';

// Lee ?orderId de useSearchParams()
// Encuentra la orden en props.orders (array ya cargado)
// Controla open/close del Sheet
// Al cerrar: router.replace() eliminando ?orderId
// Incluye Link a /ordenes/[id] (botón "Ver en pantalla completa")
```

### 4.5 `OrderDetailPanel.tsx` / `OrderDetailFull.tsx` — Dumb Components

Reciben `OrderDetailExpanded` como prop. Renderizan:

- Header: ID de orden, estado (badge), fechas
- Sección Producto: nombre, tipo, precio de lista
- Sección Cliente: nombre, email
- Sección Pago: monto de lista, monto final, proveedor, estado, `provider_id` (link si es MP)
  - Si `payment_id === null`: mostrar "Sin pago registrado"
  - Si `provider === 'free'`: mostrar "Gratuito (código de descuento 100%)"
- Sección Código Promo: renderizar **solo si** `promo_codes` no es null
- `MpDetailLoader.tsx`: botón "Cargar detalle de pago" (solo si provider === 'mercadopago')

`OrderDetailFull` es el mismo layout pero sin las restricciones de espacio del Sheet — puede mostrar más información vertical.

### 4.6 `MpDetailLoader.tsx` — Client Component

```typescript
'use client';

// Estado local: idle | loading | success | error
// Al hacer clic: llama Server Action getMpPaymentDetail(provider_id)
// Muestra spinner durante carga
// En success: renderiza datos crudos del pago de MP (monto, método, cuotas, etc.)
// En error: toast de error
```

### 4.7 `OrderStatusBadge.tsx` / `PaymentStatusBadge.tsx` — Dumb Components

Mapeo de colores (tailwind classes):

```
order_status:
  pending   → bg-yellow-100 text-yellow-800
  paid      → bg-blue-100 text-blue-800
  completed → bg-green-100 text-green-800
  cancelled → bg-red-100 text-red-800

payment_status:
  approved  → bg-green-100 text-green-800
  pending / in_process / authorized / in_mediation → bg-yellow-100 text-yellow-800
  rejected / cancelled / charged_back → bg-red-100 text-red-800
  refunded  → bg-purple-100 text-purple-800
```

---

## 5. Estrategia de Filtros — URL Search Params

### Schema de parámetros

```typescript
// modules/orders/schemas/orderFilters.schema.ts
import { z } from 'zod';

export const ORDER_STATUS_VALUES = [
  'pending',
  'paid',
  'completed',
  'cancelled',
] as const;
export const PAYMENT_STATUS_VALUES = [
  'pending',
  'approved',
  'authorized',
  'in_process',
  'in_mediation',
  'rejected',
  'cancelled',
  'refunded',
  'charged_back',
] as const;

export const orderFiltersSchema = z.object({
  status: z.array(z.enum(ORDER_STATUS_VALUES)).optional(),
  paymentStatus: z.array(z.enum(PAYMENT_STATUS_VALUES)).optional(),
  dateFrom: z.string().date().optional(), // YYYY-MM-DD
  dateTo: z.string().date().optional(), // YYYY-MM-DD
  clientSearch: z.string().max(100).optional(),
  productId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  orderId: z.string().uuid().optional(), // controla el Sheet
});

export type OrderFilters = z.infer<typeof orderFiltersSchema>;
```

### Serialización de arrays en URL

Los filtros de arrays (status, paymentStatus) se serializan como params repetidos:

```
/ordenes?status=pending&status=paid&dateFrom=2026-05-01&page=1
```

El RSC parsea con el schema Zod antes de pasarlo a `getAllOrdersWithFilters`.

### Por qué URL search params (no estado cliente)

- URLs compartibles: Belu puede copiar la URL con filtros aplicados
- Compatible con RSC: el Server Component re-renderiza al cambiar params sin necesidad de estado cliente
- Gratis con Next.js App Router: `<Link>` y `router.push()` no requieren layout reload
- El Sheet se abre/cierra via `?orderId=<uuid>`, manteniendo el estado en URL (navegación con back button funciona correctamente)

---

## 6. Integración MP On-Demand

### Server Action

```typescript
// modules/orders/actions/get-mp-payment-detail.ts
'use server';

import { getMercadopagoClient } from '@core/data/mercadopago/client';

export interface MpPaymentDetailResult {
  status: 'success' | 'error';
  data?: MpPaymentDetail;
  error?: string;
}

export async function getMpPaymentDetail(
  providerId: string
): Promise<MpPaymentDetailResult> {
  try {
    const data = await getPaymentById(providerId);
    return { status: 'success', data };
  } catch (err) {
    return { status: 'error', error: 'No se pudo cargar el detalle del pago.' };
  }
}
```

### Flujo

1. `OrderDetailPanel` renderiza `MpDetailLoader` solo si `payment.provider === 'mercadopago'`
2. Usuario hace clic en "Cargar detalle de pago"
3. `MpDetailLoader` (Client) llama `getMpPaymentDetail(payment.provider_id)` via Server Action
4. Server Action llama `getPaymentById` del cliente MP del backoffice
5. Retorna los datos al componente cliente
6. Se renderizan: método de pago, cuotas, card brand, fecha de acreditación, etc.

> **Por qué Server Action y no Route Handler:** Consistencia con el resto del backoffice (todos los calls son Server Actions). Evita exponer endpoints HTTP adicionales. El tipo de retorno es directamente usable en el componente.

---

## 7. Página de Detalle `/ordenes/[id]`

```typescript
// app/(app)/ordenes/[id]/page.tsx  [RSC]

import SupabaseRepository from '@core/data/supabase/supabase.repository';
import OrderDetailPage from '@modules/orders/features/OrderDetailPage';
import { notFound } from 'next/navigation';

export default async function OrderDetailRoute({
  params,
}: {
  params: { id: string };
}) {
  const repository = SupabaseRepository();
  const order = await repository.orders.getByIdExpanded(params.id);

  if (!order) notFound();

  return <OrderDetailPage order={order} />;
}
```

`OrderDetailPage` [RSC/Smart]:

- Renderiza un header con botón "← Volver a órdenes" (Link a `/ordenes`)
- Renderiza `OrderDetailFull` con todos los datos
- Renderiza `MpDetailLoader` (Client) si aplica

Esta página hace su propio fetch (no depende del estado del panel lateral), lo que garantiza que funcione al navegar directamente a `/ordenes/<id>`.

---

## 8. Adiciones de i18n

Nuevas claves a agregar en `apps/backoffice/src/core/i18n/resources/es.json` bajo `ORDERS`:

```json
"ORDERS": {
  // — existentes —
  "TITLE": "Órdenes",
  "ORDER_ID": "ID de Orden",
  "CLIENT": "Cliente",
  "PRODUCT": "Producto",
  "CREATED_AT": "Fecha de Creación",
  "ORDER_STATUS": "Estado de Orden",
  "PAYMENT_STATUS": "Estado de Pago",
  "NO_ORDERS": "No se encontraron órdenes.",
  "ACTIONS": "Acciones",

  // — nuevas —
  "UPDATED_AT": "Última actualización",
  "FILTERS": "Filtros",
  "CLEAR_FILTERS": "Limpiar filtros",
  "SEARCH_CLIENT": "Buscar por nombre o email",
  "FILTER_BY_STATUS": "Filtrar por estado",
  "FILTER_BY_PAYMENT_STATUS": "Filtrar por estado de pago",
  "FILTER_BY_PRODUCT": "Filtrar por producto",
  "FILTER_BY_DATE": "Filtrar por fecha",
  "DATE_FROM": "Desde",
  "DATE_TO": "Hasta",
  "ALL_STATUSES": "Todos los estados",
  "ALL_PRODUCTS": "Todos los productos",

  "STATUS_PENDING": "Pendiente",
  "STATUS_PAID": "Pagado",
  "STATUS_COMPLETED": "Completado",
  "STATUS_CANCELLED": "Cancelado",

  "PAYMENT_STATUS_PENDING": "Pendiente",
  "PAYMENT_STATUS_APPROVED": "Aprobado",
  "PAYMENT_STATUS_AUTHORIZED": "Autorizado",
  "PAYMENT_STATUS_IN_PROCESS": "En proceso",
  "PAYMENT_STATUS_IN_MEDIATION": "En mediación",
  "PAYMENT_STATUS_REJECTED": "Rechazado",
  "PAYMENT_STATUS_CANCELLED": "Cancelado",
  "PAYMENT_STATUS_REFUNDED": "Reembolsado",
  "PAYMENT_STATUS_CHARGED_BACK": "Contracargo",

  "DETAIL_TITLE": "Detalle de la Orden",
  "PRODUCT_SECTION": "Producto",
  "CLIENT_SECTION": "Cliente",
  "PAYMENT_SECTION": "Pago",
  "PROMO_SECTION": "Código de Descuento",
  "NO_PAYMENT": "Sin pago registrado",
  "PAYMENT_PROVIDER_MP": "MercadoPago",
  "PAYMENT_PROVIDER_FREE": "Gratuito (código de descuento 100%)",
  "LIST_PRICE": "Precio de lista",
  "FINAL_AMOUNT": "Monto final pagado",
  "MP_REFERENCE": "Referencia MP",
  "VIEW_IN_MP": "Ver en MercadoPago",
  "DISCOUNT_CODE": "Código",
  "DISCOUNT_TYPE": "Tipo de descuento",
  "DISCOUNT_VALUE": "Valor del descuento",

  "LOAD_MP_DETAIL": "Cargar detalle de pago",
  "MP_DETAIL_LOADING": "Cargando...",
  "MP_DETAIL_ERROR": "No se pudo cargar el detalle del pago.",
  "MP_DETAIL_TITLE": "Detalle del pago en MercadoPago",

  "VIEW_FULL_DETAIL": "Ver detalle completo",
  "BACK_TO_ORDERS": "← Volver a órdenes",
  "PAGE": "Página",
  "OF": "de",
  "PREVIOUS": "Anterior",
  "NEXT": "Siguiente",
  "RESULTS": "resultados"
}
```

---

## 9. Fases de Implementación

### Fase 1 — Datos y tipos (sin UI)

1. Crear `getAllOrdersWithFilters.ts` con joins completos y todos los filtros
2. Crear `getOrderByIdExpanded.ts`
3. Actualizar `orders.repository.ts` con los nuevos métodos
4. Definir tipos en `modules/orders/types.ts`
5. Definir schema Zod en `modules/orders/schemas/orderFilters.schema.ts`

### Fase 2 — Componentes dumb

1. `OrderStatusBadge.tsx` + `PaymentStatusBadge.tsx`
2. `OrdersTable.tsx` (tabla con badges, sin Sheet aún)
3. `DateRangePicker.tsx` (construido sobre Calendar de shadcn)
4. `OrdersFilters.tsx` (todos los controles de filtro)
5. `OrdersPagination.tsx`
6. `PaymentSection.tsx` + `PromoCodeSection.tsx`
7. `OrderDetailPanel.tsx` + `OrderDetailFull.tsx`

### Fase 3 — Integración de página principal

1. `OrdersList.tsx` (RSC): consume filtros de searchParams, llama `getAllOrdersWithFilters`
2. `OrdersSheetWrapper.tsx` (Client): controla Sheet por `?orderId`
3. Refactorizar `app/(app)/ordenes/page.tsx` para delegar en `OrdersList`
4. Añadir i18n keys

### Fase 4 — Página de detalle `/ordenes/[id]`

1. Crear `app/(app)/ordenes/[id]/page.tsx` + `loading.tsx`
2. `OrderDetailPage.tsx` (Smart RSC)

### Fase 5 — Integración MP on-demand

1. Crear cliente MP en `apps/backoffice/src/core/data/mercadopago/`
2. Crear Server Action `get-mp-payment-detail.ts`
3. `MpDetailLoader.tsx` (Client)
4. Integrar en `OrderDetailPanel` y `OrderDetailFull`

---

## 10. Preguntas Técnicas Abiertas

| #     | Pregunta                                                                                             | Impacto                                 | Recomendación                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| TQ-01 | ¿Supabase soporta `.ilike()` sobre columnas de tablas relacionadas (`users.name`) en una sola query? | Afecta `clientSearch`                   | Implementar con 2 queries en v1 (buscar user_ids, luego filtrar orders). Documentar como deuda técnica. |
| TQ-02 | ¿El Sheet de `@soybelumont/ui` acepta `children` dinámicos o requiere configuración específica?      | Afecta `OrdersSheetWrapper`             | Verificar la API del componente antes de implementar.                                                   |
| TQ-03 | ¿Qué campos retorna la API de MP en `getPaymentById`?                                                | Afecta la UI de `MpDetailLoader`        | Testear con un `provider_id` real y tipar la respuesta.                                                 |
| TQ-04 | ¿El disparador de `cancelled` es un webhook de MP o una acción del sistema? (PQ-09b del PRD)         | Afecta labels y documentación de estado | No bloquea v1; usar label genérico "Cancelado".                                                         |

---

## 11. Decisiones de Arquitectura — Resumen

| Decisión                              | Elección                                                  | Razón                                                                                       |
| ------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Estado del Sheet                      | URL param `?orderId=`                                     | URLs compartibles, compatible con RSC, back-button funciona                                 |
| Datos del panel lateral               | Upfront en query de lista — **Opción A**                  | ≤20 filas/página, un usuario; joins negligibles; apertura del Sheet instantánea             |
| payments + promo_codes en query lista | Incluidos en `getAllOrdersWithFilters`                    | Evita re-fetch al abrir Sheet; la carga cara (API MP externa) ya es correctamente on-demand |
| `clientSearch`                        | Dos queries en v1                                         | Supabase no filtra por columnas relacionadas con `.ilike()` directamente                    |
| `DateRangePicker`                     | Construido sobre `Calendar` de shadcn                     | Evita dependencias externas; Calendar ya disponible                                         |
| Cliente MP en backoffice              | Replicado en `apps/backoffice/src/core/data/mercadopago/` | Cada app tiene sus propias credenciales; duplicación intencional                            |
| MP detail call                        | Server Action (no Route Handler)                          | Consistencia con el resto del backoffice; no expone endpoints HTTP                          |
| Paginación                            | URL param `?page=` + `count: 'exact'` en query única      | RSC-friendly, URLs compartibles, sin query extra para el total                              |
| Mutaciones de estado                  | Ninguna expuesta en UI                                    | Los estados son gestionados automáticamente por MP; evita inconsistencias                   |

---

_RFC aprobado para implementación — Belu Mont Patisserie Backoffice_
