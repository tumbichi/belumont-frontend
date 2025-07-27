[Read in English](./README.md)

# soybelumont

Bienvenido al repositorio **soybelumont**, la aplicación web oficial de [Belu Mont](https://www.instagram.com/soybelumont/), creadora de contenido enfocada en cocina saludable y estilo de vida. Construida con **Next.js** y **TypeScript**, esta plataforma está diseñada para evolucionar como el portafolio personal y blog de Belu, ofreciendo un espacio único para inspirar y conectar con una comunidad apasionada por la cocina, los viajes y el bienestar.

> **Nota:** Actualmente, la aplicación se encuentra en una fase inicial y la principal funcionalidad disponible es una tienda de recetarios saludables.

---

## ✨ Características principales

- **Tienda de recetarios saludables:** Descubre y adquiere recetarios digitales creados por Belu Mont, con recetas fáciles, nutritivas y deliciosas para incorporar a tu día a día.
- **Arquitectura moderna:** Next.js para SSR/SSG, TypeScript para robustez y escalabilidad.
- **Preparada para crecer:** El sitio está pensado para albergar próximamente:
  - Blog de recetas y tips de cocina.
  - Sección de viajes y experiencias.
  - Colaboraciones con marcas.
  - Galería de contenido multimedia.

---

## 🛠️ Tecnologías utilizadas

- [Next.js](https://nextjs.org/) – Framework de React para aplicaciones web rápidas y escalables.
- [TypeScript](https://www.typescriptlang.org/) – Tipado estático para mayor robustez.
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS "utility-first".
- [pnpm](https://pnpm.io/) - Gestor de paquetes rápido y eficiente.

---

## 🚀 Instalación y uso local

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tumbichi/belumont-frontend.git
   cd belumont-frontend
   ```

2. **Instala las dependencias:**

   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y añade las variables de entorno necesarias.

4. **Inicia la aplicación en modo desarrollo:**

   ```bash
   pnpm run dev
   ```

5. **Visita:** [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura del Proyecto

El proyecto sigue una organización modular y centrada en las funcionalidades para facilitar el mantenimiento y la escalabilidad.

```
/
├── .github/              # Workflows de GitHub Actions para CI/CD
├── public/               # Archivos estáticos (imágenes, logos)
├── src/
│   ├── app/              # Rutas principales de la aplicación (App Router de Next.js)
│   │   ├── api/          # Rutas de la API interna
│   │   ├── (paginas)/    # Diferentes páginas de la aplicación
│   │   └── layout.tsx    # Layout principal de la aplicación
│   │   └── page.tsx      # Página de inicio
│   ├── core/             # Lógica de negocio y componentes reutilizables
│   │   ├── components/   # Componentes UI genéricos (botones, cards, etc.)
│   │   ├── data/         # Lógica de acceso a datos (clientes de API, repositorios)
│   │   ├── hooks/        # Hooks de React personalizados
│   │   ├── lib/          # Funciones de utilidad
│   │   └── utils/        # Utilidades generales
│   └── modules/          # Módulos de funcionalidades específicas
│       ├── payments/     # Lógica y componentes relacionados con pagos
│       ├── products/     # Lógica y componentes para la gestión de productos
│       └── users/        # Lógica y componentes para la gestión de usuarios
├── .eslintrc.json        # Configuración de ESLint
├── next.config.ts        # Configuración de Next.js
├── package.json          # Dependencias y scripts del proyecto
├── pnpm-lock.yaml        # Lockfile de pnpm
├── tailwind.config.ts    # Configuración de Tailwind CSS
└── tsconfig.json         # Configuración de TypeScript
```

---

## 🔌 Rutas y Endpoints de la API

La aplicación expone varias rutas de API para gestionar la comunicación con servicios externos y la base de datos.

- **`POST /api/meta/instagram`**
  - **Descripción:** Obtiene las últimas publicaciones de la cuenta de Instagram de BeluMont.
  - **Uso:** Se utiliza en la página de inicio para mostrar el feed de Instagram.

- **`POST /api/payment`**
  - **Descripción:** Genera una URL de pago de Mercado Pago para la orden del cliente.
  - **Uso:** Se llama cuando el cliente procede al pago desde el carrito de compras.

- **`POST /api/payment/webhook`**
  - **Descripción:** Webhook que recibe notificaciones de Mercado Pago sobre el estado de los pagos.
  - **Uso:** Actualiza el estado de la orden en la base de datos cuando un pago es aprobado o rechazado.

- **`POST /api/resend/send-email-product`**
  - **Descripción:** Envía un correo electrónico al cliente con los detalles de su compra y el enlace de descarga del producto.
  - **Uso:** Se llama después de que un pago es aprobado con éxito.

---

## 👩‍🍳 Sobre Belu Mont

Belu Mont es una creadora de contenido argentina especializada en gastronomía saludable y estilo de vida. En sus redes comparte recetas, tips, experiencias de viaje y colaboraciones con marcas del sector wellness.

- [Instagram](https://www.instagram.com/soybelumont/)
- [TikTok](https://www.tiktok.com/@soybelumont)
- [YouTube](https://www.youtube.com/@soybelumont)

---

## 📄 Licencia

Este proyecto es de código cerrado y pertenece a Belu Mont. Para consultas, colaboraciones o soporte, por favor contacta a través de [Instagram](https://www.instagram.com/belu.mont/).

---
