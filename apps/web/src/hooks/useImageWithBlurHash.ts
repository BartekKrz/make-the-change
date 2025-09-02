/**
 * useImageWithBlurHash Hook - Make the CHANGE
 * Hook pour récupérer les données BlurHash d'une image
 */

import { useMemo } from 'react';
import type { BlurHashData, UseImageWithBlurHashResult } from '@/lib/types/blurhash';

export function useImageWithBlurHash(
  blurHashes: BlurHashData[],
  imageUrl: string,
  type: string
): UseImageWithBlurHashResult {
  return useMemo(() => {
    const blurHashData = blurHashes.find(
      (bh) => bh.url === imageUrl && bh.type === type
    );
    
    return {
      src: imageUrl,
      blurHash: blurHashData?.blurhash || '',
      hasBlurHash: !!blurHashData
    };
  }, [blurHashes, imageUrl, type]);
}
