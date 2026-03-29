'use client';

import { useEffect, useState } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import Container from '@soybelumont/ui/layouts/container';
import { ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../../modules/products/components/ProductCard';
import { Product } from '@core/data/supabase/products/products.repository';

export default function AnimatedProducts({
  products,
}: {
  products: Product[];
}) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-index') || '0'
            );
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-16 lg:py-24 relative"
      style={{ backgroundColor: 'hsl(40, 33%, 95%)' }}
    >
      <Container>
        <div className="text-center mb-10 lg:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 lg:mb-4">
            Recetarios
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto px-4">
            Recetas simples, ricas y nutritivas para tu día a día
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-12 px-4">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              data-index={index}
              className={`animate-on-scroll transition-all duration-700 ${
                visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center px-4">
          <Link href="/recetarios">
            <Button variant="outline" size="lg" className="text-base px-8">
              Ver todos los recetarios
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>

      {/* Wave separator at bottom with leaf accent */}
      <div className="absolute -bottom-12 lg:-bottom-16 left-0 right-0 h-12 lg:h-16 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-8 lg:h-12"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(40, 33%, 97%)"
            d="M0,0 L0,28 Q360,48 720,28 T1440,28 L1440,0 Z"
          />
        </svg>
        <div className="absolute bottom-2 left-[20%] hidden lg:block">
          <Leaf
            className="w-3 h-3"
            style={{ color: 'hsl(85, 35%, 45%)', opacity: 0.3 }}
          />
        </div>
      </div>
    </section>
  );
}
