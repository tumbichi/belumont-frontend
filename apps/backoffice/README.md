# @soybelumont/backoffice

Panel de administración del proyecto **soybelumont**. Permite gestionar productos, órdenes, usuarios y códigos promocionales de la tienda de recetarios saludables de [Belu Mont](https://www.instagram.com/soybelumont/).

> **Nota:** Este proyecto forma parte del [monorepo belumont-frontend](../../README.md).

---

## ✨ Funcionalidades

- **Gestión de Productos:** Vista de lista con nombre, precio, pathname y estado (activo/inactivo).
- **Gestión de Órdenes:** Vista de lista con ID de orden, cliente, producto, estado de orden y estado de pago.
- **Gestión de Usuarios:** Vista de lista con email, nombre y fecha de creación.
- **Gestión de Códigos Promocionales:** Vista de lista con código, tipo y valor de descuento, usos, fecha de expiración y estado.
- **Autenticación:** Login con Supabase Auth.
- **Subida de archivos:** Integración con AWS S3 para gestión de assets.

---

## 🛠️ Tecnologías

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (PostgreSQL + Auth vía SSR)
- [AWS S3](https://aws.amazon.com/s3/) (Storage)
- [Radix UI](https://www.radix-ui.com/) (via `@soybelumont/ui`)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [next-intl](https://next-intl.dev/) (i18n)

---

## 🚀 Desarrollo

Desde la raíz del monorepo:

```bash
# Instalar dependencias (si no se hizo)
pnpm install

# Iniciar solo el backoffice
pnpm dev:backoffice
```

O desde esta carpeta:

```bash
pnpm dev
```

Abrir [http://localhost:3001](http://localhost:3001) en el navegador.

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── (app)/              # Rutas protegidas del backoffice
│   │   ├── productos/      # Gestión de productos
│   │   ├── ordenes/        # Gestión de órdenes
│   │   ├── usuarios/       # Gestión de usuarios
│   │   ├── promociones/    # Gestión de códigos promocionales
│   │   ├── layout.tsx      # Layout principal del backoffice
│   │   └── page.tsx        # Página de inicio (dashboard)
│   ├── api/                # Rutas de API internas
│   └── login/              # Página de inicio de sesión
├── core/
│   ├── components/         # Componentes UI genéricos
│   ├── data/               # Acceso a datos (Supabase, servicios)
│   ├── i18n/               # Configuración de internacionalización
│   ├── lib/                # Funciones de utilidad
│   └── utils/              # Utilidades generales
└── modules/
    ├── auth/               # Módulo de autenticación
    └── products/           # Módulo de productos
```

---

## 📜 Scripts

| Script | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo en el puerto 3001 |
| `pnpm build` | Compila la aplicación para producción |
| `pnpm start` | Inicia la aplicación compilada |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm check-types` | Verifica los tipos de TypeScript |

---

## 📖 Documentación Adicional

- [Alcance del MVP](./docs/MVP_SCOPE.md)
- [Plan de Ejecución](./docs/EXECUTION_PLAN.md)
