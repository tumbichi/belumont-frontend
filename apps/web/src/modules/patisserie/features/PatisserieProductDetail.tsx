'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Wheat,
} from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import { PatisserieProduct } from '../types/patisserie.types';
import { StockBadge } from '../components/StockBadge';
import { useCart } from '../hooks/useCart';

interface PatisserieProductDetailProps {
  product: PatisserieProduct;
}

export function PatisserieProductDetail({
  product,
}: PatisserieProductDetailProps) {
  const { addItem } = useCart();
  const isOutOfStock = product.stock_status === 'out_of_stock';

  return (
    <div className="py-8 lg:py-16">
      {/* Back link */}
      <Link
        href="/pasteleria"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              🧁
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <p className="text-sm font-medium uppercase tracking-wider text-amber-600">
              {product.category}
            </p>
          )}

          <h1 className="font-display text-3xl lg:text-4xl font-bold text-stone-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <StockBadge status={product.stock_status} />
          </div>

          {product.description && (
            <p className="text-stone-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Metadata */}
          <div className="space-y-2">
            {product.metadata?.porciones && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="font-medium">Porciones:</span>
                <span>{product.metadata.porciones}</span>
              </div>
            )}
            {product.metadata?.alergenos && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="font-medium">Alérgenos:</span>
                <span>{product.metadata.alergenos}</span>
              </div>
            )}
            {product.metadata?.dias_anticipacion === 0 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Disponible para retirar hoy</span>
              </div>
            ) : product.metadata?.dias_anticipacion != null &&
              product.metadata.dias_anticipacion > 0 ? (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  Requiere{' '}
                  <strong>{product.metadata.dias_anticipacion} días</strong> de
                  anticipación
                </span>
              </div>
            ) : null}
          </div>

          {/* Gluten free badge */}
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
            <Wheat className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">100% Sin TACC · Sin Gluten</span>
          </div>

          {/* Price & CTA */}
          <div className="border-t border-stone-200 pt-5 flex flex-col gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-stone-900">
                ${product.price.toLocaleString('es-AR')}
              </span>
              <span className="text-stone-400 text-sm">ARS</span>
            </div>

            <Button
              onClick={() => addItem(product)}
              disabled={isOutOfStock}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {isOutOfStock ? 'Sin stock disponible' : 'Agregar al carrito'}
            </Button>
          </div>

          {/* Pickup disclaimer */}
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <MapPin className="w-4 h-4 flex-shrink-0 text-amber-500" />
              <span>
                Retiro únicamente en <strong>Baradero, Buenos Aires</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <MessageCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
              <span>Coordinamos fecha y detalles por WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
