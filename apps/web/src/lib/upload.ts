/**
 * Système Upload Images - Supabase Storage
 * Make the CHANGE - Gestion complète des images
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client admin pour upload
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export type UploadOptions = {
  bucket: 'projects' | 'products' | 'producers' | 'users' | 'categories';
  folder?: string;
  fileName?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
};

export type UploadResult = {
  success: boolean;
  url?: string;
  publicUrl?: string;
  error?: string;
  fileName?: string;
  path?: string;
  blurHash?: string;
  blurMetadata?: {
    width: number;
    height: number;
    fileSize: number;
    processingTime: number;
    cached: boolean;
  };
};

/**
 * Upload et optimisation d'images avec génération automatique de blur hash
 */
export class ImageUploadService {
  /**
   * Upload une image avec optimisation automatique
   */
  static async uploadImage(
    file: File,
    entityId: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      // Validation du fichier
      const validationResult = this.validateFile(file);
      if (!validationResult.valid) {
        return { success: false, error: validationResult.error };
      }

      // Optimisation de l'image
      const optimizedFile = await this.optimizeImage(file, {
        maxWidth: options.maxWidth || 1920,
        maxHeight: options.maxHeight || 1080,
        quality: options.quality || 0.85,
      });

      // Génération du chemin
      const filePath = this.generateFilePath(entityId, file.name, options);

      // Upload vers Supabase Storage
      const { data: _data, error } = await supabaseAdmin.storage
        .from(options.bucket)
        .upload(filePath, optimizedFile, {
          cacheControl: '31536000', // 1 an
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return { success: false, error: error.message };
      }

      // Génération URL publique
      const { data: publicUrlData } = supabaseAdmin.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // ✅ Blur hash généré automatiquement par l'API upload

      return {
        success: true,
        url: publicUrl,
        publicUrl,
        fileName: file.name,
        path: filePath,
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload multiple images
   */
  static async uploadMultipleImages(
    files: File[],
    entityId: string,
    options: UploadOptions
  ): Promise<UploadResult[]> {
    const results = await Promise.all(
      files.map(file => this.uploadImage(file, entityId, options))
    );
    return results;
  }

  /**
   * Suppression d'une image
   */
  static async deleteImage(
    bucket: string,
    filePath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Validation des fichiers
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    // Taille max: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'Fichier trop volumineux (max 10MB)' };
    }

    // Types autorisés
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non supporté' };
    }

    return { valid: true };
  }

  /**
   * Optimisation des images (resize + compression)
   */
  private static async optimizeImage(
    file: File,
    options: { maxWidth: number; maxHeight: number; quality: number }
  ): Promise<File> {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.addEventListener('load', () => {
        // Calcul des nouvelles dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > options.maxWidth) {
            height = (height * options.maxWidth) / width;
            width = options.maxWidth;
          }
        } else {
          if (height > options.maxHeight) {
            width = (width * options.maxHeight) / height;
            height = options.maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Redimensionnement
        ctx.drawImage(img, 0, 0, width, height);

        // Conversion en blob optimisé
        canvas.toBlob(
          blob => {
            const optimizedFile = new File([blob!], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          options.quality
        );
      });

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Génération des chemins de fichiers
   */
  private static generateFilePath(
    entityId: string,
    originalName: string,
    options: UploadOptions
  ): string {
    const timestamp = Date.now();
    const _extension = originalName.split('.').pop();
    const cleanName = originalName
      .replaceAll(/[^\d.A-Za-z-]/g, '_')
      .toLowerCase();

    const folder = options.folder || '';
    const fileName = options.fileName || `${timestamp}-${cleanName}`;

    return folder
      ? `${entityId}/${folder}/${fileName}`
      : `${entityId}/${fileName}`;
  }

  /**
   * Génération d'URLs avec transformations Supabase
   */
  static getOptimizedImageUrl(
    bucket: string,
    filePath: string,
    transformations?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    }
  ): string {
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath, {
      transform: transformations
        ? {
            width: transformations.width,
            height: transformations.height,
            quality: transformations.quality,
            format: transformations.format,
          }
        : undefined,
    });

    return data.publicUrl;
  }
}

/**
 * Hooks pour composants React
 */
export const useImageUpload = () => {
  const uploadImage = async (
    file: File,
    entityId: string,
    options: UploadOptions
  ) => {
    return ImageUploadService.uploadImage(file, entityId, options);
  };

  const uploadMultiple = async (
    files: File[],
    entityId: string,
    options: UploadOptions
  ) => {
    return ImageUploadService.uploadMultipleImages(files, entityId, options);
  };

  const deleteImage = async (bucket: string, filePath: string) => {
    return ImageUploadService.deleteImage(bucket, filePath);
  };

  return { uploadImage, uploadMultiple, deleteImage };
};

/**
 * Helpers pour URLs optimisées
 */
export const getProjectImageUrl = (
  projectId: string,
  imageName: string,
  size?: 'thumbnail' | 'medium' | 'large'
) => {
  const transformations = {
    thumbnail: {
      width: 300,
      height: 200,
      quality: 75,
      format: 'webp' as const,
    },
    medium: { width: 800, height: 600, quality: 85, format: 'webp' as const },
    large: { width: 1920, height: 1080, quality: 90, format: 'webp' as const },
  };

  return ImageUploadService.getOptimizedImageUrl(
    'projects',
    `${projectId}/${imageName}`,
    size ? transformations[size] : undefined
  );
};

export const getProductImageUrl = (
  productId: string,
  imageName: string,
  size?: 'thumbnail' | 'medium' | 'large'
) => {
  const transformations = {
    thumbnail: {
      width: 300,
      height: 300,
      quality: 75,
      format: 'webp' as const,
    },
    medium: { width: 600, height: 600, quality: 85, format: 'webp' as const },
    large: { width: 1200, height: 1200, quality: 90, format: 'webp' as const },
  };

  return ImageUploadService.getOptimizedImageUrl(
    'products',
    `${productId}/${imageName}`,
    size ? transformations[size] : undefined
  );
};

export const getUserAvatarUrl = (userId: string, size: number = 150) => {
  return ImageUploadService.getOptimizedImageUrl(
    'users',
    `avatars/${userId}.jpg`,
    { width: size, height: size, quality: 85, format: 'webp' }
  );
};
