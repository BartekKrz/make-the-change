# ImageUploader Component - Migration Guide: MUI → Tailwind CSS + Lucide React

## 🎯 Objectif

Ce guide détaille la reproduction fidèle du composant ImageUploader du projet `appetito-dashboard` en utilisant **Tailwind CSS** pour les styles et **Lucide React** pour les icônes.

## 📁 Architecture Cible

```plaintext
src/components/ImageUploader/
├── hooks/
│   └── useImageHandler.ts
├── components/
│   ├── ImageUploader.tsx
│   ├── ImageInput.tsx
│   ├── ImageUploadArea.tsx
│   ├── ImageDisplay.tsx
│   ├── ImageActionButtons.tsx
│   └── RoundActionButton.tsx
└── adapters/
    └── ImageUploaderField.tsx
```

## 🧩 Composants à reproduire

### 1. Hook `useImageHandler.ts`

```tsx
import { useState, ChangeEvent } from 'react';

export const useImageHandler = () => {
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setUploadedImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedImageSrc(reader.result);
        }
      };
      reader.onerror = () => {
        // Gestion d'erreur (toast notification)
        console.error('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedImageSrc(null);
    }
  };

  return {
    uploadedImageSrc,
    handleImageUpload,
    setUploadedImageSrc,
    uploadedImageFile
  };
};
```

### 2. Composant principal `ImageUploader.tsx`

```tsx
import { useRef } from 'react';
import { ImageDisplay } from './ImageDisplay';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageInput } from './ImageInput';
import { useImageHandler } from '../hooks/useImageHandler';

interface ImageUploaderProps {
  currentImage?: string;
  onImageSelect?: (file: File | null) => void;
  onImageRemove?: () => void;
  width?: string;
  height?: string;
}

export const ImageUploader = ({
  currentImage,
  onImageSelect,
  onImageRemove,
  width = 'w-full',
  height = 'h-48'
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const { uploadedImageSrc, handleImageUpload, setUploadedImageSrc } = useImageHandler();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e);
    const file = e.target.files?.[0] || null;
    onImageSelect?.(file);
  };

  const handleRemove = () => {
    setUploadedImageSrc(null);
    onImageRemove?.();
  };

  const displayImage = uploadedImageSrc || currentImage;

  return (
    <div
      className={`relative ${width} ${height} border-2 border-dashed border-gray-300 rounded-xl transition-all duration-300 hover:border-blue-400 hover:bg-gray-50`}
    >
      <ImageInput
        ref={fileInputRef}
        onChange={handleFileSelect}
        className={displayImage ? 'cursor-default' : 'cursor-pointer'}
      />

      {!displayImage && <ImageUploadArea onClick={triggerFileInput} />}

      {displayImage && <ImageDisplay src={displayImage} onRemove={handleRemove} onChange={triggerFileInput} />}
    </div>
  );
};
```

### 3. `ImageInput.tsx`

```tsx
import { forwardRef } from 'react';

interface ImageInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(({ onChange, className }, ref) => (
  <input
    type="file"
    accept="image/*"
    onChange={onChange}
    className={`absolute inset-0 w-full h-full opacity-0 z-[-1] ${className}`}
    ref={ref}
    aria-label="Télécharger une image"
  />
));
```

### 4. `ImageUploadArea.tsx`

```tsx
import { Upload } from 'lucide-react';

interface ImageUploadAreaProps {
  onClick: () => void;
}

export const ImageUploadArea = ({ onClick }: ImageUploadAreaProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
    <p className="text-center text-gray-500 text-sm font-medium">Télécharger une image</p>
    <Upload className="w-8 h-8 text-gray-400" />
  </div>
);
```

### 5. `ImageDisplay.tsx`

```tsx
import Image from 'next/image';
import { ImageActionButtons } from './ImageActionButtons';

interface ImageDisplayProps {
  src: string;
  onRemove: () => void;
  onChange: () => void;
}

export const ImageDisplay = ({ src, onRemove, onChange }: ImageDisplayProps) => (
  <>
    <Image
      src={src}
      alt="Image uploadée"
      fill
      className="rounded-xl object-cover shadow-lg"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
    />
    <ImageActionButtons onRemove={onRemove} onChange={onChange} />
  </>
);
```

### 6. `ImageActionButtons.tsx`

```tsx
import { MouseEventHandler } from 'react';
import { RoundActionButton } from './RoundActionButton';
import { Trash2, ImagePlus } from 'lucide-react';

interface ImageActionButtonsProps {
  onRemove: () => void;
  onChange: MouseEventHandler<HTMLDivElement>;
}

export const ImageActionButtons = ({ onRemove, onChange }: ImageActionButtonsProps) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center gap-2">
    <RoundActionButton onClick={onRemove}>
      <Trash2 className="w-4 h-4 text-gray-600" />
    </RoundActionButton>
    <RoundActionButton onClick={onChange}>
      <ImagePlus className="w-4 h-4 text-gray-600" />
    </RoundActionButton>
  </div>
);
```

### 7. `RoundActionButton.tsx`

```tsx
import { ReactNode } from 'react';

interface RoundActionButtonProps {
  onClick: () => void;
  children: ReactNode;
}

export const RoundActionButton = ({ onClick, children }: RoundActionButtonProps) => (
  <button
    onClick={onClick}
    className="w-12 h-12 bg-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
    type="button"
    aria-label="Action sur l'image"
  >
    {children}
  </button>
);
```

### 8. Adaptateur Formik `ImageUploaderField.tsx`

```tsx
import { FormikProps } from 'formik';
import { ImageUploader } from '../components/ImageUploader';

interface ImageUploaderFieldProps<T> {
  formik: FormikProps<T>;
  name: keyof T;
  width?: string;
  height?: string;
}

export const ImageUploaderField = <T extends Record<string, any>>({
  formik,
  name,
  width = 'w-full',
  height = 'h-48'
}: ImageUploaderFieldProps<T>) => {
  const handleImageSelect = (file: File | null) => {
    formik.setFieldValue(name as string, file);
  };

  const handleImageRemove = () => {
    formik.setFieldValue(name as string, null);
  };

  const currentImage = formik.values[name] as string | null;

  return (
    <ImageUploader
      currentImage={currentImage}
      onImageSelect={handleImageSelect}
      onImageRemove={handleImageRemove}
      width={width}
      height={height}
    />
  );
};
```

## 🎨 Correspondances MUI → Tailwind/Lucide

### Icônes

| MUI                               | Lucide React |
| --------------------------------- | ------------ |
| `AddPhotoAlternate`               | `ImagePlus`  |
| `Delete`                          | `Trash2`     |
| `AddPhotoAlternate` (upload area) | `Upload`     |

### Styles

| MUI                                                  | Tailwind                      |
| ---------------------------------------------------- | ----------------------------- |
| `borderRadius={2}`                                   | `rounded-lg`                  |
| `border="dashed"`                                    | `border-dashed`               |
| `borderColor="grey.200"`                             | `border-gray-300`             |
| `sx={{ transition: 'all 0.325s' }}`                  | `transition-all duration-300` |
| `sx={{ ':hover': { backgroundColor: 'grey.100' } }}` | `hover:bg-gray-50`            |

### Layout

| MUI                     | Tailwind                        |
| ----------------------- | ------------------------------- |
| `Stack direction="row"` | `flex gap-2`                    |
| `position="absolute"`   | `absolute`                      |
| `Box`                   | `div`                           |
| `Typography`            | `p` ou `span` avec classes text |

## 🚀 Fonctionnalités avancées à implémenter

### 1. Drag & Drop

```tsx
const [isDragOver, setIsDragOver] = useState(false);

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(true);
};

const handleDragLeave = () => {
  setIsDragOver(false);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect({ target: { files } } as any);
  }
};
```

### 2. Validation de fichiers

```tsx
const validateFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return 'Fichier trop volumineux (max 5MB)';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Format non supporté (JPEG, PNG, WebP uniquement)';
  }

  return null;
};
```

### 3. États de chargement

```tsx
const [isUploading, setIsUploading] = useState(false);

// Dans handleImageUpload
const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  // Traitement du fichier...
  setIsUploading(false);
};
```

### 4. Compression d'image

```tsx
const compressImage = (file: File, maxWidth = 1200): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
};
```

## 📦 Dépendances requises

```json
{
  "dependencies": {
    "lucide-react": "^0.263.1",
    "next": "^13.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0"
  }
}
```

## 🔧 Configuration Tailwind

Assurez-vous que ces classes sont disponibles dans votre `tailwind.config.js` :

```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionDuration: {
        300: '300ms'
      }
    }
  }
};
```

## ✅ Checklist de migration

- [ ] Créer la structure de dossiers
- [ ] Implémenter le hook `useImageHandler`
- [ ] Créer tous les composants avec Tailwind
- [ ] Remplacer les icônes MUI par Lucide
- [ ] Implémenter l'adaptateur Formik si nécessaire
- [ ] Tester l'upload d'images
- [ ] Tester la suppression d'images
- [ ] Vérifier la responsivité
- [ ] Ajouter les fonctionnalités avancées (drag & drop, validation, etc.)

## 🎉 Résultat

Cette migration préserve l'UX/UI originale tout en utilisant une stack moderne :

- **Styles cohérents** avec Tailwind CSS
- **Icônes légères** avec Lucide React
- **Performance optimisée** avec Next.js Image
- **Accessibilité maintenue**
- **Typage TypeScript strict**

Le composant reste **modulaire**, **réutilisable** et **facilement personnalisable** pour différents contextes d'usage.
