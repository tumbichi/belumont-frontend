# PRD — 001: Tienda de Pastelería (Patisserie Shop)

| Campo      | Valor                               |
| ---------- | ----------------------------------- |
| Feature ID | `001-patisserie-shop`               |
| Producto   | Belu Mont Patisserie                |
| Autora     | soybelumont                         |
| Versión    | v1.2                                |
| Estado     | Aprobado                            |
| Fecha      | 2026-04-26                          |
| Plataforma | Next.js monorepo (web + backoffice) |

---

## 1. Resumen ejecutivo

Belu Mont Patisserie es un emprendimiento de **pastelería artesanal 100% SIN GLUTEN** ubicado en Baradero, Argentina. Actualmente los pedidos se gestionan de forma manual por WhatsApp e Instagram Direct, lo que genera fricción tanto para la clienta como para sus clientes.

Esta feature introduce un **catálogo público de productos** en la web (`/pasteleria`) y un **flujo de pedido asistido por WhatsApp**: el cliente selecciona productos y cantidades, completa sus datos básicos, y con un botón envía un mensaje pre-formateado directamente a la cuenta de WhatsApp de Belu Mont.

El backoffice (`soybelumont`) permitirá gestionar el catálogo de productos de pastelería de forma autónoma: crear, editar, activar y desactivar productos.

> 🌾 **Diferenciador central de la marca**: TODOS los productos son **SIN GLUTEN**. Esta característica debe ser visible y prominente en el catálogo y en el mensaje de WhatsApp.

No se procesa ningún pago en la plataforma. El pago sigue siendo por transferencia bancaria, acordado por fuera.

---

## 2. Objetivos de negocio y métricas de éxito

### Objetivos

| #   | Objetivo                                                                                       |
| --- | ---------------------------------------------------------------------------------------------- |
| 1   | Reducir la fricción en el proceso de pedido para los clientes                                  |
| 2   | Eliminar la necesidad de que Belu describa los productos una y otra vez en cada chat           |
| 3   | Proveer a Belu un panel de control para gestionar su catálogo sin depender de un desarrollador |
| 4   | Presentar profesionalmente los productos con fotos, precios y descripciones                    |
| 5   | Filtrar de manera pasiva pedidos de fuera de Baradero (retiro en domicilio, sin envíos)        |
| 6   | Comunicar de forma clara y consistente que todos los productos son SIN GLUTEN                  |

### Métricas de éxito (v1)

| Métrica               | Descripción                                                        |
| --------------------- | ------------------------------------------------------------------ |
| Pedidos vía WhatsApp  | Aumento de pedidos con mensaje pre-formateado vs. mensajes libres  |
| Tiempo de gestión     | Reducción del tiempo que Belu dedica a explicar productos por chat |
| Adopción del catálogo | Clientes que envían el formulario vs. los que escriben libremente  |
| Catálogo activo       | Belu gestiona el catálogo sin asistencia técnica                   |

---

## 3. Usuarios y contexto de uso

### Cliente final (comprador)

- **Quién**: Habitantes de Baradero y zonas aledañas que conocen a Belu Mont por Instagram o recomendaciones. Muchos buscan específicamente productos sin gluten.
- **Contexto**: Navegan desde el celular, buscan ver los productos disponibles, sus precios y cómo encargarlos.
- **Motivación**: Quieren hacer un pedido rápido y claro sin tener que preguntar qué hay disponible.
- **Limitación clave**: Solo pueden retirar en el domicilio de Belu en Baradero. No hay envíos en v1.

### Administradora (soybelumont)

- **Quién**: La dueña del emprendimiento, única usuaria del backoffice.
- **Contexto**: Gestiona su negocio desde el celular o PC, actualiza el catálogo según lo que decide producir cada semana. **El modelo es por encargo**: activa productos cuando decide producirlos, los desactiva cuando no.
- **Motivación**: Quiere autonomía para publicar, editar y pausar productos sin depender de nadie.

---

## 4. Historias de usuario

### 4.1 Cliente final

| ID   | Historia                                                                                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| U-01 | Como cliente, quiero ver el catálogo de productos de pastelería SIN GLUTEN con fotos, nombres, descripciones y precios, para decidir qué quiero pedir.                                                |
| U-02 | Como cliente, quiero filtrar o explorar productos por categoría (ej: tortas, budines, alfajores), para encontrar lo que busco más rápido.                                                             |
| U-03 | Como cliente, quiero ver el detalle de un producto (foto ampliada, descripción, precio, porciones, información adicional), para tomar una decisión informada.                                         |
| U-04 | Como cliente, quiero agregar productos a un carrito con cantidades, para armar mi pedido completo antes de contactarme.                                                                               |
| U-05 | Como cliente, quiero ver un resumen de mi pedido con subtotales y total estimado, para saber cuánto voy a pagar.                                                                                      |
| U-06 | Como cliente, quiero ingresar mis datos básicos (nombre, apellido, teléfono, fecha deseada de retiro, notas opcionales) antes de enviar el pedido, para que Belu tenga toda la información necesaria. |
| U-07 | Como cliente, quiero que al hacer clic en "Confirmar pedido" se abra WhatsApp con un mensaje ya redactado con todos los detalles de mi pedido, para no tener que escribirlo manualmente.              |
| U-08 | Como cliente, quiero ver un aviso claro de que el retiro es solo en Baradero, para no generar expectativas de envío.                                                                                  |
| U-09 | Como cliente con intolerancia al gluten, quiero ver claramente que todos los productos son SIN GLUTEN, para confiar en que puedo consumirlos sin riesgo.                                              |
| U-10 | Como cliente que quiere encargar una torta de cumpleaños, quiero ser informado de que necesito pedirla con anticipación, para no hacer el pedido con poco tiempo.                                     |
| U-11 | Como cliente, quiero que mi carrito no se pierda si cierro accidentalmente la pestaña, para no tener que volver a armar mi pedido desde cero.                                                         |

### 4.2 Administradora (soybelumont)

| ID   | Historia                                                                                                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A-01 | Como administradora, quiero crear productos de pastelería con nombre, descripción, precio, categoría (texto libre), foto principal y miniatura, para publicarlos en el catálogo.              |
| A-02 | Como administradora, quiero editar cualquier dato de un producto existente, para mantener la información actualizada.                                                                         |
| A-03 | Como administradora, quiero activar o desactivar un producto con un toggle rápido, para reflejar lo que decido producir cada semana sin tener que eliminar el producto.                       |
| A-04 | Como administradora, quiero ver la lista de todos mis productos de pastelería con su estado actual (activo/inactivo), para tener una vista de gestión rápida.                                 |
| A-05 | Como administradora, quiero poder indicar que un producto está disponible, sin stock o es por encargo, para comunicar disponibilidad real a los clientes dentro del catálogo.                 |
| A-06 | Como administradora, quiero asignar una categoría libre a cada producto (ej: "Pan de molde", "Alfajores", "Tartas"), para organizar el catálogo según cómo yo lo defina, sin listas cerradas. |
| A-07 | Como administradora, quiero indicar cuántos días de anticipación requiere un producto (ej: tortas de cumpleaños = 3 días), para que ese dato aparezca en el catálogo y en el pedido.          |

---

## 5. Requerimientos funcionales

### 5.1 Catálogo público — Web (`/pasteleria`)

| ID   | Requerimiento                                                                                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-01 | Mostrar todos los productos con `active = true` ordenados por categoría o por fecha de creación.                                                                                                        |
| F-02 | Cada tarjeta de producto debe mostrar: miniatura, nombre, precio, estado de stock y el badge **"🌾 SIN GLUTEN"** de forma prominente. El badge aplica a TODOS los productos sin excepción.              |
| F-03 | Al hacer clic en un producto, navegar a `/pasteleria/[pathname]` con el detalle completo.                                                                                                               |
| F-04 | El detalle debe incluir: imagen principal, nombre, descripción, precio, categoría, estado de stock, badge SIN GLUTEN y datos del metadata (porciones, días de anticipación, etc.) si están disponibles. |
| F-05 | Mostrar un banner o disclaimer visible: _"Retiro solo en Baradero, Buenos Aires. Sin envíos. 🌾 Todos nuestros productos son SIN GLUTEN."_                                                              |
| F-06 | Los productos con `stock_status = 'out_of_stock'` se muestran pero con una indicación visual de sin stock y el botón de agregar deshabilitado. Belu gestiona este estado manualmente.                   |
| F-07 | Los productos con `stock_status = 'on_request'` se muestran con un badge _"Por encargo"_ y se pueden agregar al carrito. Este es el estado predominante dado el modelo de producción de Belu.           |

### 5.2 Carrito de pedido — Web

| ID   | Requerimiento                                                                                                                                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F-08 | El cliente puede agregar productos al carrito con una cantidad mínima de 1.                                                                            |
| F-09 | El carrito **persiste en `localStorage`** del navegador. Si el usuario cierra la pestaña o el navegador, el carrito se recupera al volver a la página. |
| F-10 | El cliente puede modificar la cantidad o eliminar productos del carrito.                                                                               |
| F-11 | El carrito muestra el subtotal por ítem y el total general del pedido.                                                                                 |
| F-12 | El carrito es accesible desde cualquier página del módulo de pastelería (ej: ícono flotante o en el header).                                           |

### 5.3 Formulario de pedido — Web

| ID   | Requerimiento                                                                                                                                                                                                                                                                                                                                                                |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-13 | Antes de enviar el pedido por WhatsApp, el cliente completa un formulario con los campos obligatorios: **Nombre**, **Apellido**, **Teléfono**, **Fecha deseada de retiro**. El campo de fecha debe manejar los siguientes escenarios según el tipo de producto en el carrito:                                                                                                |
|      | **a) Productos activos/disponibles**: el cliente puede elegir retiro el mismo día o el día siguiente.                                                                                                                                                                                                                                                                        |
|      | **b) Productos sin stock / por encargo**: el cliente selecciona una fecha futura mediante un date picker. El date picker **bloquea únicamente las fechas pasadas**; no hay restricciones por día de la semana.                                                                                                                                                               |
|      | **c) Productos con días de anticipación requeridos** (ej: tortas de cumpleaños con `metadata.dias_anticipacion = 3`): el date picker **bloquea las fechas con menos de 3 días de anticipación desde hoy** (hoy + 3 días = primera fecha seleccionable). Se muestra una nota de alerta indicando la anticipación mínima requerida. No hay restricciones por día de la semana. |
| F-14 | Campo opcional: **Notas adicionales** (ej: "con dedicatoria", "para el sábado a la tarde", etc.).                                                                                                                                                                                                                                                                            |
| F-15 | Validación client-side de campos obligatorios antes de habilitar el botón de envío.                                                                                                                                                                                                                                                                                          |
| F-16 | No se almacena ningún dato del pedido ni del cliente en la base de datos.                                                                                                                                                                                                                                                                                                    |

### 5.4 Redirección a WhatsApp

| ID   | Requerimiento                                                                                                                                                                                         |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-17 | El botón "Confirmar pedido" genera una URL `wa.me/{numero}?text={mensaje_codificado}` y la abre en una nueva pestaña/app.                                                                             |
| F-18 | El mensaje pre-formateado debe seguir el **formato especificado en la sección 7** de este documento.                                                                                                  |
| F-19 | El número de WhatsApp de destino se configura mediante la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER=5491151078024` (formato internacional sin `+`, sin guiones). Nunca debe estar hardcodeado. |

### 5.5 Backoffice — Gestión de productos (`/pasteleria`)

| ID   | Requerimiento                                                                                                                                                                                                                                                                             |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-20 | Listar todos los productos de pastelería con columnas: nombre, categoría, precio, stock, estado (activo/inactivo).                                                                                                                                                                        |
| F-21 | Botón para crear nuevo producto (redirige a `/pasteleria/crear`).                                                                                                                                                                                                                         |
| F-22 | Formulario de creación con campos: nombre, descripción, precio, pathname (slug), categoría (texto libre), estado de stock, imagen principal, miniatura, activo/inactivo.                                                                                                                  |
| F-23 | Formulario de edición idéntico al de creación, precargado con los datos actuales.                                                                                                                                                                                                         |
| F-24 | Acción de toggle activo/inactivo disponible directamente desde el listado (sin entrar al formulario).                                                                                                                                                                                     |
| F-25 | El campo `metadata` (JSONB) permite ingresar datos adicionales como porciones estimadas y días de anticipación requeridos, a través de campos específicos en el formulario. El campo `dias_anticipacion` (número entero) indica la anticipación mínima en días para productos especiales. |
| F-26 | El slug (`pathname`) se genera automáticamente desde el nombre pero puede editarse manualmente. Debe ser único.                                                                                                                                                                           |
| F-27 | Validación con Zod en el formulario de backoffice.                                                                                                                                                                                                                                        |

### 5.6 Nota general sobre casos borde

> 💬 **Canal de resolución de casos no cubiertos**: Cualquier detalle, excepción o caso borde que no esté contemplado en el formulario de pedido (ej.: personalización especial, dudas sobre ingredientes, cambios de último momento) se resuelve directamente mediante conversación por WhatsApp con Belu Mont. El formulario es una herramienta de inicio de pedido, no un sistema de configuración exhaustiva.

---

Los siguientes puntos están **explícitamente excluidos** de esta versión:

| Ítem excluido                                               | Posible versión futura |
| ----------------------------------------------------------- | ---------------------- |
| Servicio de entrega/envíos                                  | v2                     |
| Procesamiento de pagos en la plataforma (MercadoPago, etc.) | v2                     |
| Persistencia de pedidos en base de datos                    | v2                     |
| Sistema de notificaciones para Belu (email/push)            | v2                     |
| Registro o login de clientes                                | v2                     |
| Validación geográfica técnica (solo disclaimer visual)      | v2                     |
| Calendario de disponibilidad en tiempo real                 | v2                     |
| Historial de pedidos del cliente                            | v2                     |
| Pedidos personalizados con configurador                     | v3+                    |
| Gestión de inventario con stock numérico                    | v2                     |
| Restricciones de días hábiles en el date picker             | v2                     |
| Monto mínimo de pedido                                      | No aplica (sin mínimo) |

---

## 7. Especificación del mensaje de WhatsApp

### Formato esperado

El mensaje pre-formateado que se envía al WhatsApp de Belu Mont debe ser claro, legible y contener toda la información necesaria para que Belu confirme el pedido sin tener que pedir datos adicionales.

```
🧁 *Nuevo pedido — Belu Mont Patisserie*
🌾 Todos los productos son SIN GLUTEN

👤 *Datos del cliente*
• Nombre: [Nombre] [Apellido]
• Teléfono: [Teléfono]
• Fecha de retiro deseada: [DD/MM/YYYY]

🛒 *Detalle del pedido*
• [Cantidad]x [Nombre del producto] — $[Precio unitario] c/u
• [Cantidad]x [Nombre del producto] — $[Precio unitario] c/u
...

💰 *Total estimado: $[Total]*

📝 *Notas adicionales:*
[Notas del cliente, o "Sin notas." si no ingresó nada]

---
Pedido generado desde belumont.com.ar/pasteleria
```

### Notas sobre el formato

- Los precios son **estimados**; el precio final lo confirma Belu Mont.
- El total se calcula como suma de `precio × cantidad` de cada ítem.
- El mensaje usa **negrita de WhatsApp** (asteriscos) para mejorar legibilidad.
- Si el campo de notas está vacío, se escribe `"Sin notas adicionales."`.
- La línea `🌾 Todos los productos son SIN GLUTEN` es **fija e inamovible** en el mensaje — refleja el diferenciador de la marca.
- El número de WhatsApp se define mediante la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER=5491151078024` (formato internacional sin `+` ni guiones).

---

## 8. Requerimientos de UX/UI

### 8.1 Diseño general

- Seguir la paleta de colores y tipografía existente del sitio Belu Mont (rosa, crema, tipografías actuales).
- El módulo `/pasteleria` debe sentirse como una extensión natural del sitio, no un módulo ajeno.
- Diseño **mobile-first**: la mayoría de los clientes accederán desde el celular.
- El diferenciador **SIN GLUTEN** debe ser visualmente prominente en el header de la sección o en un banner fijo. No puede quedar oculto o en letra pequeña.

### 8.2 Catálogo

- Grid de tarjetas responsivo: 1 columna en mobile, 2 en tablet, 3 en desktop.
- Las tarjetas muestran la miniatura del producto de forma prominente.
- Cada tarjeta muestra el badge **"🌾 SIN GLUTEN"** — puede ser un chip de color verde claro o similar.
- Los productos sin stock deben verse visualmente diferenciados (ej: overlay gris, badge "Sin stock").
- Los productos "por encargo" deben tener un badge distintivo (ej: badge secundario "Por encargo").

### 8.3 Carrito

- El carrito puede implementarse como un panel lateral (drawer) o como una vista dedicada.
- El contador del carrito debe actualizarse en tiempo real al agregar/quitar productos.
- El usuario debe poder ver y modificar el carrito antes de completar sus datos.
- El carrito persiste automáticamente en `localStorage`; no requiere acción del usuario.

### 8.4 Flujo de pedido

- El flujo debe ser de **máximo 2 pasos**: (1) Carrito y confirmación de cantidades, (2) Datos del cliente + botón de envío.
- El botón de WhatsApp debe ser **grande, verde y visible** — usar el ícono de WhatsApp.
- Mostrar el total del pedido en todo momento durante el flujo.
- En el paso del formulario, si el carrito incluye productos con `dias_anticipacion`, mostrar una alerta informativa (ej: _"⚠️ Tu pedido incluye productos que requieren al menos X días de anticipación."_).

### 8.5 Disclaimer

- El aviso _"Retiro solo en Baradero. 🌾 Todos nuestros productos son SIN GLUTEN."_ debe estar visible en la página de catálogo **y** en el paso final antes de enviar.
- No debe ser intrusivo pero sí claramente legible.

### 8.6 Backoffice

- Reutilizar los componentes existentes: `ProductFormContent`, `GalleryManager`, `ImageDropZone`, `ProductTable`, `ThumbnailSection`.
- La tabla de listado debe incluir las acciones de editar y toggle de activo/inactivo por fila.
- El formulario de metadata debe incluir campos simples para porciones y `dias_anticipacion`, que se serializan en el JSONB.
- El campo `categoría` es un input de texto libre — no un select con opciones predefinidas.

---

## 9. Requerimientos no funcionales

| Categoría                | Requerimiento                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Performance**          | El catálogo público debe usar Server Side Rendering (SSR) o Static Generation (ISR) para SEO y velocidad de carga.          |
| **SEO**                  | Cada página de producto debe tener `title`, `description` y Open Graph tags generados dinámicamente.                        |
| **Accesibilidad**        | Contraste de color WCAG AA mínimo. Botones con labels descriptivos. Imágenes con alt text.                                  |
| **Seguridad**            | El backoffice requiere autenticación (ya implementada). El catálogo público no requiere auth.                               |
| **Disponibilidad**       | Sin SLA especial para v1; servicio best-effort.                                                                             |
| **Escalabilidad**        | La tabla `patisserie_products` es independiente de `products` para no contaminar el modelo existente.                       |
| **Internacionalización** | El contenido es exclusivamente en español. Usar `next-intl` con claves en `es.json` para strings de UI.                     |
| **Variables de entorno** | `NEXT_PUBLIC_WHATSAPP_NUMBER=5491151078024` — configurado en `.env.local` y en el entorno de producción. Nunca hardcodeado. |

---

## 10. Modelo de datos (referencia)

### Tabla: `patisserie_products`

| Campo           | Tipo          | Requerido | Descripción                                                                                                                                                                                      |
| --------------- | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`            | `uuid`        | ✅        | PK, generado automáticamente                                                                                                                                                                     |
| `name`          | `text`        | ✅        | Nombre del producto                                                                                                                                                                              |
| `description`   | `text`        | ✅        | Descripción detallada                                                                                                                                                                            |
| `price`         | `numeric`     | ✅        | Precio en ARS                                                                                                                                                                                    |
| `pathname`      | `text`        | ✅        | Slug único para la URL (`/pasteleria/[pathname]`)                                                                                                                                                |
| `image_url`     | `text`        | ❌        | URL de la imagen principal                                                                                                                                                                       |
| `thumbnail_url` | `text`        | ❌        | URL de la miniatura                                                                                                                                                                              |
| `active`        | `boolean`     | ✅        | Si aparece en el catálogo público. Belu activa/desactiva productos según su plan de producción semanal.                                                                                          |
| `category`      | `text`        | ❌        | **Texto libre** definido por Belu. Ejemplos iniciales: `"Pan de molde"`, `"Alfajores"`, `"Pastafrolas"`, `"Brownies"`, `"Budines"`, `"Tartas"`, `"Tortas de cumpleaños"`. No es un enum cerrado. |
| `stock_status`  | `text`        | ✅        | `available` / `out_of_stock` / `on_request`. Gestionado manualmente por Belu. Dado el modelo por encargo, `on_request` es el valor predominante.                                                 |
| `metadata`      | `jsonb`       | ❌        | Datos extra: porciones, días de anticipación requeridos para productos especiales, etc.                                                                                                          |
| `created_at`    | `timestamptz` | ✅        | Automático                                                                                                                                                                                       |
| `updated_at`    | `timestamptz` | ✅        | Automático                                                                                                                                                                                       |

### Notas sobre `category`

- El campo es texto libre: Belu escribe la categoría que desea al crear o editar un producto.
- No existe un enum en la base de datos ni en el frontend.
- Las categorías del catálogo actual (punto de partida, no lista cerrada): `Pan de molde`, `Alfajores`, `Pastafrolas`, `Brownies`, `Budines`, `Tartas`, `Tortas de cumpleaños`.

### Notas sobre `stock_status`

- El campo controla la presentación visual en el catálogo, no el stock numérico.
- El modelo de negocio es **100% por encargo**: Belu no maneja stock tradicional.
- El toggle `active` (boolean) es el control principal de visibilidad.
- `stock_status` agrega granularidad visual opcional: indicar si un producto activo está disponible inmediatamente, sin stock temporal, o siempre por encargo.

### Ejemplo de `metadata`

```json
{
  "porciones": "12 porciones",
  "dias_anticipacion": 3,
  "notas_elaboracion": "Requiere 3 días de anticipación mínimos para tortas de cumpleaños"
}
```

> El campo `dias_anticipacion` (entero) se usa en el formulario de pedido para mostrar alertas al cliente y sugerir la fecha mínima válida de retiro.

---

## 11. Rutas

### Web pública (`apps/web`)

| Ruta                     | Descripción                            |
| ------------------------ | -------------------------------------- |
| `/pasteleria`            | Catálogo completo de productos activos |
| `/pasteleria/[pathname]` | Detalle de un producto específico      |

### Backoffice (`apps/backoffice`)

| Ruta                | Descripción                                          |
| ------------------- | ---------------------------------------------------- |
| `/pasteleria`       | Listado de todos los productos (activos e inactivos) |
| `/pasteleria/crear` | Formulario de creación de producto                   |
| `/pasteleria/[id]`  | Formulario de edición de producto existente          |

---

## 12. Riesgos y preguntas abiertas

### Riesgos

| #    | Riesgo                                                                                | Probabilidad | Impacto | Mitigación                                                                           |
| ---- | ------------------------------------------------------------------------------------- | ------------ | ------- | ------------------------------------------------------------------------------------ |
| R-01 | El cliente no completa el formulario y contacta directo por WhatsApp de todas formas  | Alta         | Bajo    | El sistema sigue siendo un canal de apoyo, no de reemplazo                           |
| R-02 | Los precios en el catálogo quedan desactualizados                                     | Media        | Medio   | Belu debe tener el hábito de actualizar el backoffice; agregar recordatorio en la UI |
| R-03 | Pedidos de fuera de Baradero que ignoran el disclaimer                                | Media        | Bajo    | Belu los rechaza manualmente por WhatsApp como siempre                               |
| R-04 | Imágenes con tamaños no optimizados afectan la velocidad en mobile                    | Media        | Medio   | Documentar especificaciones de imagen recomendadas para el backoffice                |
| R-05 | El slug (`pathname`) duplicado genera un error de DB                                  | Baja         | Alto    | Validar unicidad en el formulario antes de guardar                                   |
| R-06 | El cliente no lee la alerta de anticipación y pide una torta de cumpleaños sin tiempo | Media        | Medio   | El mensaje de WhatsApp incluye la fecha deseada; Belu confirma manualmente           |

### Preguntas abiertas

| #    | Pregunta                                                                                      | Estado      | Respuesta                                                                                                                                                                                                                                                                                                                         |
| ---- | --------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-01 | ¿Las categorías son un listado fijo o Belu las define libremente?                             | ✅ Resuelto | Texto libre. Categorías iniciales: Pan de molde, Alfajores, Pastafrolas, Brownies, Budines, Tartas, Tortas de cumpleaños. No es un enum cerrado.                                                                                                                                                                                  |
| Q-02 | ¿Se muestran los productos "sin stock" en el catálogo o se ocultan?                           | ✅ Resuelto | No hay stock tradicional. El modelo es por encargo. El toggle `active` controla la visibilidad. `stock_status` agrega diferenciación visual opcional, gestionada manualmente por Belu.                                                                                                                                            |
| Q-03 | ¿El carrito se resetea al cerrar la pestaña o persiste en localStorage?                       | ✅ Resuelto | Persiste en `localStorage`.                                                                                                                                                                                                                                                                                                       |
| Q-04 | ¿Cuál es el número de WhatsApp de Belu Mont para configurar en producción?                    | ✅ Resuelto | `+54 9 11 5107-8024` → formato wa.me: `5491151078024`. Env var: `NEXT_PUBLIC_WHATSAPP_NUMBER=5491151078024`.                                                                                                                                                                                                                      |
| Q-05 | ¿El campo "Fecha de retiro" requiere validación de días hábiles o puede ser cualquier fecha?  | ✅ Resuelto | Tres escenarios: (a) activo → mismo día o día siguiente, (b) por encargo → date picker que bloquea solo fechas pasadas, sin restricciones de días de la semana, (c) productos con `dias_anticipacion` → bloqueo de fechas con menos de 3 días de hoy + alerta informativa. Sin restricciones por día de la semana en ningún caso. |
| Q-06 | ¿Se necesita alguna sección de "Pedido mínimo" o restricción de cantidad mínima?              | ✅ Resuelto | No hay monto mínimo de pedido.                                                                                                                                                                                                                                                                                                    |
| Q-07 | ¿Cuántos días de anticipación mínimos requieren las tortas de cumpleaños?                     | ✅ Resuelto | **3 días**. El date picker bloquea cualquier fecha con menos de 3 días de anticipación desde hoy (hoy + 3 días es la primera fecha seleccionable).                                                                                                                                                                                |
| Q-08 | ¿El date picker debe bloquear fechas pasadas únicamente, o también ciertos días de la semana? | ✅ Resuelto | **Bloquea solo fechas pasadas**. No hay restricciones por día de la semana. Aplica a todos los escenarios del date picker (escenarios b y c de F-13).                                                                                                                                                                             |

### Preguntas pendientes

_Todas las preguntas han sido resueltas. No hay preguntas pendientes en v1.2._

---

## 13. Fases futuras (fuera de v1)

| Fase                          | Descripción                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **v2 — Pedidos persistentes** | Guardar pedidos en DB, panel de gestión de pedidos para Belu, estados de pedido |
| **v2 — Envíos**               | Agregar opción de delivery a zonas cercanas con costo adicional                 |
| **v2 — Notificaciones**       | Email/WhatsApp automático de confirmación al cliente y a Belu                   |
| **v2 — Calendar picker**      | Restricciones de días hábiles y cierre de agenda en el date picker              |
| **v3 — Pagos en plataforma**  | Integración con MercadoPago para pagos online                                   |
| **v3 — Calendario**           | Visualización de disponibilidad por fecha para el cliente                       |
| **v3 — Personalización**      | Configurador de tortas personalizadas (sabor, relleno, cobertura, decoración)   |

---

_PRD actualizado el 2026-04-26. Versión 1.2 — Aprobado por soybelumont._
