# Guía de SEO - Belu Mont

## Índice

1. [Estado actual del SEO](#estado-actual-del-seo)
2. [Qué se implementó](#qué-se-implementó)
3. [Guía: Agregar un nuevo recetario](#guía-agregar-un-nuevo-recetario)
4. [Buenas prácticas de SEO](#buenas-prácticas-de-seo)
5. [Herramientas recomendadas](#herramientas-recomendadas)
6. [Variables de entorno](#variables-de-entorno)

---

## Estado actual del SEO

### ✅ Implementado

- **Metadata global** optimizada con título, descripción y keywords relevantes
- **Open Graph tags** para compartir en redes sociales (Facebook, Instagram, WhatsApp)
- **Twitter Cards** para compartir en Twitter/X
- **Sitemap dinámico** (`/sitemap.xml`) que se genera automáticamente con todos los recetarios
- **Robots.txt** (`/robots.txt`) configurado para permitir indexación y bloquear rutas privadas
- **Metadata dinámica por producto** en cada página de recetario individual
- **Datos estructurados (JSON-LD)** tipo `Product` en cada recetario para rich snippets en Google
- **Alt text descriptivo** en las imágenes de productos
- **Title template** con formato `Nombre del Recetario | Belu Mont`

### ⚠️ Pendiente / Recomendado

- Configurar **Google Search Console** y enviar el sitemap
- Configurar la variable de entorno `NEXT_PUBLIC_BASE_URL` con la URL real del sitio
- Agregar una **imagen OG por defecto** para la página principal y la lista de recetarios
- Considerar agregar un **blog** con contenido relacionado a cocina saludable para mejorar el SEO orgánico
- Agregar **reviews/calificaciones** de clientes para mejorar los rich snippets

---

## Qué se implementó

### 1. Metadata del layout raíz (`src/app/layout.tsx`)

El layout principal define:
- **Título base**: "Belu Mont - Recetarios de Cocina Saludable"
- **Template de título**: `%s | Belu Mont` (las páginas hijas pueden poner su propio título)
- **Descripción** optimizada con palabras clave
- **Keywords** relevantes para el negocio
- **Open Graph y Twitter Cards** para redes sociales

### 2. Metadata de la página de recetarios (`src/app/recetarios/page.tsx`)

Título y descripción específicos para la página de listado de recetarios.

### 3. Metadata dinámica por recetario (`src/app/recetarios/[pathname]/page.tsx`)

Cada recetario genera automáticamente:
- Título con el nombre del producto
- Descripción usando la descripción del producto
- Imagen OG usando la imagen del producto
- Twitter Card con la imagen del producto

### 4. Datos estructurados JSON-LD (`src/app/recetarios/[pathname]/page.tsx`)

Cada recetario incluye datos estructurados de tipo `Product` con:
- Nombre del producto
- Descripción
- Imagen
- Precio en ARS
- Disponibilidad
- Marca "Belu Mont"

Esto permite que Google muestre **rich snippets** (resultados enriquecidos) con precio e imagen.

### 5. Sitemap dinámico (`src/app/sitemap.ts`)

Se genera automáticamente con:
- Página principal (prioridad 1.0)
- Página de recetarios (prioridad 0.9)
- Cada recetario individual (prioridad 0.8)

### 6. Robots.txt (`src/app/robots.ts`)

Configurado para:
- **Permitir** indexación de todas las páginas públicas
- **Bloquear** las rutas privadas: `/api/`, `/pago/`, `/detalle-de-compra`
- **Incluir** referencia al sitemap

---

## Guía: Agregar un nuevo recetario

Cuando agregues un nuevo recetario a la base de datos (Supabase), seguí estos pasos para asegurar un buen SEO:

### Paso 1: Elegir un buen `pathname` (slug)

El `pathname` es lo que aparece en la URL. Ejemplo: `/recetarios/recetario-fit-2024`

**Recomendaciones:**
- Usá palabras clave descriptivas
- Usá guiones (`-`) para separar palabras
- Todo en minúsculas, sin acentos ni caracteres especiales
- Que sea corto pero descriptivo

| ❌ Malo | ✅ Bueno |
|---------|---------|
| `rec1` | `recetario-cocina-saludable` |
| `nuevo_recetario` | `recetario-fit-desayunos` |
| `Recetario Fit!` | `recetario-postres-sin-azucar` |

### Paso 2: Escribir una buena descripción

La descripción del producto se usa como meta description en los resultados de Google.

**Recomendaciones:**
- Entre 120 y 160 caracteres
- Incluir palabras clave naturales
- Que sea atractiva y descriptiva
- Incluir un llamado a la acción

**Ejemplo:**
> "Recetario con 30 recetas saludables de desayunos fáciles y rápidos. Opciones dulces y saladas para empezar bien tu día. ¡Descargalo ahora!"

### Paso 3: Optimizar las imágenes

**Recomendaciones:**
- **Formato**: Usar WebP o JPEG optimizado
- **Tamaño**: Mínimo 1200x630px para la imagen principal (ideal para Open Graph)
- **Peso**: Menor a 200KB si es posible
- **Nombre del archivo**: Usar nombres descriptivos (ej: `recetario-desayunos-saludables.webp`)

### Paso 4: Elegir un buen nombre de producto

El nombre se usa como `<title>` de la página.

**Recomendaciones:**
- Que sea descriptivo y contenga palabras clave
- No demasiado largo (máximo 60 caracteres)

| ❌ Malo | ✅ Bueno |
|---------|---------|
| `Recetario 1` | `Recetario de Desayunos Saludables` |
| `Pack` | `Pack Completo: Recetas Fit 2024` |

### Paso 5: Verificar después de publicar

1. Visitá la página del recetario y verificá que:
   - El título del navegador muestra el nombre correcto
   - La URL es limpia y descriptiva
2. Compartí el link en WhatsApp o redes sociales y verificá que:
   - Se muestra la imagen correcta
   - El título y descripción son correctos
3. Verificá que el recetario aparece en el sitemap:
   - Visitá `tusitio.com/sitemap.xml`
   - Buscá el nuevo recetario en la lista

### Paso 6: Enviar a Google (opcional pero recomendado)

1. Ingresá a [Google Search Console](https://search.google.com/search-console)
2. En "Inspección de URLs", pegá la URL del nuevo recetario
3. Hacé clic en "Solicitar indexación"

Esto acelera el proceso de que Google indexe el nuevo recetario.

---

## Buenas prácticas de SEO

### Contenido

- **Descripciones únicas**: Cada recetario debe tener una descripción diferente
- **Palabras clave naturales**: No repetir palabras clave de forma forzada
- **Contenido de calidad**: Descripciones que realmente ayuden al usuario a decidir

### Imágenes

- Todas las imágenes deben tener **alt text descriptivo** (ya implementado automáticamente)
- Optimizar el peso de las imágenes antes de subirlas
- Usar dimensiones adecuadas (no subir imágenes de 5000px)

### URLs

- Mantener las URLs cortas y descriptivas
- No cambiar el `pathname` una vez publicado (se pierden los links indexados)
- Si es necesario cambiar una URL, configurar una redirección 301

### Redes sociales

- Cada recetario ya genera automáticamente las etiquetas Open Graph
- Al compartir en redes, se mostrará la imagen y descripción del recetario
- Para verificar cómo se ve: usar el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

### Rendimiento

- El sitio ya usa Next.js con optimización de imágenes automática
- Las páginas se renderizan del lado del servidor (SSR) lo cual es bueno para SEO
- Google prioriza sitios rápidos, mantener las imágenes optimizadas

---

## Herramientas recomendadas

| Herramienta | Uso | Link |
|------------|-----|------|
| Google Search Console | Monitorear indexación y errores | [search.google.com/search-console](https://search.google.com/search-console) |
| Google PageSpeed Insights | Medir velocidad del sitio | [pagespeed.web.dev](https://pagespeed.web.dev) |
| Facebook Sharing Debugger | Verificar Open Graph tags | [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) |
| Schema Markup Validator | Verificar datos estructurados | [validator.schema.org](https://validator.schema.org) |
| Google Rich Results Test | Probar rich snippets | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |

---

## Variables de entorno

Para que el SEO funcione correctamente, asegurate de tener configurada esta variable de entorno:

```env
NEXT_PUBLIC_BASE_URL=https://www.soybelumont.com
```

Esta variable se usa para:
- Generar las URLs del sitemap
- Generar la referencia al sitemap en el robots.txt

Si no está configurada, se usa `https://www.soybelumont.com` por defecto.
