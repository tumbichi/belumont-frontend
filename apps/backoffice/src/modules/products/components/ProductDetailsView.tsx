'use client';
import React, { useState } from 'react';
import { Product } from '@core/data/supabase/products';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import Image from 'next/image';
import { formatPrice } from '@core/utils/formatters/formatPrice';
import formatDatetime from '@core/utils/formatters/formatDate';
import { Button } from '@soybelumont/ui/components/button';
import { Input } from '@soybelumont/ui/components/input';
import { Label } from '@soybelumont/ui/components/label';
import { Textarea } from '@soybelumont/ui/components/textarea';
import { Switch } from '@soybelumont/ui/components/switch';
import { Badge } from '@soybelumont/ui/components/badge';
import { FileText, Pencil } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailsViewProps {
  product: Product;
}

function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative">
              <Image
                src={product.image_url}
                width={800}
                height={800}
                alt={product.name}
                className="rounded-lg"
              />
              <Badge className="absolute -top-2 right-2 py-1 px-3">
                Imagen de portada
              </Badge>
            </div>
            {product.product_images && product.product_images.length > 0 && (
              <div className="mt-4">
                <Badge className="text-sm font-medium">Galeria de imagenes</Badge>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {product.product_images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      width={200}
                      height={200}
                      alt={product.name}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{product.name}</CardTitle>
            <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Pencil className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={product.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={product.description || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    defaultValue={product.price}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pathname">Pathname</Label>
                  <Input id="pathname" defaultValue={product.pathname} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" defaultChecked={product.active} />
                  <Label htmlFor="active">Active</Label>
                </div>
                <Button>Save Changes</Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="text-2xl font-bold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Pathname</Label>
                    <p>{product.pathname}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Download URL</Label>
                    <p>
                      <Link
                        href={product.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        {product.download_url.split('/').pop()}
                      </Link>
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p>{formatDatetime(product.created_at)}</p>
                </div>
                <div>
                  <div className="relative w-fit">
                    <div className="mt-2 overflow-hidden transition bg-white rounded-lg shadow-sm dark:bg-gray-950 w-fit">
                      <Image
                        src={product.thumbnail_url}
                        alt="Product Image"
                        width={400}
                        height={300}
                        className="object-cover w-full h-48 transition-opacity group-hover:opacity-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <Badge className="absolute -top-2 right-2 py-1 px-3">
                      Imagen de portada
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductDetailsView;
