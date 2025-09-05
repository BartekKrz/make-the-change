/**
 * Blur Generation Service - Make the CHANGE
 * Service pour générer automatiquement les blurDataURL pour Next.js
 */

type BlurDataResult = {
  blurDataURL: string;
  width?: number;
  height?: number;
}

type BlurGenerationOptions = {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Génère un blurDataURL à partir d'une image
 * Compatible avec Next.js Image placeholder="blur"
 */
export class BlurGenerationService {
  private static readonly DEFAULT_OPTIONS: Required<BlurGenerationOptions> = {
    width: 10,
    height: 10,
    quality: 10
  };

  /**
   * Génère un blurDataURL à partir d'une URL d'image
   */
  static async generateBlurDataURL(
    imageUrl: string, 
    options: BlurGenerationOptions = {}
  ): Promise<BlurDataResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      // En production, utiliser un service comme Plaiceholder ou Sharp
      // Pour le moment, nous allons créer un placeholder simple
      const canvas = await this.createBlurCanvas(imageUrl, opts);
      const blurDataURL = canvas.toDataURL('image/jpeg', opts.quality / 100);
      
      return {
        blurDataURL,
        width: opts.width,
        height: opts.height
      };
    } catch (error) {
      console.error('Erreur génération blur:', error);
      // Fallback vers un blur générique
      return this.generateGenericBlur(opts);
    }
  }

  /**
   * Génère des blurDataURL pour un tableau d'images (produit)
   */
  static async generateForProduct(
    images: string[],
    options: BlurGenerationOptions = {}
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    const promises = images.map(async (imageUrl) => {
      try {
        const { blurDataURL } = await this.generateBlurDataURL(imageUrl, options);
        results.set(imageUrl, blurDataURL);
      } catch (error) {
        console.error(`Erreur blur pour ${imageUrl}:`, error);
        // Utiliser un fallback générique
        const generic = this.generateGenericBlur(options);
        results.set(imageUrl, generic.blurDataURL);
      }
    });

    await Promise.allSettled(promises);
    return results;
  }

  /**
   * Crée un canvas flou à partir d'une image
   * Version simplifiée - en production utiliser Sharp ou Plaiceholder
   */
  private static async createBlurCanvas(
    imageUrl: string, 
    options: Required<BlurGenerationOptions>
  ): Promise<HTMLCanvasElement> {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') {
      throw new Error('Canvas generation only available on client side');
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Ne pas utiliser crossOrigin pour les images locales ou Supabase
      if (imageUrl.startsWith('http') && !imageUrl.includes('supabase.co')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context non disponible'));
            return;
          }

          canvas.width = options.width;
          canvas.height = options.height;

          // Dessiner l'image redimensionnée (effet blur par la résolution basse)
          ctx.filter = 'blur(1px)';
          ctx.drawImage(img, 0, 0, options.width, options.height);

          resolve(canvas);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error(`Impossible de charger l'image: ${imageUrl}`));
      img.src = imageUrl;
    });
  }

  /**
   * Génère un blur générique pour fallback
   */
  private static generateGenericBlur(
    options: Required<BlurGenerationOptions>
  ): BlurDataResult {
    // Créer un gradient simple comme fallback
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context non disponible');
    }

    canvas.width = options.width;
    canvas.height = options.height;

    // Gradient simple gris
    const gradient = ctx.createLinearGradient(0, 0, options.width, options.height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(0.5, '#e5e7eb');
    gradient.addColorStop(1, '#d1d5db');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, options.width, options.height);

    return {
      blurDataURL: canvas.toDataURL('image/jpeg', options.quality / 100),
      width: options.width,
      height: options.height
    };
  }

  /**
   * Convertit les BlurHashData existants vers le format Next.js
   */
  static async migrateBlurHashToDataURL(
    blurHashes: Array<{ url: string; blurhash: string; type: string }>
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    // Pour chaque BlurHash existant, générer un blurDataURL
    for (const item of blurHashes) {
      try {
        const { blurDataURL } = await this.generateBlurDataURL(item.url);
        results.set(item.url, blurDataURL);
      } catch (error) {
        console.error(`Migration échouée pour ${item.url}:`, error);
      }
    }

    return results;
  }
}

/**
 * Hook pour utiliser le blur generation avec Next.js
 */
import React from 'react';

export const useNextjsBlur = (imageUrl: string) => {
  const [blurDataURL, setBlurDataURL] = React.useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    if (!imageUrl) return;

    setIsGenerating(true);
    BlurGenerationService.generateBlurDataURL(imageUrl)
      .then(({ blurDataURL }) => setBlurDataURL(blurDataURL))
      .catch((error) => {
        console.error('Erreur génération blur:', error);
        // Utiliser un fallback
        setBlurDataURL('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQBJREAA...');
      })
      .finally(() => setIsGenerating(false));
  }, [imageUrl]);

  return { blurDataURL, isGenerating };
};

// Export des types
export type { BlurDataResult, BlurGenerationOptions };