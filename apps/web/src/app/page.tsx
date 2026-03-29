import { Button } from '@soybelumont/ui/components/button';
import Container from '@soybelumont/ui/layouts/container';
import { ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';
import { ProductsRepository } from '@core/data/supabase/products';
import AnimatedProducts from './components/AnimatedProducts';
import AnimatedAbout from './components/AnimatedAbout';
import CTASection from './components/CTASection';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await ProductsRepository().getAll();

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden"
        style={{ backgroundColor: 'hsl(40, 33%, 97%)' }}
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-[hsl(85,35%,35%)] opacity-[0.08] blur-3xl translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(var(--primary))] opacity-[0.06] blur-3xl -translate-x-1/2" />
        </div>

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-8">
            <div className="flex flex-col items-start gap-6 animate-fade-in px-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(85,35%,35%,0.1)] text-[hsl(85,35%,35%)]">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-medium">Cocina saludable</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] text-foreground">
                Comiendo <span className="text-primary italic">rico</span>
                <br />y saludable
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                Recetarios de cocina con recetas simples, nutritivas y
                deliciosas para cada día.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/recetarios">
                  <Button size="lg" className="text-base px-8 py-6">
                    Explorar recetarios
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#sobre-bel">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 py-6"
                  >
                    Conocer a Belu
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="relative hidden lg:block animate-fade-in-up px-4 lg:px-0"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative aspect-[4/5] max-h-[60vh] mx-auto my-8 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(85,35%,35%)]/20 z-10" />
                <Image
                  src="/hero.webp"
                  alt="Belu cocinando"
                  fill
                  className="object-cover  w-full h-full"
                />
                {/* <div className="w-full h-full bg-gradient-to-br from-[hsl(37,25%,80%)] to-[hsl(37,20%,90%)] flex items-center justify-center">
                  <div className="text-center p-8">
                    <Leaf className="w-24 h-24 mx-auto mb-4 text-[hsl(85,35%,35%)]" />
                    <p className="text-xl font-display text-muted-foreground">
                      Foto de Belu
                      <br />
                      cocinando
                    </p>
                  </div>
                </div> */}
              </div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[hsl(85,35%,35%)] opacity-20 blur-2xl" />
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products with scroll animations */}
      <AnimatedProducts products={products} />

      {/* About Belu with scroll animations */}
      <AnimatedAbout />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
