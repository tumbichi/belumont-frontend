'use client';

import { Button } from '@soybelumont/ui/components/button';
import Container from '@soybelumont/ui/layouts/container';
import { ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden"
      style={{ backgroundColor: 'hsl(40, 33%, 95%)' }}
    >
      {/* Floating leaf elements - responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Desktop leaves */}
        <div
          className="hidden lg:block absolute top-[10%] left-[5%]"
          style={{
            animation: 'floatLeaf 8s ease-in-out infinite',
            opacity: 0.25,
          }}
        >
          <Leaf className="w-6 h-6" style={{ color: 'hsl(85, 35%, 35%)' }} />
        </div>
        <div
          className="hidden lg:block absolute top-[15%] right-[8%]"
          style={{
            animation: 'floatLeaf 6s ease-in-out infinite 1s',
            opacity: 0.2,
          }}
        >
          <Leaf
            className="w-5 h-5"
            style={{ color: 'hsl(var(--secondary))' }}
          />
        </div>
        <div
          className="hidden lg:block absolute bottom-[35%] left-[10%]"
          style={{
            animation: 'floatLeaf 9s ease-in-out infinite 3s',
            opacity: 0.22,
          }}
        >
          <Leaf className="w-8 h-8" style={{ color: 'hsl(85, 35%, 35%)' }} />
        </div>
        <div
          className="hidden lg:block absolute bottom-[40%] right-[5%]"
          style={{
            animation: 'floatLeaf 7s ease-in-out infinite 2.5s',
            opacity: 0.2,
          }}
        >
          <Leaf className="w-6 h-6" style={{ color: 'hsl(85, 35%, 35%)' }} />
        </div>
        {/* Mobile leaves - fewer */}
        <div
          className="lg:hidden absolute top-[20%] left-[8%]"
          style={{
            animation: 'floatLeaf 6s ease-in-out infinite',
            opacity: 0.3,
          }}
        >
          <Leaf className="w-5 h-5" style={{ color: 'hsl(85, 35%, 35%)' }} />
        </div>
        <div
          className="lg:hidden absolute top-[30%] right-[10%]"
          style={{
            animation: 'floatLeaf 5s ease-in-out infinite 1s',
            opacity: 0.25,
          }}
        >
          <Leaf
            className="w-4 h-4"
            style={{ color: 'hsl(var(--secondary))' }}
          />
        </div>
        <div
          className="lg:hidden absolute bottom-[30%] left-[15%]"
          style={{
            animation: 'floatLeaf 7s ease-in-out infinite 2s',
            opacity: 0.2,
          }}
        >
          <Leaf className="w-6 h-6" style={{ color: 'hsl(85, 35%, 35%)' }} />
        </div>
      </div>

      {/* Main CTA Card */}
      <Container>
        <div
          className={`relative mx-auto max-w-2xl transition-all duration-700 ease-out px-4 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="relative p-6 lg:p-14 rounded-2xl lg:rounded-3xl text-center"
            style={{
              backgroundColor: 'hsl(40, 30%, 97%)',
              boxShadow: '0 20px 40px rgba(61, 43, 31, 0.1)',
              border: '1px solid hsl(37, 20%, 85%)',
            }}
          >
            <h2 className="text-2xl lg:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 lg:mb-5">
              ¿Lista para transformar tu cocina?
            </h2>

            <p className="text-base lg:text-lg text-muted-foreground mb-6 lg:mb-8 max-w-md mx-auto leading-relaxed">
              Descubrí recetas deliciosas y saludables que van a cambiar la
              forma en que cookás todos los días.
            </p>

            <Link href="/recetarios" className="inline-block">
              <Button
                size="lg"
                className="text-base lg:text-lg px-8 lg:px-10 py-5 lg:py-6 transition-transform hover:scale-105"
              >
                Ver todos los recetarios
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        @keyframes floatLeaf {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }
      `}</style>
    </section>
  );
}
