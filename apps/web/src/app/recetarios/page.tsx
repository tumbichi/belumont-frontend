import type { Metadata } from 'next';
import Container from '@soybelumont/ui/layouts/container';
import { ProductsRepository } from '@core/data/supabase/products';
import { Leaf } from 'lucide-react';

import ProductCard from '../../modules/products/components/ProductCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Recetarios de Cocina Saludable',
  description:
    'Explorá todos los recetarios de cocina saludable de Belu Mont. Recetas fáciles, nutritivas y deliciosas para cada día.',
  openGraph: {
    title: 'Recetarios de Cocina Saludable | Belu Mont',
    description:
      'Explorá todos los recetarios de cocina saludable de Belu Mont. Recetas fáciles, nutritivas y deliciosas para cada día.',
  },
};

export default async function ProductsPage() {
  const products = await ProductsRepository().getAll();

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ backgroundColor: 'hsl(40, 33%, 97%)' }}
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(85,35%,35%)] opacity-[0.06] blur-3xl translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[hsl(var(--primary))] opacity-[0.05] blur-3xl -translate-x-1/2" />
        </div>

        <Container>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(85,35%,35%,0.1)] text-[hsl(85,35%,35%)] mb-6">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Colección completa</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
              Recetarios
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Recetas simples, ricas y nutritivas para transformar tu cocina
              diaria
            </p>
          </div>
        </Container>

        {/* Wave at bottom */}
        <div className="absolute -bottom-1 left-0 right-0 h-12 lg:h-16 overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-12 lg:h-16"
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
          >
            <path
              fill="hsl(40, 33%, 100%)"
              d="M0,0 L0,32 Q360,64 720,32 T1440,32 L1440,0 Z"
            />
          </svg>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
