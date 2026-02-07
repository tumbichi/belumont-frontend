import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Fade,
} from '@soybelumont/ui/components/carousel';
import { OptimizedImage } from '@soybelumont/ui/components/optimized-image';
import { LucideMaximize, LucideX } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
}

function ProductGallery({ images }: ProductGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleGalleryOpen = () => {
    const body = document.querySelector('body');
    body?.style.setProperty('height', '100vh');
    body?.style.setProperty('overflow-y', 'hidden');
    setGalleryOpen(true);
  };

  const handleGalleryClose = () => {
    const body = document.querySelector('body');
    body?.style.removeProperty('height');
    body?.style.removeProperty('overflow-y');
    setGalleryOpen(false);
  };

  return (
    <>
      <div className="grid gap-4">
        <div className="relative rounded-lg group">
          <OptimizedImage
            priority
            src={images[0] ? images[0] : ''}
            alt="Product Image"
            width={480}
            height={750}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover w-full rounded-lg group-hover:outline-1 group-hover:outline-primary group-hover:outline"
            style={{ objectFit: 'cover' }}
          />
          <div
            className="absolute top-0 bottom-0 hidden w-full transition-all duration-1000 rounded-lg group-hover:block group-hover:bg-primary/45"
            style={{ objectFit: 'cover' }}
          >
            <div
              className="absolute flex items-center justify-center p-2 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer bg-primary-foreground top-1/2 left-1/2 hover:bg-neutral-300"
              onClick={handleGalleryOpen}
            >
              <LucideMaximize />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <OptimizedImage
            src={images[1] ? images[1] : ''}
            alt="Product Thumbnail"
            width={200}
            height={260}
            sizes="(max-width: 768px) 33vw, 16vw"
            className="object-cover w-full rounded-lg"
            style={{ aspectRatio: '10/13', objectFit: 'cover' }}
          />
          <OptimizedImage
            src={images[2] ? images[2] : ''}
            alt="Product Thumbnail"
            width={200}
            height={260}
            sizes="(max-width: 768px) 33vw, 16vw"
            className="object-cover w-full rounded-lg"
            style={{ aspectRatio: '10/13', objectFit: 'cover' }}
          />
          <OptimizedImage
            src={images[3] ? images[3] : ''}
            alt="Product Thumbnail"
            width={200}
            height={260}
            sizes="(max-width: 768px) 33vw, 16vw"
            className="object-cover w-full rounded-lg"
            style={{ aspectRatio: '10/13', objectFit: 'cover' }}
          />
        </div>
      </div>
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80">
          <Carousel
            className="w-full max-w-xl mx-auto 2xl:max-w-2xl"
            plugins={[Fade()]}
          >
            <CarouselContent className="w-screen h-screen mx-0">
              <CarouselItem className="relative h-screen">
                <OptimizedImage
                  src={images[0] ? images[0] : ''}
                  alt="Product Image"
                  sizes="100vw"
                  className="!w-auto md:max-w-xl lg:max-w-2xl object-contain"
                  skeletonClassName="h-screen w-screen"
                  fill
                />
              </CarouselItem>
              <CarouselItem className="relative h-screen">
                <OptimizedImage
                  src={images[1] ? images[1] : ''}
                  alt="Product Image"
                  sizes="100vw"
                  objectPosition="center"
                  className="!w-auto md:max-w-xl lg:max-w-2xl object-contain"
                  fill
                />
              </CarouselItem>
              <CarouselItem className="relative h-screen">
                <OptimizedImage
                  src={images[2] ? images[2] : ''}
                  alt="Product Image"
                  sizes="100vw"
                  className="!w-auto md:max-w-xl lg:max-w-2xl object-contain"
                  fill
                />
              </CarouselItem>
              <CarouselItem className="relative h-screen">
                <OptimizedImage
                  src={images[3] ? images[3] : ''}
                  alt="Product Image"
                  sizes="100vw"
                  className="!w-auto md:max-w-xl lg:max-w-2xl object-contain"
                  fill
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div
            className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer bg-primary-foreground top-6 right-8 hover:bg-neutral-200"
            onClick={handleGalleryClose}
          >
            <LucideX />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductGallery;
