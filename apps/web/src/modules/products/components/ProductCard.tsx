import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@core/components/ui/button';
import { formatPrice } from '@core/utils';
import { Product } from '@core/data/supabase/products/products.repository';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('PRODUCT');

  return (
    <div className="overflow-hidden transition flex flex-col bg-white rounded-lg shadow-sm dark:bg-gray-950">
      <div className="relative group">
        <Image
          src={product.image_url}
          alt="Product Image"
          width={400}
          height={300}
          className="object-cover w-full h-48 transition-opacity group-hover:opacity-100"
          style={{ aspectRatio: '400/300', objectFit: 'cover' }}
        />
        <Link key={product.id} href={`/recetarios/${product.pathname}`}>
          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center group-hover:bg-black/30 transition-opacity">
            <Button className="z-20">
              <ShoppingBag className="h-4 w-4" />
              Ver más
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Link>
      </div>
      <div className="p-4 space-y-2 flex flex-col flex-1">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {product.description}
        </p>
        <div className="flex-1" />
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {formatPrice(product.price)}
          </span>
          <Link
            key={product.id}
            href={`/recetarios/${product.pathname}`}
            className="block mb-2"
          >
            <Button size="sm">
              {t('BUY')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
