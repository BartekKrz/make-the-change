/**
 * BlurHashImage Component - Make the CHANGE
 * Composant d'image avec placeholder BlurHash intelligent
 */

'use client';

import { type FC, useState } from 'react';
import Image from 'next/image';
import { Blurhash } from 'react-blurhash';
import { cn } from '@/lib/utils';

type BlurHashImageProps = {
  src: string;
  blurHash: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const BlurHashImage: FC<BlurHashImageProps> = ({
  src,
  blurHash,
  alt,
  className = '',
  width = 400,
  height = 300
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Si pas de BlurHash ou erreur, on utilise un placeholder simple
  const showBlurHash = blurHash && !imageError && !imageLoaded;
  const showPlaceholder = !blurHash || imageError;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder BlurHash */}
      {showBlurHash && (
        <Blurhash
          hash={blurHash}
          width={width}
          height={height}
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className="absolute inset-0 rounded-lg"
        />
      )}

      {/* Placeholder simple si pas de BlurHash */}
      {showPlaceholder && !imageLoaded && (
        <div 
          className="absolute inset-0 bg-muted/40 rounded-lg flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-8 h-8 bg-muted-foreground/20 rounded animate-pulse" />
        </div>
      )}

      {/* Image réelle */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'absolute inset-0 object-cover rounded-lg transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => {
          setImageLoaded(true);
          setImageError(false);
        }}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
      />

      {/* Fallback si erreur d'image */}
      {imageError && (
        <div 
          className="absolute inset-0 bg-muted/60 rounded-lg flex items-center justify-center text-muted-foreground"
          style={{ width, height }}
        >
          <span className="text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  );
};
