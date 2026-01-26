import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@soybelumont/ui/components/button';
import { Badge } from '@soybelumont/ui/components/badge';
import { formatPrice } from '@core/utils';
import { Product } from '@core/data/supabase/products/products.repository';
import { ArrowRight, ShoppingBag, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('PRODUCT');
  const isBundle = product.product_type === 'bundle';

  return (
    <div className="flex flex-col overflow-hidden transition bg-white rounded-lg shadow-sm dark:bg-gray-950">
      <div className="relative group">
        {isBundle && (
          <Badge className="absolute top-2 left-2 z-10 bg-orange-500 hover:bg-orange-600">
            <Package className="w-3 h-3 mr-1" />
            Pack
          </Badge>
        )}
        <Image
          src={product.thumbnail_url}
          alt="Product Image"
          width={400}
          height={300}
          className="object-cover w-full h-48 transition-opacity group-hover:opacity-100"
          style={{ objectFit: 'cover' }}
        />
        <Link key={product.id} href={`/recetarios/${product.pathname}`}>
          <div className="absolute inset-0 items-center justify-center hidden transition-opacity group-hover:flex group-hover:bg-black/30">
            <Button className="z-20">
              <ShoppingBag className="w-4 h-4" />
              Ver más
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Link>
      </div>
      <div className="flex flex-col flex-1 p-4 space-y-2">
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
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
