# PRD — 002: Módulo de Gestión de Órdenes (Backoffice)

**Versión:** 1.2  
**Fecha:** Mayo 2026  
**Feature ID:** `002-backoffice-orders`  
**Estado:** Aprobado

---

## Changelog

| Versión | Fecha     | Cambios                                                                                                                                                                                                                                                                  |
| ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0     | Mayo 2026 | Borrador inicial                                                                                                                                                                                                                                                         |
| 1.1     | Mayo 2026 | Respuestas del cliente incorporadas. RF-15 y RF-16 eliminados del scope. Filtro por producto agregado. Navegación: panel lateral + página full `/ordenes/[id]`. Estados de orden confirmados. Proveedor `free` clarificado. Integración full MP API movida a Could Have. |
| 1.2     | Mayo 2026 | RF-21 escalado de Could Have (futuro) → Should Have. El endpoint de MP ya está integrado en el codebase; la decisión es de UX: carga on-demand via botón en el panel de detalle, sin bloquear la carga inicial.                                                          |

---

## Resumen Ejecutivo

Actualizar el módulo `/ordenes` del backoffice de Belu Mont Patisserie, pasando de una tabla de solo lectura a una experiencia de observabilidad completa. Belu debe poder filtrar órdenes por estado, fecha, cliente y producto; ver todos los detalles de cada orden (pago, código de descuento, producto, precio final) en un panel lateral; y navegar a una página de detalle completa. El módulo es **puramente informacional**: los estados de orden son gestionados automáticamente por el flujo de pagos de MercadoPago y no se modifican manualmente.

---

## Contexto de Negocio

Las órdenes se crean cuando un cliente completa el formulario de checkout en la web y hace clic en "ir a MercadoPago". A partir de ese momento, el estado de la orden avanza automáticamente a través de webhooks y callbacks de MercadoPago — **Belu no interviene en los cambios de estado**. El rol del backoffice es de observabilidad: Belu necesita ver qué está pasando, encontrar una orden rápido cuando un cliente le escribe por WhatsApp, y entender si el pago fue exitoso.

**Aclaración crítica sobre el flujo de estados:** Los estados de orden (`pending → paid → completed / cancelled`) son gestionados automáticamente por el sistema de pagos. Modificar el estado manualmente desde el backoffice generaría inconsistencias con el estado real en MercadoPago. Por este motivo, **la funcionalidad de cambio manual de estado queda explícitamente fuera de scope**.

**Contexto de volumen:** Hoy hay ~64 órdenes totales (10 regulares + 50 de promo gratuita + 4 recientes). La dueña tiene 80.000 seguidores en Instagram y planea publicidad en Meta Ads, con un objetivo mínimo de 1 venta por día. El volumen es impredecible; la paginación es esencial desde el inicio.

**Sin esta mejora**, Belu no tiene visibilidad rápida de órdenes pendientes, no puede identificar qué productos se venden más, y pierde tiempo buscando información dispersa cuando un cliente la contacta.

---

## Entidades de Negocio Relevantes

### Órdenes (`orders`)

| Campo                       | Descripción                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`                        | Identificador único de la orden                                                                                           |
| `created_at` / `updated_at` | Fechas de creación y última actualización                                                                                 |
| `product_id`                | El producto pedido (siempre uno; puede ser un pack compuesto)                                                             |
| `user_id`                   | El cliente que realizó la orden                                                                                           |
| `payment_id`                | Referencia al pago asociado. **Puede ser nulo** si el cliente inició el checkout pero no completó el pago en MercadoPago. |
| `status`                    | Estado actual de la orden — gestionado automáticamente (ver más abajo)                                                    |

### Pagos (`payments`)

| Campo           | Descripción                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| `amount`        | Monto final del pago (ya con descuento aplicado si hubo código promo)             |
| `provider`      | Proveedor de pago: `mercadopago` o `free`                                         |
| `provider_id`   | ID externo del pago en MercadoPago — útil para reconciliar con el dashboard de MP |
| `promo_code_id` | Código promocional aplicado (puede ser nulo)                                      |
| `status`        | Estado del pago proveniente de MercadoPago (ver más abajo)                        |

### Clientes (`users`)

| Campo   | Descripción        |
| ------- | ------------------ |
| `name`  | Nombre del cliente |
| `email` | Email del cliente  |

### Productos (`products`)

| Campo          | Descripción                                       |
| -------------- | ------------------------------------------------- |
| `name`         | Nombre del producto o pack                        |
| `price`        | Precio de lista del producto (antes de descuento) |
| `product_type` | Tipo de producto (ej. individual, bundle)         |

### Códigos de Descuento (`promo_code`)

| Campo            | Descripción                                             |
| ---------------- | ------------------------------------------------------- |
| `code`           | Código ingresado por el cliente                         |
| `discount_type`  | Tipo de descuento: `PERCENTAGE`, `FIXED`, `FIXED_PRICE` |
| `discount_value` | Valor del descuento aplicado                            |

---

## Estados

### Estados de Orden (`order_status`)

Gestionados automáticamente por el flujo de MercadoPago. **No modificables manualmente.**

| Estado      | Significado en el negocio                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `pending`   | El cliente completó el formulario y clickeó "ir a MercadoPago", pero el pago todavía no fue confirmado. No hay `payment_id` registrado aún. |
| `paid`      | El pago fue confirmado por MercadoPago. Estado transitorio (no dura mucho).                                                                 |
| `completed` | La orden fue entregada y el email de confirmación fue enviado exitosamente.                                                                 |
| `cancelled` | La orden fue cancelada. (El disparador exacto está pendiente de clarificación técnica — ver PQ-09 debajo.)                                  |

### Estados de Pago (`payment_status`)

Provenientes de MercadoPago:

| Estado         | Descripción                   |
| -------------- | ----------------------------- |
| `pending`      | Pago iniciado, no confirmado  |
| `approved`     | Pago aprobado                 |
| `authorized`   | Pago autorizado (pre-captura) |
| `in_process`   | En revisión por MercadoPago   |
| `in_mediation` | En disputa                    |
| `rejected`     | Rechazado                     |
| `cancelled`    | Cancelado                     |
| `refunded`     | Reembolsado                   |
| `charged_back` | Contracargo                   |

### Proveedor de Pago (`payment_provider`)

| Valor         | Significado en el negocio                                                                              | Label en UI                           |
| ------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| `mercadopago` | Pago procesado por MercadoPago                                                                         | "MercadoPago"                         |
| `free`        | Producto con 100% de descuento vía código promo — precio final = $0, no requiere procesamiento de pago | "Gratuito (código de descuento 100%)" |

---

## Historias de Usuario

> Todas desde la perspectiva de **Belu** como administradora del backoffice.

**HU-01 — Ver el estado completo de una orden**

> "Como Belu, quiero hacer clic en una orden de la tabla y ver todos sus detalles (producto, cliente, pago, código de descuento si aplica) en un panel lateral, para no tener que salir de la pantalla ni buscar en múltiples lugares."

**HU-02 — Filtrar órdenes por estado**

> "Como Belu, quiero filtrar la tabla por estado de orden (ej. solo 'pendientes'), para ver rápidamente el estado de mis pedidos."

**HU-03 — Filtrar por fecha**

> "Como Belu, quiero filtrar órdenes por rango de fechas, para revisar qué pedidos llegaron en una semana específica."

**HU-04 — Buscar por cliente**

> "Como Belu, quiero buscar un pedido por el nombre o email del cliente, para responder rápido cuando alguien me escribe por WhatsApp."

**HU-05 — Filtrar por producto**

> "Como Belu, quiero filtrar órdenes por producto, para entender cuáles se venden más y tomar decisiones de stock y publicidad."

**HU-06 — Ver el detalle del pago**

> "Como Belu, quiero ver el monto de lista, el monto final pagado, el método de pago y el estado del pago de cada orden, para saber si el cliente pagó, cuánto, y si se aplicó un descuento."

**HU-07 — Ver el código de descuento aplicado**

> "Como Belu, quiero saber qué código de descuento usó un cliente, para verificar que se aplicó correctamente y rastrear el uso de mis promos."

**HU-08 — Navegar grandes volúmenes de órdenes**

> "Como Belu, quiero que la tabla tenga paginación, para que la pantalla no se sature cuando haya muchos pedidos y todo cargue rápido."

**HU-09 — Ver el detalle completo en pantalla entera**

> "Como Belu, quiero poder abrir el detalle de una orden en una página completa (`/ordenes/[id]`), para poder revisarlo con más espacio o compartir el link si necesito."

---

## Requisitos Funcionales

### Tabla Principal de Órdenes

| #     | Requisito                                                                                                                | Prioridad (MoSCoW) |
| ----- | ------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| RF-01 | Mostrar en la tabla: ID de orden, cliente (nombre + email), producto, fecha de creación, estado de orden, estado de pago | **Must Have**      |
| RF-02 | Paginación de la tabla (20 órdenes por página)                                                                           | **Must Have**      |
| RF-03 | Filtro por estado de orden (selector múltiple: pending, paid, completed, cancelled)                                      | **Must Have**      |
| RF-04 | Filtro por rango de fechas (fecha desde / fecha hasta)                                                                   | **Must Have**      |
| RF-05 | Búsqueda por nombre o email del cliente                                                                                  | **Must Have**      |
| RF-06 | Filtro por producto (selector: nombre del producto)                                                                      | **Must Have**      |
| RF-07 | Filtro por estado de pago                                                                                                | **Should Have**    |
| RF-08 | Indicador visual de estado con colores (badge: verde = completed, amarillo = pending, azul = paid, rojo = cancelled)     | **Must Have**      |
| RF-09 | Ordenamiento de columnas clickeando el encabezado (fecha, estado)                                                        | **Could Have**     |

### Panel Lateral de Detalle

| #     | Requisito                                                                                                                                        | Prioridad (MoSCoW) |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| RF-10 | Al hacer clic en una fila, abrir un panel lateral con el detalle completo de la orden                                                            | **Must Have**      |
| RF-11 | Mostrar en el detalle: nombre del producto, tipo de producto, precio de lista                                                                    | **Must Have**      |
| RF-12 | Mostrar en el detalle: nombre y email del cliente                                                                                                | **Must Have**      |
| RF-13 | Mostrar en el detalle: monto de lista del producto, monto final pagado (`payments.amount`), proveedor de pago con label legible, estado del pago | **Must Have**      |
| RF-14 | Mostrar en el detalle: código de descuento aplicado, tipo y valor del descuento (si aplica). Si no hay descuento, no mostrar la sección.         | **Must Have**      |
| RF-15 | Mostrar en el detalle: fecha de creación y última actualización de la orden                                                                      | **Must Have**      |
| RF-16 | Mostrar en el detalle: `provider_id` de MercadoPago como referencia (link al dashboard de MP si es posible)                                      | **Should Have**    |
| RF-17 | Si `payment_id` es nulo, mostrar "Sin pago registrado" en la sección de pago                                                                     | **Must Have**      |
| RF-18 | Botón en el panel lateral para abrir la vista completa en `/ordenes/[id]`                                                                        | **Must Have**      |

### Página de Detalle Completa (`/ordenes/[id]`)

| #     | Requisito                                                                                                                         | Prioridad (MoSCoW) |
| ----- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| RF-19 | Página dedicada en `/ordenes/[id]` que muestra toda la información de la orden (misma info que el panel lateral, con más espacio) | **Must Have**      |
| RF-20 | Botón para volver a la tabla de órdenes                                                                                           | **Must Have**      |

### Mejoras Futuras (Could Have)

| #   | Requisito | Nota |
| --- | --------- | ---- |

### Should Have — pendiente de implementación

| #     | Requisito                                                                                                                                                                                                 | Nota                                                                                                                                                                                          |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-21 | Botón "Cargar detalle de pago" en el panel de detalle que realiza una llamada on-demand al endpoint de MercadoPago ya integrado para mostrar el detalle completo del pago (sin bloquear la carga inicial) | El endpoint de MP ya está integrado en el codebase — esto es una decisión de UX, no una nueva integración de backend. La carga es on-demand para no agregar latencia a la apertura del panel. |

---

## Fuera de Alcance (v1)

Los siguientes elementos quedan **explícitamente excluidos** de esta versión:

- **Cambio manual de estado de orden:** Los estados son gestionados automáticamente por el flujo de MercadoPago (webhooks/callbacks). Modificarlos manualmente generaría inconsistencias de datos. _(Razón del cambio respecto a v1.0: confirmado por la cliente en sesión de discovery.)_
- **Campo de notas o solicitudes especiales:** El esquema actual no tiene un campo de notas. Se postergará para una versión futura.
- **Fecha de retiro / entrega:** No existe en el esquema actual. Mejora futura.
- **Cantidad por orden:** Siempre = 1. Si se necesita cantidad variable en el futuro, requiere cambio de modelo de datos.
- **Exportación a CSV / Excel.**
- **Notificaciones automáticas al cliente.**
- **Historial de cambios de estado** (audit log) por orden.
- **Eliminación de órdenes** desde el backoffice.
- **Integración full con la API de MercadoPago** para obtener detalles extendidos de cada pago (ver RF-21 como mejora futura).

---

## Preguntas Resueltas

Las siguientes preguntas fueron respondidas por la cliente y están incorporadas al documento:

| #     | Pregunta                                           | Respuesta                                                                                                                                                                                                     |
| ----- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PQ-01 | ¿Cuáles son las transiciones de estado permitidas? | Los estados cambian automáticamente vía MercadoPago. Belu no puede ni debe cambiarlos manualmente. RF-15 y RF-16 eliminados.                                                                                  |
| PQ-02 | ¿Qué significa `payment_provider = free`?          | Producto con 100% de descuento vía código promo. Precio final = $0. Label: "Gratuito (código de descuento 100%)".                                                                                             |
| PQ-03 | ¿Hay órdenes con `payment_id = null`?              | Sí. Significa que el cliente inició el checkout pero no completó el pago. Mostrar "Sin pago registrado".                                                                                                      |
| PQ-04 | ¿Panel lateral o página separada?                  | Ambos: panel lateral al hacer clic en la fila + botón para abrir `/ordenes/[id]`.                                                                                                                             |
| PQ-05 | ¿Cuántas órdenes se esperan?                       | ~64 actuales. Volumen impredecible (80k seguidores en IG, Meta Ads en plan). Paginación = Must Have.                                                                                                          |
| PQ-06 | ¿Mostrar precio de lista y precio final pagado?    | Sí — mostrar ambos cuando hay descuento.                                                                                                                                                                      |
| PQ-07 | ¿Filtro por producto?                              | Sí — agregado como Must Have (RF-06).                                                                                                                                                                         |
| PQ-09 | ¿Qué significa cada estado de orden?               | Confirmado: `pending` = checkout iniciado sin pago, `paid` = pago confirmado (transitorio), `completed` = entregado + email enviado, `cancelled` = cancelado (disparador pendiente de clarificación técnica). |
| PQ-10 | ¿Mostrar `provider_id` de MP?                      | Sí, como referencia. Integración full con API de MP = Could Have para versión futura.                                                                                                                         |

---

## Preguntas Pendientes

| #      | Pregunta                                                                                                    | Impacto                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| PQ-08  | ¿Existe algún campo de notas o pedido especial que hoy Belu registra fuera del sistema (WhatsApp, libreta)? | Si la respuesta es sí en el futuro, requiere agregar campo a la BD.      |
| PQ-09b | ¿Cuál es el disparador exacto del estado `cancelled`? ¿Webhook de MP, acción manual, timeout?               | Afecta la descripción del estado en el glosario de la UI. No bloquea v1. |

---

## Notas de Contexto Técnico

> Esta sección documenta lo relevante del código existente. No prescribe decisiones técnicas.

- El repositorio de órdenes expone `updateStatus(id, status)` — este método **no se usará desde la UI del backoffice** en v1, dado que los estados son automáticos.
- La query actual en `getAllOrders` trae `users(name, email)`, `products(name)`, `payments(status)`. Deberá expandirse para incluir: `payments(amount, provider, provider_id, promo_code_id, status)` y el join a `promo_code(code, discount_type, discount_value)`.
- El enum `order_status` tiene 4 valores: `pending`, `paid`, `completed`, `cancelled`.
- El enum `payment_provider` tiene 2 valores: `mercadopago`, `free`.
- Los 9 estados de `payment_status` provienen de MercadoPago — solo se muestran, no se modifican.

---

_Documento aprobado — Belu Mont Patisserie Backoffice_  
_Próximo paso: invocar `@orchestrator` para iniciar el flujo técnico de implementación._
