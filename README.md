# soybelumont – Monorepo

Monorepo del proyecto **soybelumont**, la plataforma oficial de [Belu Mont](https://www.instagram.com/soybelumont/), creadora de contenido enfocada en cocina saludable y estilo de vida. Incluye la web pública y el backoffice de administración.

---

## 📦 Estructura del Monorepo

```
belumont-frontend/
├── apps/
│   ├── web/                # Sitio web público (tienda, blog, etc.)
│   └── backoffice/         # Panel de administración
├── packages/
│   ├── ui/                 # Librería de componentes compartidos (Radix UI)
│   ├── eslint-config/      # Configuración compartida de ESLint
│   └── typescript-config/  # Configuración compartida de TypeScript
├── supabase/               # Configuración local de Supabase
├── turbo.json              # Orquestación de tareas con Turbo
├── pnpm-workspace.yaml     # Definición del workspace de pnpm
└── package.json            # Scripts y dependencias del monorepo
```

| Paquete | Descripción | Puerto |
|---|---|---|
| `@soybelumont/web` | Sitio web público: tienda de recetarios, feed de Instagram, pagos | `3000` |
| `@soybelumont/backoffice` | Panel de administración: productos, órdenes, usuarios, promos | `3001` |
| `@soybelumont/ui` | Componentes de UI compartidos basados en Radix UI | – |
| `@soybelumont/eslint-config` | Reglas de ESLint (base, React, Next.js) | – |
| `@soybelumont/typescript-config` | Opciones compartidas del compilador TypeScript | – |

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [Radix UI](https://www.radix-ui.com/)
- **Formularios:** React Hook Form + Zod
- **Package Manager:** [pnpm 9](https://pnpm.io/)
- **Build System:** [Turbo](https://turbo.build/)
- **Backend:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Pagos:** Mercado Pago
- **Emails:** Resend
- **Storage:** AWS S3 (Backoffice)
- **i18n:** next-intl

---

## 🚀 Inicio Rápido

### Prerrequisitos

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9.13.0

### Instalación

```bash
git clone https://github.com/tumbichi/belumont-frontend.git
cd belumont-frontend
pnpm install
```

### Variables de entorno

Crear un archivo `.env.local` en cada app (`apps/web` y `apps/backoffice`) con las variables necesarias.

### Desarrollo

```bash
# Iniciar todas las apps en paralelo
pnpm dev

# Iniciar solo el backoffice
pnpm dev:backoffice
```

- Web: [http://localhost:3000](http://localhost:3000)
- Backoffice: [http://localhost:3001](http://localhost:3001)

---

## 📜 Scripts Disponibles

| Script | Descripción |
|---|---|
| `pnpm dev` | Inicia todas las apps en modo desarrollo |
| `pnpm dev:backoffice` | Inicia solo el backoffice en modo desarrollo |
| `pnpm build` | Compila todas las apps y paquetes |
| `pnpm build:web` | Compila solo la app web |
| `pnpm build:backoffice` | Compila solo el backoffice |
| `pnpm lint` | Ejecuta ESLint en todas las apps y paquetes |
| `pnpm check-types` | Verifica los tipos de TypeScript |
| `pnpm format` | Formatea el código con Prettier |
| `pnpm gen:types` | Genera tipos de TypeScript desde Supabase |

---

## 🔄 CI/CD

El repositorio utiliza GitHub Actions con dos workflows:

- **build:** Se ejecuta en PRs a `main`. Instala dependencias y compila todas las apps.
- **static-checks:** Se ejecuta en PRs a `main`. Corre ESLint y Prettier sobre los archivos modificados.

---

## 📖 Documentación por App

- [Web – README](./apps/web/README.md)
- [Backoffice – README](./apps/backoffice/README.md)

---

## 📄 Licencia

Este proyecto es de código cerrado y pertenece a Belu Mont. Para consultas, colaboraciones o soporte, contactar a través de [Instagram](https://www.instagram.com/belu.mont/).
