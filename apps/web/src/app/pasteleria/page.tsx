import type { Metadata } from 'next';
import Container from '@soybelumont/ui/layouts/container';
import { Wheat } from 'lucide-react';
import { PatisserieCatalog } from '../../modules/patisserie/features/PatisserieCatalog';
import { PatisserieCheckout } from '../../modules/patisserie/features/PatisserieCheckout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Patisserie Sin TACC — Belu Mont',
  description:
    'Descubrí nuestra pastelería artesanal 100% sin gluten. Tortas, alfajores y más. Pedidos coordinados por WhatsApp, retiro en Baradero.',
  openGraph: {
    title: 'Pastelería Sin TACC | Belu Mont',
    description:
      'Pastelería artesanal 100% Sin TACC. Pedidos por WhatsApp, retiro en Baradero.',
  },
};

export default function PatisseriaPage() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative py-16 lg:py-24 pb-0 overflow-hidden"
        style={{ backgroundColor: 'hsl(35, 60%, 97%)' }}
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-amber-400 opacity-[0.07] blur-3xl translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-orange-300 opacity-[0.06] blur-3xl -translate-x-1/2" />
        </div>

        <Container>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 mb-6">
              <Wheat className="w-4 h-4" />
              <span className="text-sm font-medium">
                100% Sin TACC · Sin Gluten
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
              Patisserie
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Tortas, alfajores y delicias artesanales. Todas elaboradas sin
              TACC, con amor y sin concesiones.
            </p>
          </div>
        </Container>
      </section>

      {/* Catalog */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="px-4">
            <PatisserieCatalog />
          </div>
        </Container>
      </section>

      {/* Floating cart */}
      <PatisserieCheckout />
    </main>
  );
}
