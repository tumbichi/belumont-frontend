'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '../lib/utils';

type OptimizedImageProps = Omit<ImageProps, 'onLoad'> & {
  /**
   * Additional class name for the skeleton placeholder shown while loading.
   */
  skeletonClassName?: string;
};

/**
 * Wrapper around Next.js Image that shows a skeleton pulse placeholder while
 * the image is loading and automatically marks the image as loaded once ready.
 *
 * Accepts all standard Next.js Image props plus an optional
 * `skeletonClassName` for customising the placeholder appearance.
 */
function OptimizedImage({
  className,
  skeletonClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse rounded-md bg-gray-200',
            skeletonClassName
          )}
        />
      )}
      <Image
        {...props}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export { OptimizedImage };
export type { OptimizedImageProps };
