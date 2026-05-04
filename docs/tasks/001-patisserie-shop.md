# Checklist de Implementación — 001-patisserie-shop

Este documento detalla las tareas de implementación para la feature "Tienda de Pastelería" (`001-patisserie-shop`), siguiendo el RFC `005-patisserie-shop`.

## FASE 0 — Base de datos y tipos

- [ ] **TASK-001** | `@backend-coder` | Crear archivo de migración de Supabase para `patisserie_products`
  - Archivo(s): `supabase/migrations/YYYYMMDD_create_patisserie_products.sql`
  - Notas: Usar el esquema SQL provisto en el RFC 005, sección 2.1.
- [ ] **TASK-002** | `@backend-coder` | Implementar políticas RLS para `patisserie_products`
  - Archivo(s): `supabase/migrations/YYYYMMDD_create_patisserie_products.sql`
  - Notas: Incluir políticas de lectura pública para productos activos y acceso completo para usuarios autenticados, según RFC 005, sección 2.1.
- [ ] **TASK-003** | `@backend-coder` | Regenerar tipos de Supabase para `apps/web`
  - Archivo(s): `apps/web/src/core/data/supabase/types/supabase.ts`
  - Notas: Ejecutar `pnpm supabase gen types typescript --local > apps/web/src/core/data/supabase/types/supabase.ts`.
- [ ] **TASK-004** | `@backend-coder` | Regenerar tipos de Supabase para `apps/backoffice`
  - Archivo(s): `apps/backoffice/src/core/data/supabase/types/supabase.ts`
  - Notas: Ejecutar `pnpm supabase gen types typescript --local > apps/backoffice/src/core/data/supabase/types/supabase.ts`.

## FASE 1 — Capa de datos (backend-coder)

### Web

- [ ] **TASK-005** | `@backend-coder` | Crear archivo de tipos `patisserie.types.ts` para la web
  - Archivo(s): `apps/web/src/modules/patisserie/types/patisserie.types.ts`
  - Notas: Definir `PatisserieMetadata`, `PatisserieProduct`, `CartItem`, `OrderFormData` según RFC 005, sección 3.
- [ ] **TASK-006** | `@backend-coder` | Crear servicio `getAllPatisserieProducts` para la web
  - Archivo(s): `apps/web/src/core/data/supabase/patisserie/services/getAllPatisserieProducts.ts`
  - Notas: Query `select * from patisserie_products where active = true order by category, name`. Referencia: `apps/web/src/core/data/supabase/products/services/getAllProducts.ts`.
- [ ] **TASK-007** | `@backend-coder` | Crear servicio `getPatisserieProductByPathname` para la web
  - Archivo(s): `apps/web/src/core/data/supabase/patisserie/services/getPatisserieProductByPathname.ts`
  - Notas: Query `select * from patisserie_products where pathname = $1 and active = true`. Referencia: `apps/web/src/core/data/supabase/products/services/getProductByPathname.ts`.
- [ ] **TASK-008** | `@backend-coder` | Crear `patisserie.repository.ts` para la web
  - Archivo(s): `apps/web/src/core/data/supabase/patisserie/patisserie.repository.ts`
  - Notas: Implementar `getAll` y `getByPathname`. Referencia: `apps/web/src/core/data/supabase/products/products.repository.ts`.
- [ ] **TASK-009** | `@backend-coder` | Crear `index.ts` para la capa de datos de patisserie en la web
  - Archivo(s): `apps/web/src/core/data/supabase/patisserie/index.ts`
  - Notas: Exportar el repositorio.

### Backoffice

- [ ] **TASK-010** | `@backend-coder` | Crear archivo de tipos `patisserie.types.ts` para backoffice
  - Archivo(s): `apps/backoffice/src/modules/patisserie/types/patisserie.types.ts`
  - Notas: Definir `PatisserieMetadata`, `PatisserieProduct`, `CreatePatisserieInput`, `UpdatePatisserieInput` según RFC 005, secciones 3 y 5.
- [ ] **TASK-011** | `@backend-coder` | Crear servicio `getAllPatisserieProducts` para backoffice
  - Archivo(s): `apps/backoffice/src/core/data/supabase/patisserie/services/getAllPatisserieProducts.ts`
  - Notas: Query `select * from patisserie_products order by category, name`. Referencia: `apps/backoffice/src/core/data/supabase/products/services/getAllProducts.ts`.
- [ ] **TASK-012** | `@backend-coder` | Crear servicio `getPatisserieProductById` para backoffice
  - Archivo(s): `apps/backoffice/src/core/data/supabase/patisserie/services/getPatisserieProductById.ts`
  - Notas: Query `select * from patisserie_products where id = $1`. Referencia: `apps/backoffice/src/core/data/supabase/products/services/getProductById.ts`.
- [ ] **TASK-013** | `@backend-coder` | Crear servicio `createPatisserieProduct` para backoffice
  - Archivo(s): `apps/backoffice/src/core/data/supabase/patisserie/services/createPatisserieProduct.ts`
  - Notas: Implementar lógica de inserción. Referencia: `apps/backoffice/src/core/data/supabase/products/services/createProduct.ts`.
- [ ] **TASK-014** | `@backend-coder` | Crear servicio `updatePatisserieProduct` para backoffice
  - Archivo(s): `apps/backoffice/src/core/data/supabase/patisserie/services/updatePatisserieProduct.ts`
  - Notas: Implementar lógica de actualización. Referencia: `apps/backoffice/src/core/data/supabase/products/services/updateProduct.ts`.
- [ ] **TASK-015** | `@backend-coder` | Crear servicio `togglePatisserieProductActive` para backoffice
  - Archivo(s): `apps/backoffice/src/core/data/supabase/patisserie/services/togglePatisserieProductActive.ts`
  - Notas: Implementar lógica para cambiar el estado `active`. Referencia: `apps/backoffice/src/core/data/supabase/products/services/toggleProductActive.ts`.
- [ ] **TASK-016** | `@backend-coder` | Crear `patisserie.repository.ts` para backoffice
  - Archivo(s): `apps/backoffice/src/core/data/supabase/patisserie/patisserie.repository.ts`
  - Notas: Implementar `getAll`, `getById`, `create`, `update`, `toggleActive`. Referencia: `apps/backoffice/src/core/data/supabase/products/products.repository.ts`.
- [ ] **TASK-017** | `@backend-coder` | Crear `index.ts` para la capa de datos de patisserie en backoffice
  - Archivo(s): `apps/backoffice/src/core/data/supabase/patisserie/index.ts`
  - Notas: Exportar el repositorio.

## FASE 2 — Backoffice (backend-coder + frontend-coder)

### 1. Zod schema

- [ ] **TASK-018** | `@backend-coder` | Crear esquema Zod para `createPatisserie.schema.ts`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/schemas/createPatisserie.schema.ts`
  - Notas: Definir `patisserieMetadataSchema` y `patisserieDetails` según RFC 005, sección 7.3.

### 2. Server actions

- [ ] **TASK-019** | `@backend-coder` | Crear Server Action `createPatisserieProduct`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/actions/createPatisserieProduct.ts`
  - Notas: Usar el servicio `createPatisserieProduct` del repositorio. Referencia: `apps/backoffice/src/modules/products/actions/createProduct.ts`.
- [ ] **TASK-020** | `@backend-coder` | Crear Server Action `updatePatisserieProduct`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/actions/updatePatisserieProduct.ts`
  - Notas: Usar el servicio `updatePatisserieProduct` del repositorio. Referencia: `apps/backoffice/src/modules/products/actions/updateProduct.ts`.
- [ ] **TASK-021** | `@backend-coder` | Crear Server Action `togglePatisserieProductActive`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/actions/togglePatisserieProductActive.ts`
  - Notas: Usar el servicio `togglePatisserieProductActive` del repositorio. Referencia: `apps/backoffice/src/modules/products/actions/toggleProductActive.ts`.
- [ ] **TASK-022** | `@backend-coder` | Crear Server Action `uploadAndUpdatePatisserieImage`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/actions/uploadAndUpdatePatisserieImage.ts`
  - Notas: Implementar lógica de subida de imagen y actualización de `image_url`/`thumbnail_url`. Referencia: `apps/backoffice/src/modules/products/actions/uploadAndUpdateProductImage.ts`.

### 3. Dumb components

- [ ] **TASK-023** | `@frontend-coder` | Crear componente `PatisserieTable`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/components/PatisserieTable.tsx`
  - Notas: Adaptar `ProductTable.tsx` (backoffice) para mostrar columnas `name`, `category`, `price`, `stock_status`, `active`.
- [ ] **TASK-024** | `@frontend-coder` | Crear componente `PatisserieFormContent`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/components/PatisserieFormContent.tsx`
  - Notas: Adaptar `ProductFormContent.tsx`. Incluir campos para `name`, `description`, `price`, `pathname`, `category`, `stock_status`, `active`, `metadata.porciones`, `metadata.alergenos`, `metadata.dias_anticipacion`. Implementar auto-generación de `pathname`.

### 4. Features

- [ ] **TASK-025** | `@frontend-coder` | Crear feature `PatisserieList`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/features/PatisserieList.tsx`
  - Notas: Obtener lista de productos de patisserie y renderizar `PatisserieTable`. Referencia: `apps/backoffice/src/modules/products/features/ProductsList.tsx`.
- [ ] **TASK-026** | `@frontend-coder` | Crear feature `PatisserieDetails`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/features/PatisserieDetails.tsx`
  - Notas: Orquestar formulario de edición y `PatisserieImageManager`. Referencia: `apps/backoffice/src/modules/products/features/ProductDetails.tsx`.
- [ ] **TASK-027** | `@frontend-coder` | Crear feature `CreatePatisserie`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/features/CreatePatisserie.tsx`
  - Notas: Orquestar formulario de creación. Referencia: `apps/backoffice/src/modules/products/features/CreateProduct.tsx`.
- [ ] **TASK-028** | `@frontend-coder` | Crear feature `PatisserieForm`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/features/PatisserieForm.tsx`
  - Notas: Wrapper de `react-hook-form` para `PatisserieFormContent`. Adaptar `ProductForm.tsx`.
- [ ] **TASK-029** | `@frontend-coder` | Crear feature `PatisserieHeader`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/features/PatisserieHeader.tsx`
  - Notas: Header con título y acciones. Adaptar `ProductHeader.tsx`.
- [ ] **TASK-030** | `@frontend-coder` | Crear feature `PatisserieImageManager`
  - Archivo(s): `apps/backoffice/src/modules/patisserie/features/PatisserieImageManager.tsx`
  - Notas: Lógica de subida de imagen principal y thumbnail. Reutilizar `ImageDropZone.tsx`. Adaptar `ProductImageManager.tsx`.

### 5. Routes

- [ ] **TASK-031** | `@frontend-coder` | Crear ruta `/pasteleria/page.tsx` para listado
  - Archivo(s): `apps/backoffice/src/app/(app)/pasteleria/page.tsx`
  - Notas: Renderizar `PatisserieList`.
- [ ] **TASK-032** | `@frontend-coder` | Crear ruta `/pasteleria/crear/page.tsx`
  - Archivo(s): `apps/backoffice/src/app/(app)/pasteleria/crear/page.tsx`
  - Notas: Renderizar `CreatePatisserie`.
- [ ] **TASK-033** | `@frontend-coder` | Crear ruta `/pasteleria/[id]/page.tsx`
  - Archivo(s): `apps/backoffice/src/app/(app)/pasteleria/[id]/page.tsx`
  - Notas: Renderizar `PatisserieDetails`.

### 6. Add patisserie link to backoffice navigation

- [ ] **TASK-034** | `@frontend-coder` | Agregar enlace a "Pastelería" en la navegación del backoffice
  - Archivo(s): `apps/backoffice/src/components/layout/Sidebar.tsx` (o similar)
  - Notas: Añadir un nuevo ítem de navegación que apunte a `/pasteleria`.

## FASE 3 — Web: Fundación (backend-coder)

- [ ] **TASK-035** | `@backend-coder` | Crear `CartContext.ts`
  - Archivo(s): `apps/web/src/modules/patisserie/context/CartContext.ts`
  - Notas: Definir `createContext<CartState>`.
- [ ] **TASK-036** | `@backend-coder` | Crear `CartProvider.tsx`
  - Archivo(s): `apps/web/src/modules/patisserie/context/CartProvider.tsx`
  - Notas: Implementar estado del carrito, sincronización con `localStorage` y lógica de `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
- [ ] **TASK-037** | `@backend-coder` | Crear `useCart.ts` hook
  - Archivo(s): `apps/web/src/modules/patisserie/hooks/useCart.ts`
  - Notas: Hook para consumir `CartContext`.
- [ ] **TASK-038** | `@backend-coder` | Crear `cartStorage.ts` utils
  - Archivo(s): `apps/web/src/modules/patisserie/utils/cartStorage.ts`
  - Notas: Implementar helpers para `localStorage` (`get`, `set`, `clear`).
- [ ] **TASK-039** | `@backend-coder` | Crear `formatWhatsAppMessage.ts` util
  - Archivo(s): `apps/web/src/modules/patisserie/utils/formatWhatsAppMessage.ts`
  - Notas: Implementar la función `formatWhatsAppMessage` según RFC 005, sección 6.5.
- [ ] **TASK-040** | `@backend-coder` | Crear `useWhatsAppOrder.ts` hook
  - Archivo(s): `apps/web/src/modules/patisserie/hooks/useWhatsAppOrder.ts`
  - Notas: Hook para construir la URL de WhatsApp y abrirla. Usar `formatWhatsAppMessage` y `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## FASE 4 — Web: Componentes UI (frontend-coder)

- [ ] **TASK-041** | `@frontend-coder` | Crear componente `StockBadge`
  - Archivo(s): `apps/web/src/modules/patisserie/components/StockBadge.tsx`
  - Notas: Badge visual para `available`, `on_request`, `out_of_stock`.
- [ ] **TASK-042** | `@frontend-coder` | Crear componente `PatisserieDisclaimer`
  - Archivo(s): `apps/web/src/modules/patisserie/components/PatisserieDisclaimer.tsx`
  - Notas: Banner "Retiro solo en Baradero · Todo SIN GLUTEN".
- [ ] **TASK-043** | `@frontend-coder` | Crear componente `PatisserieCard`
  - Archivo(s): `apps/web/src/modules/patisserie/components/PatisserieCard.tsx`
  - Notas: Tarjeta de producto con miniatura, nombre, precio, `StockBadge`, badge "SIN GLUTEN", botón agregar. Diseño mobile-first.
- [ ] **TASK-044** | `@frontend-coder` | Crear componente `PatisserieGrid`
  - Archivo(s): `apps/web/src/modules/patisserie/components/PatisserieGrid.tsx`
  - Notas: Grid responsivo 1/2/3 columnas para `PatisserieCard`.
- [ ] **TASK-045** | `@frontend-coder` | Crear componente `CartItem`
  - Archivo(s): `apps/web/src/modules/patisserie/components/CartItem.tsx`
  - Notas: Fila de ítem con imagen, nombre, precio, controles de cantidad (+/-).
- [ ] **TASK-046** | `@frontend-coder` | Crear componente `CartDrawer`
  - Archivo(s): `apps/web/src/modules/patisserie/components/CartDrawer.tsx`
  - Notas: Panel lateral del carrito con lista de ítems, resumen y botón de checkout.
- [ ] **TASK-047** | `@frontend-coder` | Crear componente `OrderForm`
  - Archivo(s): `apps/web/src/modules/patisserie/components/OrderForm.tsx`
  - Notas: Formulario de datos del cliente con date picker y lógica de `minDaysAhead` según RFC 005, sección 6.4.

## FASE 5 — Web: Features y rutas (frontend-coder)

- [ ] **TASK-048** | `@frontend-coder` | Crear feature `PatisserieCatalog`
  - Archivo(s): `apps/web/src/modules/patisserie/features/PatisserieCatalog.tsx`
  - Notas: Obtiene productos (SSR) y renderiza `PatisserieGrid`.
- [ ] **TASK-049** | `@frontend-coder` | Crear feature `PatisserieCheckout`
  - Archivo(s): `apps/web/src/modules/patisserie/features/PatisserieCheckout.tsx`
  - Notas: Resumen del carrito y `OrderForm`.
- [ ] **TASK-050** | `@frontend-coder` | Modificar `layout.tsx` para envolver con `CartProvider`
  - Archivo(s): `apps/web/src/app/pasteleria/layout.tsx`
  - Notas: Asegurar que `CartProvider` esté disponible para todas las rutas de pastelería.
- [ ] **TASK-051** | `@frontend-coder` | Crear ruta `/pasteleria/page.tsx`
  - Archivo(s): `apps/web/src/app/pasteleria/page.tsx`
  - Notas: Renderizar `PatisserieCatalog`. Configurar SSR con `revalidate = 3600`.
- [ ] **TASK-052** | `@frontend-coder` | Crear ruta `/pasteleria/[pathname]/page.tsx`
  - Archivo(s): `apps/web/src/app/pasteleria/[pathname]/page.tsx`
  - Notas: Mostrar detalle de producto. Implementar `generateStaticParams` y `revalidate = 3600`.

## FASE 6 — i18n

- [ ] **TASK-053** | `@frontend-coder` | Agregar claves i18n a `es.json` para la web
  - Archivo(s): `apps/web/src/core/i18n/resources/es.json`
  - Notas: Incluir todas las claves de la sección 9 del RFC 005 para la web.
- [ ] **TASK-054** | `@frontend-coder` | Agregar claves i18n a `es.json` para backoffice
  - Archivo(s): `apps/backoffice/src/core/i18n/resources/es.json`
  - Notas: Incluir todas las claves de la sección 9 del RFC 005 para backoffice.

## FASE 7 — Variables de entorno

- [ ] **TASK-055** | `@backend-coder` | Añadir `NEXT_PUBLIC_WHATSAPP_NUMBER` a `.env.local` de la web
  - Archivo(s): `apps/web/.env.local`
  - Notas: Establecer el número de WhatsApp según RFC 005, sección 8.
- [ ] **TASK-056** | `@backend-coder` | Añadir `NEXT_PUBLIC_WHATSAPP_NUMBER` a `.env.example` de la web
  - Archivo(s): `apps/web/.env.example`
  - Notas: Documentar la variable de entorno para otros desarrolladores.
