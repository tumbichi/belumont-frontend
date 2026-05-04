'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import { PatisserieProduct } from '../types/patisserie.types';
import { StockBadge } from './StockBadge';

interface PatisserieCardProps {
  product: PatisserieProduct;
  onAddToCart: (product: PatisserieProduct) => void;
}

export function PatisserieCard({ product, onAddToCart }: PatisserieCardProps) {
  const isOutOfStock = product.stock_status === 'out_of_stock';
  const diasAnticipacion = product.metadata?.dias_anticipacion;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image — with hover overlay on desktop */}
      <div className="relative h-52 overflow-hidden bg-stone-100 group">
        <Link
          href={`/pasteleria/${product.pathname}`}
          aria-label={product.name}
        >
          {product.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-stone-300" />
            </div>
          )}
        </Link>

        {/* Stock badge */}
        <div className="absolute top-2 left-2 z-10">
          <StockBadge status={product.stock_status} />
        </div>

        {/* Desktop hover overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-0 items-center justify-center hidden transition-opacity group-hover:flex group-hover:bg-black/30 z-10">
            <Link href={`/pasteleria/${product.pathname}`}>
              <Button className="bg-white text-stone-900 hover:bg-amber-50 shadow-md">
                Ver detalle
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wider text-amber-600">
            {product.category}
          </p>
        )}
        <Link
          href={`/pasteleria/${product.pathname}`}
          className="hover:underline underline-offset-2"
        >
          <h3 className="font-display text-lg font-semibold text-stone-900 leading-snug">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-stone-500 line-clamp-2">
            {product.description}
          </p>
        )}

        {diasAnticipacion === 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1.5 border border-emerald-100">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Disponible para retirar hoy</span>
          </div>
        ) : diasAnticipacion != null && diasAnticipacion > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-100">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Requiere {diasAnticipacion} días de anticipación</span>
          </div>
        ) : null}

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="text-xl font-bold text-stone-900">
            ${product.price.toLocaleString('es-AR')}
          </span>
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            {isOutOfStock ? 'Sin stock' : 'Agregar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
