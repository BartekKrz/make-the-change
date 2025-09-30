'use client';

import { Package, Images } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { FC } from 'react';

// BlurHash supprimé: on privilégie blurDataURL (DB) comme placeholder Next/Image

type ProductImageProps = {
  src?: string;
  alt: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
  fallbackType?: 'placeholder' | 'initials';
  initials?: string;
  images?: string[];
  // Nouveau: blur direct depuis le serveur (zéro calcul client)
  blurDataURL?: string;
  blurHash?: string;
  onImageClick?: () => void;
};

const sizeMap = {
  xs: 'w-7 h-7 md:w-8 md:h-8',
  sm: 'w-8 h-8',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
} as const;

const PlaceholderSVG: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'from-muted/60 to-muted/40 flex items-center justify-center rounded-lg bg-gradient-to-br',
        'border-border/20 border',
        className
      )}
    >
      <Package className="text-muted-foreground/40 h-1/2 w-1/2" />
    </div>
  );
};

const InitialsFallback: FC<{ initials: string; className?: string }> = ({
  initials,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-primary/10 text-primary flex items-center justify-center rounded-lg text-xs font-medium',
        className
      )}
    >
      {initials}
    </div>
  );
};

const ImageCountBadge: FC<{ count: number; onClick?: () => void }> = ({
  count,
  onClick,
}) => {
  if (count <= 1) return null;

  const displayCount = count > 9 ? '9+' : count.toString();

  return (
    <button
      aria-label={`${count} photos disponibles`}
      title={`${count} photos disponibles`}
      className={cn(
        'absolute top-1 right-1 z-10',
        'bg-black/70 text-xs font-medium text-white backdrop-blur-sm',
        'rounded-md px-1.5 py-0.5',
        'flex items-center gap-1',
        'transition-all duration-200',
        'hover:scale-110 hover:bg-black/80',
        'focus:ring-primary/50 focus:ring-2 focus:outline-none',
        'border border-white/20 shadow-lg'
      )}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Images size={10} />
      <span>{displayCount}</span>
    </button>
  );
};

export const ProductImage: FC<ProductImageProps> = ({
  src,
  alt,
  size,
  className,
  priority = false,
  fallbackType = 'placeholder',
  initials,
  images,
  blurDataURL,
  onImageClick,
}) => {
  const sizeClass = sizeMap[size];
  const isValidImage = src && src.trim() !== '' && src.startsWith('http');
  const imageCount = images?.length || 0;

  if (isValidImage) {
    return (
      <div
        className={cn(
          'bg-muted/20 relative overflow-hidden rounded-lg',
          sizeClass,
          className
        )}
      >
        {/* Effet pile de photos - ombre légère derrière */}
        {imageCount > 1 && (
          <>
            <div className="bg-muted/40 absolute inset-0 -z-10 translate-x-0.5 translate-y-0.5 transform rounded-lg" />
            <div className="bg-muted/20 absolute inset-0 -z-20 translate-x-1 translate-y-1 transform rounded-lg" />
          </>
        )}

        {/* Image unique: utilise blurDataURL si disponible, sinon placeholder vide */}
        <Image
          fill
          alt={alt}
          blurDataURL={blurDataURL || undefined}
          className="object-cover transition-all duration-200 hover:scale-105"
          placeholder={(blurDataURL ? 'blur' : 'empty') as 'blur' | 'empty'}
          priority={priority}
          src={src}
          unoptimized={src.includes('unsplash') || src.includes('supabase')}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        {/* Badge compteur d'images */}
        <ImageCountBadge count={imageCount} onClick={onImageClick} />
      </div>
    );
  }

  if (fallbackType === 'initials' && initials) {
    return (
      <InitialsFallback
        className={cn(sizeClass, className)}
        initials={initials}
      />
    );
  }

  return <PlaceholderSVG className={cn(sizeClass, className)} />;
};

export const useMainProductImage = (images?: string[]): string | undefined => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return undefined;
  }

  return images.find(img => img && img.trim() !== '' && img.startsWith('http'));
};

export const getMainProductImage = (images?: string[]): string | undefined => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return undefined;
  }

  return images.find(img => img && img.trim() !== '' && img.startsWith('http'));
};
