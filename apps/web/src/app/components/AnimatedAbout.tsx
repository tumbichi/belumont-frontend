'use client';

import { useEffect, useState } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import Container from '@soybelumont/ui/layouts/container';
import { ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AnimatedAbout() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('sobre-bel-animated');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="sobre-bel-animated"
      className="py-16 lg:py-24 relative overflow-hidden"
      style={{ backgroundColor: 'hsl(40, 33%, 97%)' }}
    >
      {/* Wave separator at top - pointing up from products section */}
      <div className="absolute -top-12 lg:-top-16 left-0 right-0 h-12 lg:h-16 overflow-hidden z-10">
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-8 lg:h-12"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(40, 33%, 100%)"
            d="M0,0 L0,28 Q360,48 720,28 T1440,28 L1440,0 Z"
          />
        </svg>
      </div>

      <Container>
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center transition-all duration-1000 px-4 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative order-2 lg:order-1">
            <Image
              src="/belu.jpg"
              alt="Belu cocinando"
              fill
              className="object-cover object-center rounded-2xl"
            />
            <div className="aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto lg:max-w-none">
              <div className="w-full h-full bg-gradient-to-br from-[hsl(37,25%,80%)] to-[hsl(37,20%,90%)] flex items-center justify-center">
                <div className="text-center p-6 lg:p-8">
                  <div className="w-24 lg:w-32 h-24 lg:h-32 mx-auto mb-3 lg:mb-4 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
                    <span className="text-3xl lg:text-4xl font-display text-white">
                      B
                    </span>
                  </div>
                  <p className="text-base lg:text-lg font-display text-muted-foreground">
                    Foto de Belu
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 -bottom-4 -right-4 w-32 lg:w-48 h-32 lg:h-48 rounded-full bg-[hsl(var(--primary))] opacity-10 blur-3xl" />
          </div>

          <div className="flex flex-col gap-4 lg:gap-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-[hsl(85,35%,35%)]">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Sobre mí
              </span>
            </div>

            <h2 className="text-2xl lg:text-4xl lg:text-5xl font-display font-bold text-foreground">
              Hola, soy <span className="text-primary">Belu</span>
            </h2>

            <div className="space-y-3 lg:space-y-4 text-sm lg:text-base text-muted-foreground">
              <p>
                Me apasiona la cocina saludable y creo que comer bien no tiene
                que ser aburrido ni complicado.
              </p>
              <p>
                Creé estos recetarios para compartir mis recetas favoritas: esas
                que preparo en casa, que utilizan ingredientes simples y que
                hacen que toda la familia enjoy la comida sin culpa.
              </p>
              <p>
                Acá vas a encontrar opciones prácticas para el día a día, porque
                sé lo difícil que puede ser encontrar el tiempo de cocinar
                siendo saludable.
              </p>
            </div>

            <div className="pt-2 lg:pt-4">
              <Link href="/recetarios">
                <Button size="lg" className="text-base px-6 lg:px-8">
                  Explorar mis recetarios
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
