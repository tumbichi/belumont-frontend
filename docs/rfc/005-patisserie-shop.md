# RFC 005 — Tienda de Pastelería (Patisserie Shop)

| Campo      | Valor                                          |
| ---------- | ---------------------------------------------- |
| RFC ID     | `005-patisserie-shop`                          |
| Feature ID | `001-patisserie-shop`                          |
| PRD        | `docs/product/features/001-patisserie-shop.md` |
| Autor      | Architect                                      |
| Versión    | v1.0                                           |
| Estado     | En revisión                                    |
| Fecha      | 2026-04-26                                     |

---

## 1. Overview

### Resumen

Implementación de una tienda de pastelería artesanal 100% **SIN GLUTEN** para Belu Mont Patisserie. Los clientes navegan el catálogo en `/pasteleria`, arman su pedido en un carrito client-side y confirman enviando un mensaje pre-formateado a WhatsApp. No hay procesamiento de pagos ni persistencia de pedidos en DB en v1.

### Restricciones principales

- **Sin auth** para clientes — navegación y pedido completamente públicos
- **Sin pagos en plataforma** — pago por transferencia acordado por fuera
- **Sin persistencia de pedidos** en DB — redirect puro a WhatsApp
- **Solo retiro en Baradero** — disclaimer visual, sin validación técnica
- **Todo SIN GLUTEN** — es el diferenciador central de la marca
- **Casos borde** se resuelven por WhatsApp directamente con Belu Mont

---

## 2. Base de datos

### 2.1 Tabla `patisserie_products`

```sql
-- Migration: supabase/migrations/YYYYMMDD_create_patisserie_products.sql

create table public.patisserie_products (
  id             uuid          primary key default gen_random_uuid(),
  name           text          not null,
  description    text          not null,
  price          numeric       not null check (price >= 0),
  pathname       text          not null unique,
  image_url      text,
  thumbnail_url  text,
  active         boolean       not null default true,
  category       text,
  stock_status   text          not null default 'on_request'
                   check (stock_status in ('available', 'out_of_stock', 'on_request')),
  metadata       jsonb,
  created_at     timestamptz   not null default now(),
  updated_at     timestamptz   not null default now()
);

-- Índices
create index patisserie_products_active_idx on public.patisserie_products (active);
create index patisserie_products_pathname_idx on public.patisserie_products (pathname);
create index patisserie_products_category_idx on public.patisserie_products (category);

-- RLS
alter table public.patisserie_products enable row level security;

-- Lectura pública: solo productos activos
create policy "Public read active patisserie products"
  on public.patisserie_products
  for select
  using (active = true);

-- Acceso completo para usuarios autenticados (backoffice)
create policy "Authenticated full access to patisserie products"
  on public.patisserie_products
  for all
  using (auth.role() = 'authenticated');
```

### 2.2 Ejemplo de `metadata`

```json
{
  "porciones": "12 porciones",
  "alergenos": "Contiene huevo, lácteos",
  "dias_anticipacion": 3
}
```

> **Nota**: `dias_anticipacion` es clave para la lógica del date picker en el frontend. Las tortas de cumpleaños llevan `dias_anticipacion: 3`.

### 2.3 Regeneración de tipos Supabase

Después de correr la migración:

```bash
# Web
pnpm supabase gen types typescript --local > apps/web/src/core/data/supabase/types/supabase.ts

# Backoffice
pnpm supabase gen types typescript --local > apps/backoffice/src/core/data/supabase/types/supabase.ts
```

---

## 3. Tipos TypeScript

Archivo: `apps/web/src/modules/patisserie/types/patisserie.types.ts`
(mismo tipo compartido o duplicado en backoffice)

```typescript
export interface PatisserieMetadata {
  porciones?: string;
  alergenos?: string;
  dias_anticipacion?: number;
}

export interface PatisserieProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  pathname: string;
  image_url: string | null;
  thumbnail_url: string | null;
  active: boolean;
  category: string | null;
  stock_status: 'available' | 'out_of_stock' | 'on_request';
  metadata: PatisserieMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  pathname: string;
  thumbnail_url?: string | null;
  metadata?: PatisserieMetadata | null;
}

export interface OrderFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_retiro: string; // formato DD/MM/YYYY
  notas?: string;
}
```

---

## 4. Capa de datos — Web

### Estructura

```
apps/web/src/core/data/supabase/patisserie/
├── patisserie.repository.ts
├── index.ts
└── services/
    ├── getAllPatisserieProducts.ts
    └── getPatisserieProductByPathname.ts
```

### `patisserie.repository.ts`

```typescript
import getAllPatisserieProducts from './services/getAllPatisserieProducts';
import getPatisserieProductByPathname from './services/getPatisserieProductByPathname';
import { PatisserieProduct } from '@/modules/patisserie/types/patisserie.types';

export interface PatisserieRepositoryReturn {
  getAll: () => Promise<PatisserieProduct[]>;
  getByPathname: (pathname: string) => Promise<PatisserieProduct | null>;
}

export const PatisserieRepository = (): PatisserieRepositoryReturn => ({
  getAll: getAllPatisserieProducts,
  getByPathname: getPatisserieProductByPathname,
});
```

### `services/getAllPatisserieProducts.ts`

- Query: `select * from patisserie_products where active = true order by category, name`
- Retorna: `PatisserieProduct[]`

### `services/getPatisserieProductByPathname.ts`

- Query: `select * from patisserie_products where pathname = $1 and active = true`
- Retorna: `PatisserieProduct | null`

---

## 5. Capa de datos — Backoffice

### Estructura

```
apps/backoffice/src/core/data/supabase/patisserie/
├── patisserie.repository.ts
├── index.ts
└── services/
    ├── getAllPatisserieProducts.ts
    ├── getPatisserieProductById.ts
    ├── createPatisserieProduct.ts
    ├── updatePatisserieProduct.ts
    └── togglePatisserieProductActive.ts
```

### `patisserie.repository.ts`

```typescript
export interface PatisserieRepositoryReturn {
  getAll: () => Promise<PatisserieProduct[]>;
  getById: (id: string) => Promise<PatisserieProduct | null>;
  create: (data: CreatePatisserieInput) => Promise<PatisserieProduct>;
  update: (
    id: string,
    data: UpdatePatisserieInput
  ) => Promise<PatisserieProduct>;
  toggleActive: (id: string, active: boolean) => Promise<void>;
}
```

### Tipos de input

```typescript
export type CreatePatisserieInput = Omit<
  PatisserieProduct,
  'id' | 'created_at' | 'updated_at'
>;
export type UpdatePatisserieInput = Partial<CreatePatisserieInput>;
```

---

## 6. Módulo Web — `apps/web/src/modules/patisserie/`

### 6.1 Estructura de archivos

```
modules/patisserie/
├── types/
│   └── patisserie.types.ts           # PatisserieProduct, CartItem, OrderFormData
├── context/
│   ├── CartContext.ts                # createContext<CartState>
│   └── CartProvider.tsx             # estado + localStorage sync
├── hooks/
│   ├── useCart.ts                   # consume CartContext
│   └── useWhatsAppOrder.ts          # construye URL wa.me con mensaje codificado
├── utils/
│   ├── formatWhatsAppMessage.ts     # formatea el mensaje según spec PRD §7
│   └── cartStorage.ts               # helpers localStorage (get/set/clear)
├── components/                      # Dumb — solo presentación
│   ├── PatisserieCard.tsx           # tarjeta de producto
│   ├── PatisserieGrid.tsx           # grid responsivo 1/2/3 columnas
│   ├── PatisserieDisclaimer.tsx     # aviso Baradero + SIN GLUTEN
│   ├── StockBadge.tsx               # badge de disponibilidad
│   ├── CartDrawer.tsx               # panel lateral del carrito
│   ├── CartItem.tsx                 # fila de ítem con controles de cantidad
│   └── OrderForm.tsx                # formulario de datos + botón WhatsApp
└── features/                        # Smart — lógica + datos
    ├── PatisserieCatalog.tsx         # obtiene productos (server), renderiza grid
    └── PatisserieCheckout.tsx        # resumen carrito + formulario de pedido
```

### 6.2 Rutas — `apps/web/src/app/pasteleria/`

```
app/pasteleria/
├── layout.tsx          # Envuelve con <CartProvider>
├── page.tsx            # → <PatisserieCatalog /> (SSR)
└── [pathname]/
    └── page.tsx        # Detalle de producto + botón "Agregar al carrito" (SSR + generateStaticParams)
```

### 6.3 Estado del carrito

```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: PatisserieProduct, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number; // calculado: sum(price * quantity)
  itemCount: number; // calculado: sum(quantity)
}
```

- **localStorage key**: `bm_patisserie_cart`
- Hidratación en `useEffect` al montar `CartProvider`
- Se persiste en cada cambio de estado

### 6.4 Lógica del date picker (`OrderForm`)

```typescript
// Mínimo de días de anticipación requeridos por el carrito
const minDaysAhead = Math.max(
  0,
  ...cartItems.map((item) => item.metadata?.dias_anticipacion ?? 0)
);

const minDate = addDays(new Date(), minDaysAhead);
// El date picker no permite seleccionar fechas anteriores a minDate
```

- Sin restricciones por día de la semana
- Casos: stock normal → minDaysAhead = 0 (desde hoy); torta de cumpleaños → minDaysAhead = 3

### 6.5 Spec del mensaje WhatsApp

```typescript
// formatWhatsAppMessage.ts
export function formatWhatsAppMessage(
  items: CartItem[],
  form: OrderFormData,
  total: number
): string {
  const detalles = items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} — $${item.price.toLocaleString('es-AR')} c/u`
    )
    .join('\n');

  return `🧁 *Nuevo pedido — Belu Mont Patisserie*
🌾 Todos los productos son SIN GLUTEN

👤 *Datos del cliente*
• Nombre: ${form.nombre} ${form.apellido}
• Teléfono: ${form.telefono}
• Fecha de retiro deseada: ${form.fecha_retiro}

🛒 *Detalle del pedido*
${detalles}

💰 *Total estimado: $${total.toLocaleString('es-AR')}*

📝 *Notas:* ${form.notas?.trim() || 'Sin notas adicionales.'}
---
Pedido generado desde belumont.com.ar/pasteleria`;
}

// useWhatsAppOrder.ts
export function useWhatsAppOrder() {
  const { items, total } = useCart();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // '5491151078024'

  const openWhatsApp = (form: OrderFormData) => {
    const message = formatWhatsAppMessage(items, form, total);
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return { openWhatsApp };
}
```

### 6.6 Descripción de componentes Dumb

| Componente             | Props principales                           | Responsabilidad                                                          |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| `PatisserieCard`       | `product: PatisserieProduct`, `onAddToCart` | Miniatura, nombre, precio, StockBadge, badge "SIN GLUTEN", botón agregar |
| `PatisserieGrid`       | `products: PatisserieProduct[]`             | Grid CSS 1/2/3 col responsivo                                            |
| `PatisserieDisclaimer` | —                                           | Banner "Retiro solo en Baradero · Todo SIN GLUTEN"                       |
| `StockBadge`           | `status: stock_status`                      | Badge visual: verde/amarillo/gris                                        |
| `CartDrawer`           | `isOpen`, `onClose`                         | Panel lateral con lista de items y resumen                               |
| `CartItem`             | `item: CartItem`, handlers                  | Fila con imagen, nombre, precio, +/- cantidad                            |
| `OrderForm`            | `onSubmit`, `minDate`                       | Formulario + validación + botón WhatsApp verde                           |

---

## 7. Módulo Backoffice — `apps/backoffice/src/modules/patisserie/`

### 7.1 Estructura de archivos

```
modules/patisserie/
├── schemas/
│   └── createPatisserie.schema.ts     # Zod
├── actions/                           # Server Actions
│   ├── createPatisserieProduct.ts
│   ├── updatePatisserieProduct.ts
│   ├── togglePatisserieProductActive.ts
│   └── uploadAndUpdatePatisserieImage.ts
├── components/                        # Dumb
│   ├── PatisserieTable.tsx            # tabla de listado
│   └── PatisserieFormContent.tsx      # campos del formulario
└── features/                          # Smart
    ├── PatisserieList.tsx             # obtiene lista + renderiza tabla
    ├── PatisserieDetails.tsx          # orquesta form de edición + imagen
    ├── CreatePatisserie.tsx           # orquesta form de creación
    ├── PatisserieForm.tsx             # react-hook-form wrapper
    ├── PatisserieHeader.tsx           # header con título y acciones
    └── PatisserieImageManager.tsx     # subida de imagen principal y thumbnail
```

### 7.2 Rutas — `apps/backoffice/src/app/(app)/pasteleria/`

```
app/(app)/pasteleria/
├── page.tsx          # PatisserieList
├── crear/page.tsx    # CreatePatisserie
└── [id]/page.tsx     # PatisserieDetails
```

### 7.3 Schema Zod

```typescript
// createPatisserie.schema.ts
import z from 'zod';

export const patisserieMetadataSchema = z.object({
  porciones: z.string().optional(),
  alergenos: z.string().optional(),
  dias_anticipacion: z.number().int().min(0).optional(),
});

export const patisserieDetails = z.object({
  name: z.string().min(2, 'PATISSERIE.VALIDATION.NAME_REQUIRED'),
  description: z.string().min(10, 'PATISSERIE.VALIDATION.DESCRIPTION_REQUIRED'),
  price: z.number().positive('PATISSERIE.VALIDATION.PRICE_POSITIVE'),
  pathname: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'PATISSERIE.VALIDATION.PATHNAME_FORMAT'),
  category: z.string().optional(),
  stock_status: z
    .enum(['available', 'on_request', 'out_of_stock'])
    .default('on_request'),
  active: z.boolean().default(true),
  metadata: patisserieMetadataSchema.optional(),
});

export type PatisserieDetailsInput = z.input<typeof patisserieDetails>;
```

### 7.4 Campos del formulario (`PatisserieFormContent`)

| Campo                        | Tipo UI       | Validación                                           |
| ---------------------------- | ------------- | ---------------------------------------------------- |
| `name`                       | Input text    | Requerido, min 2                                     |
| `description`                | Textarea      | Requerido, min 10                                    |
| `price`                      | Input number  | Requerido, positivo, en ARS                          |
| `pathname`                   | Input text    | Auto-generado desde `name`, editable, único          |
| `category`                   | Input text    | Opcional, texto libre (ej: tortas, budines...)       |
| `stock_status`               | Select        | available / on_request / out_of_stock                |
| `active`                     | Toggle/Switch | Default true                                         |
| `metadata.porciones`         | Input text    | Opcional                                             |
| `metadata.alergenos`         | Input text    | Opcional (nota: todos SIN GLUTEN, puede tener otros) |
| `metadata.dias_anticipacion` | Input number  | Opcional, entero ≥ 0                                 |

> **Auto-generación de pathname**: `name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')`

---

## 8. Variables de entorno

```bash
# apps/web/.env.local
NEXT_PUBLIC_WHATSAPP_NUMBER=5491151078024
```

---

## 9. Claves i18n

### Web — `apps/web/src/core/i18n/resources/es.json`

```json
{
  "patisserie": {
    "catalog": {
      "title": "Pastelería",
      "subtitle": "Artesanal · 100% Sin Gluten · Baradero",
      "empty": "No hay productos disponibles en este momento."
    },
    "disclaimer": {
      "pickup": "Retiro solo en Baradero, Buenos Aires.",
      "glutenFree": "Todos nuestros productos son 100% SIN GLUTEN.",
      "contact": "Cualquier consulta o detalle se coordina por WhatsApp."
    },
    "stock": {
      "available": "Disponible",
      "onRequest": "Por encargo",
      "outOfStock": "Sin stock"
    },
    "cart": {
      "title": "Tu pedido",
      "empty": "Tu carrito está vacío.",
      "total": "Total estimado",
      "checkout": "Confirmar pedido"
    },
    "form": {
      "nombre": "Nombre",
      "apellido": "Apellido",
      "telefono": "Teléfono",
      "fecha": "Fecha de retiro deseada",
      "notas": "Notas adicionales (opcional)",
      "submit": "Enviar pedido por WhatsApp",
      "dateHint": "Seleccioná la fecha en que querés retirar tu pedido."
    }
  }
}
```

### Backoffice — `apps/backoffice/src/core/i18n/resources/es.json`

```json
{
  "patisserie": {
    "title": "Pastelería",
    "create": "Nuevo producto",
    "table": {
      "name": "Nombre",
      "category": "Categoría",
      "price": "Precio",
      "stock": "Disponibilidad",
      "status": "Estado"
    },
    "form": {
      "name": "Nombre del producto",
      "description": "Descripción",
      "price": "Precio (ARS)",
      "pathname": "Slug (URL)",
      "category": "Categoría",
      "stockStatus": "Disponibilidad",
      "active": "Activo en catálogo",
      "porciones": "Porciones estimadas",
      "alergenos": "Alérgenos",
      "diasAnticipacion": "Días de anticipación requeridos"
    },
    "validation": {
      "nameRequired": "El nombre es requerido",
      "descriptionRequired": "La descripción es requerida",
      "pricePositive": "El precio debe ser positivo",
      "pathnameRequired": "El slug es requerido",
      "pathnameFormat": "Solo letras minúsculas, números y guiones"
    }
  }
}
```

---

## 10. Mapa de reutilización

| Existente                       | Reutilizado en Patisserie    | Notas                                               |
| ------------------------------- | ---------------------------- | --------------------------------------------------- |
| `ProductTable.tsx` (backoffice) | `PatisserieTable.tsx`        | Adaptar columnas (category, stock_status, price)    |
| `ProductFormContent.tsx`        | `PatisserieFormContent.tsx`  | Campos distintos; metadata como campos individuales |
| `ProductImageManager.tsx`       | `PatisserieImageManager.tsx` | Misma lógica de upload, misma UI                    |
| `ImageDropZone.tsx`             | Reutilización directa        | Sin cambios                                         |
| `GalleryManager.tsx`            | **No reutilizado en v1**     | Solo imagen principal + thumbnail                   |
| `ProductForm.tsx`               | `PatisserieForm.tsx`         | Adaptar schema y fields                             |
| `ProductHeader.tsx`             | `PatisserieHeader.tsx`       | Mismo patrón, texto diferente                       |
| `ProductsList.tsx`              | `PatisserieList.tsx`         | Adaptar a repositorio patisserie                    |
| `CreateProduct.tsx`             | `CreatePatisserie.tsx`       | Mismo patrón                                        |
| `ProductDetails.tsx`            | `PatisserieDetails.tsx`      | Sin sección de bundle ni PDF                        |
| Repository pattern              | Reutilización directa        | Nueva entidad, mismo patrón                         |
| Server Actions pattern          | Reutilización directa        | Nuevas actions para patisserie                      |
| `ProductCard.tsx` (web)         | **No reutilizado**           | Nuevo diseño mobile-first artesanal                 |
| `ProductGallery.tsx` (web)      | **No reutilizado en v1**     | Solo imagen principal                               |

---

## 11. Fuera de alcance (v1)

- Servicio de delivery / envíos
- Procesamiento de pagos en plataforma
- Persistencia de pedidos en DB
- Autenticación de clientes
- Validación geográfica técnica
- Galería de múltiples imágenes por producto
- Gestión de stock numérico
- Notificaciones automáticas (email / push)
- Calendario de disponibilidad en tiempo real
- Configurador de tortas personalizadas

---

## 12. Notas técnicas adicionales

### Cart sin Zustand

Se usa React Context + localStorage directamente. El proyecto no tiene un store global (no usa Zustand/Redux) y este carrito es un dominio aislado — no justifica agregar una nueva dependencia.

### SSR para SEO

- `/pasteleria` → SSR con revalidación cada hora (`revalidate = 3600`)
- `/pasteleria/[pathname]` → `generateStaticParams` + `revalidate = 3600`

### Diseño independiente en web

`PatisserieCard` y la página de catálogo tienen un diseño propio (mobile-first, estética artesanal) que difiere de `ProductCard`. El diseño final lo define `@frontend-coder` usando las skills `ui-ux-pro-max` e `interface-design`.

### Unicidad del pathname

Validar unicidad antes de submit en el backoffice mediante una server action de verificación, o manejar el error de constraint unique de Postgres y mostrarlo en el formulario.

---

_RFC generado el 2026-04-26. Versión 1.0._
