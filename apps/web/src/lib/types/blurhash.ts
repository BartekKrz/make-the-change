/**
 * BlurHash Types - Make the CHANGE
 * Types pour la gestion des placeholders intelligents
 */

export type BlurHashData = {
  url: string;
  blurhash: string;
  type: 'logo' | 'cover' | 'gallery' | 'hero' | 'product';
}

export type BlurHashImageProps = {
  src: string;
  blurHash: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export type UseImageWithBlurHashResult = {
  src: string;
  blurHash: string;
  hasBlurHash: boolean;
}
