# PRD — 003: Dashboard con Filtro de Fechas y KPIs Mejorados (Backoffice)

**Versión:** 1.1  
**Fecha:** Mayo 2026  
**Feature ID:** `003-backoffice-dashboard`  
**Estado:** Aprobado

---

## Changelog

| Versión | Fecha     | Cambios                                                                                                                                                                   |
| ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | Mayo 2026 | Borrador inicial                                                                                                                                                          |
| 1.1     | Mayo 2026 | Resolución de PQ-01, PQ-03, PQ-04. Nuevas reglas: EXCLUDED_USER_IDS, Alert Card (órdenes en `paid` > 10 min), exclusión de productos con precio final $0 en best sellers. |

---

## Resumen Ejecutivo

Mejorar el Dashboard del backoffice de Belu Mont Patisserie para convertirlo de un panel de estadísticas all-time en un centro de comando operativo. La mejora principal es agregar un **filtro de período de tiempo** que afecte a todas las métricas visibles, junto con la incorporación de un **Ticket Promedio** como nuevo KPI derivado. El objetivo es que Belu pueda responder en segundos preguntas como: "¿cuánto vendí esta semana?" o "¿qué producto se vendió más este mes?".

---

## Contexto de Negocio

El dashboard actual muestra tres métricas all-time (Ventas Totales, Total de Órdenes, Total de Usuarios) y una tabla de productos más vendidos (también all-time). Este modelo es útil al inicio, pero pierde valor operativo a medida que el negocio crece: una métrica de "ventas totales de todos los tiempos" no ayuda a Belu a saber si una campaña de Meta Ads que lanzó esta semana está funcionando.

**Sin esta mejora**, Belu no puede responder preguntas temporales básicas sin exportar datos manualmente o entrar al dashboard de MercadoPago, lo que fragmenta su visibilidad operativa.

**Restricciones técnicas heredadas del codebase actual:**

- `getTotalSales` excluye órdenes con `provider = free` y excluía un `user_id` hardcodeado (usuario de dev/test). **Decisión confirmada (PQ-01):** este ID debe refactorizarse a la constante `EXCLUDED_USER_IDS = [process.env.EXCLUDED_USER_1]`. Ver RN-07.
- `getBestSellingProducts` solo cuenta órdenes con `status = completed`. Esta regla se mantiene y se extiende. Ver RN-09.
- Ambas restricciones son correctas para el negocio y deben preservarse al agregar el filtro de fechas.

---

## Entidades de Negocio Relevantes

Las entidades no cambian respecto al módulo de órdenes (ver PRD 002). El Dashboard las consume en modo read-only para cálculos de agregación.

| Entidad    | Uso en el Dashboard                                                       |
| ---------- | ------------------------------------------------------------------------- |
| `orders`   | Conteo de órdenes, ingresos, productos más vendidos — filtrado por fecha  |
| `payments` | Monto cobrado (`amount`), excluyendo `provider = free`                    |
| `products` | Nombre del producto para la tabla de más vendidos                         |
| `users`    | Conteo total de usuarios registrados (no filtrado por período en esta v1) |

### Reglas de Negocio del Dashboard

| Regla | Descripción                                                                                                                                                                                                                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RN-01 | Los **ingresos** solo incluyen órdenes con `status = 'completed'` y `payments.provider != 'free'`. _(Confirmado: `paid` no cuenta para ingresos KPI.)_                                                                                                                                                                                      |
| RN-02 | El **conteo de órdenes** en los KPIs solo incluye órdenes con `status = 'completed'` para reflejar ventas cerradas. _(Confirmado PQ-04.)_                                                                                                                                                                                                   |
| RN-03 | Los **productos más vendidos** solo cuentan órdenes con `status = 'completed'`.                                                                                                                                                                                                                                                             |
| RN-04 | El **Ticket Promedio** se calcula como `Ingresos del período / Órdenes del período`. Si las órdenes son 0, mostrar `$0`.                                                                                                                                                                                                                    |
| RN-05 | El **período seleccionado** aplica sobre `orders.created_at`.                                                                                                                                                                                                                                                                               |
| RN-06 | El **Total de Usuarios** muestra el total acumulado (all-time) — no filtrado por período, ya que representa el tamaño total de la base de clientes.                                                                                                                                                                                         |
| RN-07 | **Exclusión de usuarios internos:** Todas las queries de KPI deben filtrar los usuarios definidos en `EXCLUDED_USER_IDS = [process.env.EXCLUDED_USER_1]`. Estos corresponden a usuarios de dev/test que no representan ventas reales. Ningún KPI (ingresos, órdenes, ticket promedio, best sellers) debe incluir órdenes de estos usuarios. |
| RN-08 | **Alert Card — órdenes bloqueadas en `paid`:** Si alguna orden lleva más de 10 minutos en estado `paid` sin pasar a `completed`, el dashboard debe mostrar una tarjeta de alerta prominente. La tarjeta lista las órdenes afectadas con link directo a cada una. Estas órdenes requieren gestión manual de envío por parte de Belu.         |
| RN-09 | **Exclusión de productos con precio final $0:** `getBestSellingProducts` no debe contar productos cuyo precio final de venta fue $0 (es decir, donde se aplicó un código de descuento del 100%). Estos no deben aparecer en el ranking de best sellers.                                                                                     |

---

## Historias de Usuario

> Todas desde la perspectiva de **Belu** como administradora del backoffice.

**HU-01 — Ver ventas del período actual**

> "Como Belu, quiero seleccionar 'Este mes' y ver cuánto vendí, cuántas órdenes tuve y cuál fue mi ticket promedio, para saber si el mes está yendo bien."

**HU-02 — Comparar con semanas anteriores**

> "Como Belu, quiero poder ver 'Esta semana' y 'La semana pasada' alternando el selector, para comparar si estoy vendiendo más o menos que antes."

**HU-03 — Ver el impacto de una campaña puntual**

> "Como Belu, quiero seleccionar un rango de fechas personalizado (ej. del 1 al 7 de mayo), para medir el resultado de una campaña específica de Meta Ads."

**HU-04 — Conocer los productos más vendidos del período**

> "Como Belu, quiero que la tabla de productos más vendidos también se filtre por el período seleccionado, para saber qué producto debo reponer o promocionar más."

**HU-05 — Entender mi ticket promedio**

> "Como Belu, quiero ver el ticket promedio del período, para saber si los clientes están comprando los packs más caros o solo los productos individuales."

**HU-06 — Ver órdenes que necesitan gestión manual de envío**

> "Como Belu, quiero que el dashboard me avise cuando una orden lleva más de 10 minutos pagada sin que yo haya gestionado el envío, para no dejar a ningún cliente esperando sin respuesta."

---

## Requisitos Funcionales

### Selector de Período (nuevo)

| #     | Requisito                                                                                                | Prioridad (MoSCoW) |
| ----- | -------------------------------------------------------------------------------------------------------- | ------------------ |
| RF-01 | Selector de período con presets: **Hoy**, **Esta semana**, **Este mes**                                  | **Must Have**      |
| RF-02 | Opción **Rango personalizado** con date-range picker (reutilizar componente del módulo de órdenes)       | **Must Have**      |
| RF-03 | El preset activo debe estar visualmente marcado (botón/tab seleccionado)                                 | **Must Have**      |
| RF-04 | El período seleccionado persiste en la URL como query params (`?period=this_month` o `?from=...&to=...`) | **Must Have**      |
| RF-05 | Al entrar al dashboard sin parámetros, el período por defecto es **Este mes**                            | **Must Have**      |
| RF-06 | Presets adicionales: **Últimos 7 días**, **Últimos 30 días**                                             | **Should Have**    |

### Tarjetas de KPI

| #     | Requisito                                                                                                             | Prioridad (MoSCoW) |
| ----- | --------------------------------------------------------------------------------------------------------------------- | ------------------ |
| RF-07 | La tarjeta **Ventas** muestra el total de ingresos filtrado por el período seleccionado (aplicando RN-01)             | **Must Have**      |
| RF-08 | La tarjeta **Órdenes** muestra el conteo de órdenes filtrado por el período seleccionado (aplicando RN-02)            | **Must Have**      |
| RF-09 | Nueva tarjeta **Ticket Promedio** calculado del período seleccionado (aplicando RN-04)                                | **Must Have**      |
| RF-10 | La tarjeta **Usuarios** mantiene el total acumulado (all-time) — no filtrada por período (aplicando RN-06)            | **Must Have**      |
| RF-11 | Todas las tarjetas muestran un estado de carga (skeleton) mientras los datos se obtienen                              | **Must Have**      |
| RF-12 | Cada tarjeta de KPI muestra una variación porcentual vs el período equivalente anterior (ej. "↑ 12% vs mes anterior") | **Should Have**    |

### Tabla de Productos Más Vendidos

| #     | Requisito                                                                                          | Prioridad (MoSCoW) |
| ----- | -------------------------------------------------------------------------------------------------- | ------------------ |
| RF-13 | La tabla de productos más vendidos se filtra por el período seleccionado (aplicando RN-03 y RN-05) | **Must Have**      |
| RF-14 | Si no hay ventas en el período, la tabla muestra un estado vacío con mensaje contextual al período | **Must Have**      |

### Acciones Rápidas

| #     | Requisito                                                                                                 | Prioridad (MoSCoW) |
| ----- | --------------------------------------------------------------------------------------------------------- | ------------------ |
| RF-15 | Mantener los botones de acciones rápidas existentes (Nueva Producto, Ver Promos, Ver Órdenes) sin cambios | **Must Have**      |

### Alert Card — Órdenes bloqueadas en `paid`

| #     | Requisito                                                                                                                                                                            | Prioridad (MoSCoW) |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| RF-16 | Si existe al menos una orden con `status = 'paid'` hace más de 10 minutos, mostrar una tarjeta de alerta **prominente** en la parte superior del dashboard (por encima de los KPIs). | **Must Have**      |
| RF-17 | La tarjeta de alerta lista cada orden afectada con: ID de la orden, hora en que entró en `paid`, tiempo transcurrido, y un link directo a la página de detalle de la orden.          | **Must Have**      |
| RF-18 | Si no hay órdenes bloqueadas, la tarjeta de alerta no se muestra (el espacio no se reserva).                                                                                         | **Must Have**      |

### Mejoras Futuras (Could Have)

| #     | Requisito                                                                                    | Nota                                                                              |
| ----- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| RF-19 | Gráfico de ingresos por día/semana para el período seleccionado (line o bar chart)           | Requiere decidir librería de charts (recharts, tremor). No incluido en v1.        |
| RF-20 | Tarjeta de "Clientes nuevos en el período" (usuarios registrados dentro del rango de fechas) | Requiere filtrar `users.created_at` por período — sencillo, pero postergado a v2. |

---

## Diseño de Interacción

### Layout del Dashboard (v1 mejorado)

```
┌─────────────────────────────────────────────────┐
│  Hola, Belu 👋                                   │
│  Aquí está el resumen de tu negocio              │
│                                                  │
│  ⚠️  ALERTA — Órdenes sin gestionar (RF-16/17)  │  ← Solo visible si hay órdenes en `paid` > 10 min
│  ┌─────────────────────────────────────────────┐ │
│  │ ⚠️  2 órdenes llevan más de 10 min en PAID  │ │
│  │  #1042 · hace 23 min  [Ver orden →]         │ │
│  │  #1039 · hace 15 min  [Ver orden →]         │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  [Hoy] [Esta semana] [Este mes] [Personalizado ▾]│
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Ventas   │ │ Órdenes  │ │ Ticket   │          │
│  │ $12.400  │ │    8     │ │  $1.550  │          │
│  │ ↑12% ←  │ │ ↑2%      │ │ ↑5%      │  ← Should│
│  └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐                                    │
│  │ Usuarios │                                    │
│  │   142    │ (all-time, sin filtro de período)  │
│  └──────────┘                                    │
│                                                  │
│  Acciones rápidas: [+ Producto] [Promos] [Órdenes]│
│                                                  │
│  Productos más vendidos (período seleccionado)   │
│  ┌─────────────────────────────────────────────┐ │
│  │ Producto  │ Tipo    │ Ventas                │ │
│  │ ...       │ ...     │ ...                   │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Comportamiento del Selector de Período

- El selector se implementa como un grupo de botones tipo "tabs" con el estado activo marcado.
- Al seleccionar "Personalizado", se abre un popover con un date-range picker (mismo componente que en `/ordenes`).
- El período seleccionado se refleja en la URL: `?period=today`, `?period=this_week`, `?period=this_month`, `?from=2026-05-01&to=2026-05-07`.
- La página es un **Server Component**: el período llega como `searchParams`, los datos se buscan server-side. El selector de período requiere `'use client'` solo para el componente de botones y el date-picker — los datos se re-fetchean mediante navegación (no fetch del lado cliente).

---

## Fuera de Alcance (v1)

- **Gráfico de evolución temporal** (line/bar chart de ventas por día): postergado a v2.
- **Clientes nuevos en el período**: postergado a v2.
- **Exportar estadísticas a CSV/Excel.**
- ~~**Alertas o notificaciones**~~ — **Incorporado en v1.1** como Alert Card (RF-16/17/18, RN-08). Las alertas por órdenes bloqueadas en `paid` ya están en scope.
- **Dashboard para múltiples locales o usuarios** — Belu Mont tiene un único negocio.
- **Comparación vs período anterior** (badges de variación %): Should Have, puede implementarse en v1 si el tiempo lo permite, pero no bloquea el lanzamiento.

---

## Decisiones Confirmadas

> Preguntas que fueron escaladas al Tech Lead y tienen resolución oficial.

| #     | Pregunta original                                                                                               | Decisión                                                                                                                                                                                                                                                | Regla/RF resultante                     |
| ----- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| PQ-01 | ¿El `user_id` hardcodeado en `getTotalSales` es un usuario de prueba permanente o temporal?                     | **Permanente (dev/test).** Debe refactorizarse a `EXCLUDED_USER_IDS = [process.env.EXCLUDED_USER_1]`. Todas las queries de KPI (ingresos, órdenes, ticket promedio, best sellers) deben filtrar los IDs de esta lista.                                  | RN-07                                   |
| PQ-03 | Para los badges de comparación (RF-12), ¿qué es el "período anterior"?                                          | **Hoy** → Ayer. **Esta semana** → Semana pasada. **Este mes** → Mes pasado. **Rango personalizado** → mismo intervalo de duración inmediatamente anterior al inicio del rango (ej. rango de 7 días → los 7 días previos al inicio).                     | RF-12                                   |
| PQ-04 | ¿Los KPIs cuentan `paid` + `completed` o solo `completed`? ¿Se agrega lógica de alerta para órdenes estancadas? | **Solo `completed`** para todos los KPIs. **Nueva Alert Card (Must Have):** si alguna orden lleva >10 min en `paid`, mostrar tarjeta con las órdenes afectadas y link a cada una. **Best sellers:** excluir productos con precio final $0 (promo 100%). | RN-01, RN-02, RN-08, RN-09, RF-16/17/18 |

---

## Preguntas Pendientes (para Tech Lead)

| #     | Pregunta                                                                                                              | Impacto                                                                                                                                                                  |
| ----- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PQ-02 | ¿"Esta semana" empieza el lunes o el domingo?                                                                         | Afecta el cálculo del preset. En Argentina la semana convencional empieza el lunes.                                                                                      |
| PQ-05 | ¿`getBestSellingProducts` debe seguir contando solo `completed` o también `paid` en el contexto del filtro de fechas? | Confirmado solo `completed` (RN-03), pero queda pendiente aclarar si la exclusión de $0 (RN-09) aplica al `unit_price` o al precio efectivamente cobrado post-descuento. |

---

## Notas de Contexto Técnico

> Esta sección documenta lo relevante del código existente. No prescribe decisiones técnicas.

- El dashboard actual vive en `apps/backoffice/src/app/(app)/page.tsx` (ruta raíz del grupo `(app)`).
- Los repositorios relevantes: `orders.getTotalSales()`, `orders.getTotal()`, `users.getTotal()`, `products.getBestSelling()` — todos sin parámetros de fecha actualmente.
- El componente de date-range picker ya existe en `packages/ui` (fue creado para el módulo de órdenes).
- El patrón de filtros vía `searchParams` ya está implementado en el módulo de órdenes — puede reutilizarse como referencia.
- `getTotalSales` tiene un `console.log('orders', data)` hardcodeado que debe limpiarse.
- El `user_id` hardcodeado en `getTotalSales` debe migrarse a `EXCLUDED_USER_IDS = [process.env.EXCLUDED_USER_1]` (decisión PQ-01). Esta constante debe aplicarse en todas las queries de KPI, no solo en `getTotalSales`.

---

_Documento aprobado — Belu Mont Patisserie Backoffice_  
_Próximo paso: invocar `@orchestrator` para iniciar el flujo técnico de implementación._
