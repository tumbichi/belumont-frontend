# Backoffice MVP Scope (v0 - Iteración 1: Solo Vistas de Lista)

El objetivo principal de esta primera iteración del MVP del Backoffice es proporcionar capacidades esenciales de visualización para la gestión de las operaciones de e-commerce de `soybelumont.com`.

## Características Clave (Solo Vistas de Lista):

1.  **Gestión de Productos:**
    *   **Vista de Lista:** Una tabla paginada y filtrable que muestre los productos con las siguientes columnas:
        *   `nombre`
        *   `precio`
        *   `pathname`
        *   `estado (activo/inactivo)`

2.  **Gestión de Órdenes:**
    *   **Vista de Lista:** Una tabla paginada y filtrable de órdenes, mostrando las siguientes columnas:
        *   `ID de orden`
        *   `cliente (email/nombre)`
        *   `producto`
        *   `estado de orden`
        *   `estado de pago`

3.  **Gestión de Usuarios:**
    *   **Vista de Lista:** Una tabla paginada y filtrable de usuarios con las siguientes columnas:
        *   `email`
        *   `nombre`
        *   `fecha de creación`

4.  **Gestión de Códigos Promocionales:**
    *   **Vista de Lista:** Una tabla paginada y filtrable de códigos promocionales con las siguientes columnas:
        *   `código`
        *   `tipo de descuento`
        *   `valor de descuento`
        *   `usos (actual/máximo)`
        *   `fecha de expiración`
        *   `estado (activo/inactivo)`

## Características Deseables (para futuras iteraciones):

*   **Dashboard:** Una vista general con métricas clave como ventas totales, número de órdenes, usuarios registrados y un resumen de productos más vendidos.

## Consideraciones Técnicas:

*   La aplicación del backoffice será una aplicación Next.js 15.
*   Utilizará el paquete `@soybelumont/ui` existente para los componentes de la interfaz de usuario.
*   La interacción con los datos será exclusivamente del lado del servidor utilizando Supabase.
*   La autenticación se implementará en una versión posterior (el MVP se centra en la gestión de datos, asumiendo un acceso autenticado).
