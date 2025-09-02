'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Package, Images } from 'lucide-react';
import { cn } from '@/app/admin/(dashboard)/components/cn';

interface ProductImageProps {
  src?: string;
  alt: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
  fallbackType?: 'placeholder' | 'initials';
  initials?: string;
  images?: string[];
  onImageClick?: () => void;
}

const sizeMap = {
  xs: 'w-7 h-7 md:w-8 md:h-8', // 28px mobile, 32px desktop - list
  sm: 'w-8 h-8', // 32px - desktop list  
  md: 'w-24 h-24', // 96px - cards standard (doublé)
  lg: 'w-32 h-32', // 128px - cards large
} as const;

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Placeholder SVG optimisé
const PlaceholderSVG: FC<{ className?: string }> = ({ className }) => (
  <div className={cn(
    'bg-gradient-to-br from-muted/60 to-muted/40 flex items-center justify-center rounded-lg',
    'border border-border/20',
    className
  )}>
    <Package className="w-1/2 h-1/2 text-muted-foreground/40" />
  </div>
);

// Fallback avec initiales
const InitialsFallback: FC<{ initials: string; className?: string }> = ({ initials, className }) => (
  <div className={cn(
    'bg-primary/10 flex items-center justify-center rounded-lg text-xs font-medium text-primary',
    className
  )}>
    {initials}
  </div>
);

// Badge compteur d'images avec effet pile
const ImageCountBadge: FC<{ count: number; onClick?: () => void }> = ({ count, onClick }) => {
  if (count <= 1) return null;
  
  const displayCount = count > 9 ? '9+' : count.toString();
  
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        'absolute top-1 right-1 z-10',
        'bg-black/70 backdrop-blur-sm text-white text-xs font-medium',
        'px-1.5 py-0.5 rounded-md',
        'flex items-center gap-1',
        'transition-all duration-200',
        'hover:bg-black/80 hover:scale-110',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'shadow-lg border border-white/20'
      )}
      title={`${count} photos disponibles`}
      aria-label={`${count} photos disponibles`}
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
  onImageClick
}) => {
  const sizeClass = sizeMap[size];
  const isValidImage = src && src.trim() !== '' && src.startsWith('http');
  const imageCount = images?.length || 0;

  // Si on a une image valide, l'afficher
  if (isValidImage) {
    return (
      <div className={cn('relative overflow-hidden rounded-lg bg-muted/20', sizeClass, className)}>
        {/* Effet pile de photos - ombre légère derrière */}
        {imageCount > 1 && (
          <>
            <div className="absolute inset-0 bg-muted/40 rounded-lg transform translate-x-0.5 translate-y-0.5 -z-10" />
            <div className="absolute inset-0 bg-muted/20 rounded-lg transform translate-x-1 translate-y-1 -z-20" />
          </>
        )}
        
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-all duration-200 hover:scale-105"
          priority={priority}
          unoptimized={src.includes('unsplash') || src.includes('supabase')}
          onError={(e) => {
            // Fallback en cas d'erreur de chargement
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        {/* Badge compteur d'images */}
        <ImageCountBadge count={imageCount} onClick={onImageClick} />
      </div>
    );
  }

  // Fallback selon le type demandé
  if (fallbackType === 'initials' && initials) {
    return <InitialsFallback initials={initials} className={cn(sizeClass, className)} />;
  }

  // Fallback par défaut : placeholder
  return <PlaceholderSVG className={cn(sizeClass, className)} />;
};

// Hook helper pour extraire l'image principale
export const useMainProductImage = (images?: string[]): string | undefined => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return undefined;
  }

  // Trouver la première image valide
  return images.find(img => img && img.trim() !== '' && img.startsWith('http'));
};

// Fonction utilitaire standalone
export const getMainProductImage = (images?: string[]): string | undefined => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return undefined;
  }

  return images.find(img => img && img.trim() !== '' && img.startsWith('http'));
};