/**
 * BlurHash Types - Make the CHANGE
 * Types pour la gestion des placeholders intelligents
 */

export interface BlurHashData {
  url: string;
  blurhash: string;
  type: 'logo' | 'cover' | 'gallery' | 'hero' | 'product';
}

export interface BlurHashImageProps {
  src: string;
  blurHash: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export interface UseImageWithBlurHashResult {
  src: string;
  blurHash: string;
  hasBlurHash: boolean;
}
