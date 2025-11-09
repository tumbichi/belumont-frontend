# Plan de Ejecución del MVP del Backoffice (Iteración 1: Vistas de Lista)

**Etapa 1: Gestión de Productos (Ya completada)**

*   [x] Crear la vista de lista para los productos.
*   [x] Utilizar el componente `Table` de `@soybelumont/ui`.
*   [x] Mostrar las columnas: `nombre`, `precio`, `pathname`, `estado (activo/inactivo)`.

**Etapa 2: Gestión de Órdenes**

*   **Tarea 1: Crear la página de Órdenes:**
    *   Crear el archivo `apps/backoffice/src/app/ordenes/page.tsx`.
*   **Tarea 2: Implementar la lógica de obtención de datos:**
    *   Crear un nuevo servicio en `apps/backoffice/src/core/data/supabase/orders/services/` para obtener todas las órdenes con la información del cliente y del producto.
    *   Actualizar el `orders.repository.ts` para incluir este nuevo servicio.
*   **Tarea 3: Implementar la vista de lista de Órdenes:**
    *   Utilizar el componente `Table` de `@soybelumont/ui`.
    *   Mostrar las columnas: `ID de orden`, `cliente (email/nombre)`, `producto`, `estado de orden`, `estado de pago`.

**Etapa 3: Gestión de Usuarios**

*   **Tarea 1: Crear la página de Usuarios:**
    *   Crear el archivo `apps/backoffice/src/app/usuarios/page.tsx`.
*   **Tarea 2: Implementar la lógica de obtención de datos:**
    *   Crear un nuevo servicio en `apps/backoffice/src/core/data/supabase/users/services/` para obtener todos los usuarios.
    *   Actualizar el `users.repository.ts` para incluir este nuevo servicio.
*   **Tarea 3: Implementar la vista de lista de Usuarios:**
    *   Utilizar el componente `Table` de `@soybelumont/ui`.
    *   Mostrar las columnas: `email`, `nombre`, `fecha de creación`.

**Etapa 4: Gestión de Códigos Promocionales**

*   **Tarea 1: Crear la página de Códigos Promocionales:**
    *   Crear el archivo `apps/backoffice/src/app/promociones/page.tsx`.
*   **Tarea 2: Implementar la lógica de obtención de datos:**
    *   Crear un nuevo servicio en `apps/backoffice/src/core/data/supabase/promos/services/` para obtener todos los códigos promocionales.
    *   Actualizar el `promos.repository.ts` para incluir este nuevo servicio.
*   **Tarea 3: Implementar la vista de lista de Códigos Promocionales:**
    *   Utilizar el componente `Table` de `@soybelumont/ui`.
    *   Mostrar las columnas: `código`, `tipo de descuento`, `valor de descuento`, `usos (actual/máximo)`, `fecha de expiración`, `estado (activo/inactivo)`.
