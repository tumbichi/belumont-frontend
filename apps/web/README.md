[Ver en español](./README.es.md)

# soybelumont

Welcome to the **soybelumont** repository, the official web application for [Belu Mont](https://www.instagram.com/soybelumont/), a content creator focused on healthy cooking and lifestyle. Built with **Next.js** and **TypeScript**, this platform is designed to evolve as Belu's personal portfolio and blog, offering a unique space to inspire and connect with a community passionate about cooking, travel, and wellness.

> **Note:** The application is currently in its initial phase, and the main available feature is a store for healthy cookbooks.

---

## ✨ Key Features

- **Healthy Cookbook Store:** Discover and purchase digital cookbooks created by Belu Mont, featuring easy, nutritious, and delicious recipes to incorporate into your daily life.
- **Modern Architecture:** Next.js for SSR/SSG, TypeScript for robustness and scalability.
- **Ready to Grow:** The site is planned to soon feature:
  - A blog with recipes and cooking tips.
  - A section for travel and experiences.
  - Brand collaborations.
  - A multimedia gallery.

---

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/) – A React framework for fast and scalable web applications.
- [TypeScript](https://www.typescriptlang.org/) – Static typing for enhanced robustness.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [pnpm](https://pnpm.io/) - A fast and disk-space-efficient package manager.

---

## 🚀 Local Installation and Usage

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tumbichi/belumont-frontend.git
   cd belumont-frontend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the project root and add the necessary environment variables.

4. **Start the application in development mode:**

   ```bash
   pnpm run dev
   ```

5. **Visit:** [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

The project follows a modular, feature-centric organization to facilitate maintenance and scalability.

```
/
├── .github/              # GitHub Actions workflows for CI/CD
├── public/               # Static files (images, logos)
├── src/
│   ├── app/              # Main application routes (Next.js App Router)
│   │   ├── api/          # Internal API routes
│   │   ├── (pages)/      # Different application pages
│   │   └── layout.tsx    # Main application layout
│   │   └── page.tsx      # Homepage
│   ├── core/             # Business logic and reusable components
│   │   ├── components/   # Generic UI components (buttons, cards, etc.)
│   │   ├── data/         # Data access logic (API clients, repositories)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── utils/        # General utilities
│   └── modules/          # Feature-specific modules
│       ├── payments/     # Logic and components related to payments
│       ├── products/     # Logic and components for product management
│       └── users/        # Logic and components for user management
├── .eslintrc.json        # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── pnpm-lock.yaml        # pnpm lockfile
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 🔌 API Routes and Endpoints

The application exposes several API routes to manage communication with external services and the database.

- **`POST /api/meta/instagram`**
  - **Description:** Fetches the latest posts from the BeluMont Instagram account.
  - **Usage:** Used on the homepage to display the Instagram feed.

- **`POST /api/payment`**
  - **Description:** Generates a Mercado Pago payment URL for the customer's order.
  - **Usage:** Called when the customer proceeds to checkout from the shopping cart.

- **`POST /api/payment/webhook`**
  - **Description:** A webhook that receives notifications from Mercado Pago about the status of payments.
  - **Usage:** Updates the order status in the database when a payment is approved or rejected.

- **`POST /api/resend/send-email-product`**
  - **Description:** Sends an email to the customer with their purchase details and a link to download the product.
  - **Usage:** Called after a payment is successfully approved.

---

## 👩‍🍳 About Belu Mont

Belu Mont is an Argentine content creator specializing in healthy gastronomy and lifestyle. On her social media, she shares recipes, tips, travel experiences, and collaborations with brands in the wellness sector.

- [Instagram](https://www.instagram.com/soybelumont/)
- [TikTok](https://www.tiktok.com/@soybelumont)
- [YouTube](https://www.youtube.com/@soybelumont)

---

## 📌 Next Steps

- [ ] Launch the blog with recipes and tips.
- [ ] Integrate a section for travel and collaborations.
- [ ] Add a multimedia gallery and downloadable resources.

---

## 📄 License

This project is closed source and belongs to Belu Mont. For inquiries, collaborations, or support, please contact her via [Instagram](https://www.instagram.com/belu.mont/).

---
